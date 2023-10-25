import { customElement, property, query, state } from 'lit/decorators.js';
import BaseElement from '../../../internals/baseElement/baseElement';
import styles from './columnFilter.css?inline';
import { Column, Header } from '@tanstack/table-core';
import { html, unsafeCSS } from 'lit';
import { DssInputDebouncedEvent } from '../../input/input.component';
import { OperatorKey, operatorKeys, operators, parseDSL } from './dslParser';
import '../../input/input.component';
import '../../button/button.component';
import '../../icon/icon.component';
import '../../datepicker/datepicker.component';
import '../../dropdown/dropdown.component';
import '../../menu/menu.component';
import '../../menuItem/menuItem.component';
import '../../checkbox/checkbox.component';
import Datepicker, { DatepickerTranslations } from '../../datepicker/datepicker.component';
import { endOfDay, isValid, startOfDay } from 'date-fns';
import { TemplateResult } from 'lit-html';
import Dropdown from '../../dropdown/dropdown.component';
import { DssMenuSelectionEvent } from '../../menu/menu.component';
import { NumericFilterBand, NumericFilterMask } from './customFilters';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { classMap } from 'lit-html/directives/class-map.js';

export interface ColumnFilterTranslations {
  numericTranslations?: NumericTranslations;
  datepickerTranslations?: DatepickerTranslations;
  multiSelectTranslations?: MultiSelectTranslations;
}

export type NumericTranslations = {
  [key in OperatorKey]: string;
} & {
  'condition': string;
  'value': string;
}

export interface MultiSelectTranslations {
  selectAll: string;
  empty: string;
}

export const DEFAULT_COLUMN_FILTER_TRANSLATIONS: ColumnFilterTranslations = {
  numericTranslations: {
    condition: 'Condition',
    value: 'Value',
    equals: 'Equals',
    not: 'Not',
    greaterThan: 'Greater than',
    greaterThanOrEqualTo: 'Greater than or equal to',
    lessThan: 'Less than',
    lessThanOrEqualTo: 'Less than or equal to',
    complex: 'User defined',
  },
  multiSelectTranslations: {
    selectAll: '(Select all)',
    empty: '(Empty)',
  },
};

@customElement('dss-column-filter')
export default class ColumnFilter extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ attribute: false })
  public header!: Header<any, unknown>;

  @property({ type: Boolean })
  disabled = false;

  @property({ attribute: false })
  set translations(overwrittenTranslations: ColumnFilterTranslations) {
    this._translations = {
      ...DEFAULT_COLUMN_FILTER_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations(): ColumnFilterTranslations {
    return this._translations;
  }

  private _translations: ColumnFilterTranslations = DEFAULT_COLUMN_FILTER_TRANSLATIONS;

  @state()
  private isError = false;

  @state()
  private multiSelectState: 'all' | 'none' | 'some' = 'all';

  @query('input,dss-datepicker,dss-dropdown')
  private filterElement!: HTMLInputElement | Datepicker | Dropdown;

  @state()
  private dropdownState: OperatorKey | undefined = undefined;

  @state()
  private numericFilterFlyoutInputValue = '';

  protected render() {
    if (!this.header.column.getCanFilter()) {
      return;
    }

    if (this.header.column.columnDef.filterFn === 'dateRange') {
      return this.renderDateRangePicker();
    }
    if (this.header.column.columnDef.filterFn === 'numeric') {
      return this.renderNumberInput();
    }
    if (this.header.column.columnDef.filterFn === 'select') {
      return this.renderSelect(this.header.column);
    }
    if (this.header.column.columnDef.filterFn === 'multiSelect') {
      return this.renderMultiSelect(this.header.column);
    }

    return this.renderTextInput();
  }

  private renderMultiSelect(column: Column<any>): TemplateResult<1> {
    const allKeys = Array.from(column.getFacetedUniqueValues().keys()).map(String);
    const filterValues = this.multiSelectState === 'all' ? allKeys : column.getFilterValue() as Array<string>;
    return html`
      <dss-dropdown
        block
        size="compact"
        .multiSelect="${true}"
        .values="${filterValues}"
        .hideAllSelected="${true}"
        .disabled="${this.disabled}"
        @change="${(event: Event) => this.handleMultiSelectDropdownChange(column, allKeys, event)}"
      >
        <dss-menu @dss-menu-selection="${(event: DssMenuSelectionEvent) => this.handleSelectAll(column, event)}">
          <dss-menu-item value="all" .selected="${this.multiSelectState === 'all'}" data-dss-dropdown-ignore="${true}">
            <dss-checkbox
              size="compact"
              label="${this.translations.multiSelectTranslations!.selectAll}"
              .checked="${this.multiSelectState === 'all'}"
              .indeterminate="${this.multiSelectState === 'some'}"
            ></dss-checkbox>
          </dss-menu-item>
          ${this.sortKeys(allKeys).map((value) => html`
            <dss-menu-item value="${value}">
              <dss-checkbox
                size="compact"
                label="${this.getTextRepresentation(value)}"
              ></dss-checkbox>
            </dss-menu-item>
          `)}
        </dss-menu>
      </dss-dropdown>
    `;
  }

  private getTextRepresentation(value: string | number): string | number {
    if (typeof value === 'string') {
      return value.trim() || this.translations.multiSelectTranslations!.empty;
    }
    return value;
  }

  private handleMultiSelectDropdownChange(column: Column<any>, allKeys: string[], event: Event): void {
    if (event.target instanceof Dropdown) {
      column.setFilterValue(event.target.values);
      if (event.target.values.length === allKeys.length) {
        this.multiSelectState = 'all';
        column.setFilterValue(undefined);
      } else if (event.target.values.length === 0) {
        this.multiSelectState = 'none';
      } else {
        this.multiSelectState = 'some';
      }
    }
  }

  private handleSelectAll(column: Column<any>, event: DssMenuSelectionEvent): void {
    if (event.detail.value === 'all') {
      event.stopImmediatePropagation();
      this.multiSelectState = this.multiSelectState === 'all' ? 'none' : 'all';
      if (this.multiSelectState === 'all') {
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue([]);
      }
    }
  }


  private renderSelect(column: Column<any>): TemplateResult<1> {
    return html`
      <dss-dropdown
        block
        size="compact"
        .disabled="${this.disabled}"
        @change="${(event: Event) => this.header.column.setFilterValue((event.target as HTMLFormElement).value)}"
      >
        <dss-menu>
          <dss-menu-item>&nbsp;</dss-menu-item>
          ${this.sortKeys(Array.from(column.getFacetedUniqueValues().keys())).map((value) => html`
            <dss-menu-item value="${value}">${value}</dss-menu-item>
          `)}
        </dss-menu>
      </dss-dropdown>
    `;
  }

  private sortKeys(keys: Array<string | number>): Array<string | number> {
    if (isNumbers(keys)) {
      return keys.sort((a, b) => a - b);
    }
    return keys.sort();
  }

  private renderNumberInput(): TemplateResult<1> {
    return html`
      <dss-flyout placement="bottom-start">
        <dss-input
          block
          slot="trigger"
          size="compact"
          .errorState="${this.isError ? 'error' : undefined}"
          @dss-input-debounced=${({ detail }: DssInputDebouncedEvent) => {
            try {
              const dsl: NumericFilterMask | undefined = parseDSL(detail);
              this.header.column.setFilterValue(dsl);
              this.isError = false;

              if (dsl && dsl.bands.length > 0) {
                const [dropdownState, inputValueState] = numericBandsToFlyoutFormState(dsl.bands);
                this.dropdownState = dropdownState;
                this.numericFilterFlyoutInputValue = inputValueState?.toString() ?? '';
              } else {
                this.resetNumericFilterForm();
              }
            } catch (e) {
              this.isError = true;
              this.resetNumericFilterForm();
            }
          }}
        >
          <input
            type="text"
            name="numericFilter"
            .disabled="${this.disabled}"
            class=${classMap({ 'text-right': this.header.column.columnDef.meta?.alignRight ?? false })}
          >
        </dss-input>

        <form
          name="numericFilterFlyout"
          @submit=${(event: SubmitEvent) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const form = event.target as HTMLFormElement;
            if (form.reportValidity()) {
              const formData = formDataToJson(new FormData(form));
              this.handleFormSubmit(formData);
            }
          }}
        >
          <dss-dropdown
            label="${this.translations.numericTranslations!.condition}"
            name="condition"
            required="true"
            value="${ifDefined(this.dropdownState)}"
            @change="${(event: Event) => this.dropdownState = (event.target as Dropdown).value as OperatorKey}"
          >
            <dss-menu>
              ${operatorKeys.map(option => html`
                <dss-menu-item value="${option}">${this.translations.numericTranslations![option]}</dss-menu-item>
              `)}
            </dss-menu>
          </dss-dropdown>

          <dss-input block label="${this.translations.numericTranslations!.value}">
            <input
              name="value"
              required
              ?disabled="${this.dropdownState === 'complex'}"
              .value="${this.numericFilterFlyoutInputValue}"
            >
          </dss-input>

          <dss-button type="primary" .submit="${true}">
            Ok
          </dss-button>
        </form>
      </dss-flyout>
    `;
  }

  resetNumericFilterForm() {
    this.dropdownState = undefined;
    this.numericFilterFlyoutInputValue = '';
  }

  handleFormSubmit(formData: { condition: OperatorKey, value: string }) {
    const operator = operators[formData.condition];
    const filterValue = `${operator}${formData.value}`;
    this.filterElement.value = filterValue;
    this.header.column.setFilterValue(parseDSL(filterValue));
  }

  private renderTextInput(): TemplateResult<1> {
    return html`
      <dss-input
        block
        size="compact"
        @dss-input-debounced=${({ detail }: DssInputDebouncedEvent) => this.header.column.setFilterValue(detail)}
      >
        <input
          type="text"
          .disabled="${this.disabled}"
          class=${classMap({ 'text-right': this.header.column.columnDef.meta?.alignRight ?? false })}
        >
      </dss-input>
    `;
  }

  private renderDateRangePicker(): TemplateResult<1> {
    return html`
      <dss-datepicker
        block
        size="compact"
        .errorState="${this.isError ? 'error' : undefined}"
        .range="${true}"
        .translations="${this.translations.datepickerTranslations}"
        .disabled="${this.disabled}"
        @change="${(event: Event) => {
          const datepickerComponent = event.target as Datepicker;
          const dateRange = datepickerComponent.value;
          if (dateRange) {
            const filterMask = {
              from: startOfDay(datepickerComponent.getStartDate()),
              to: endOfDay(datepickerComponent.getEndDate()),
            };
            if (isValid(filterMask.from) && isValid(filterMask.to)) {
              this.isError = false;
              this.header.column.setFilterValue(filterMask);
            } else {
              this.isError = true;
              this.header.column.setFilterValue(undefined);
            }
          } else {
            this.header.column.setFilterValue(undefined);
          }
        }}"
      ></dss-datepicker>
    `;
  }

  public clear() {
    this.isError = false;
    if (this.filterElement instanceof Dropdown && this.header.column.columnDef.filterFn === 'multiSelect') {
      this.multiSelectState = 'all';
      this.filterElement.values = Array.from(this.header.column.getFacetedUniqueValues().keys()).map(String);
    } else if (this.header.column.columnDef.filterFn === 'numeric') {
      this.filterElement.value = '';
      this.dropdownState = undefined;
      this.numericFilterFlyoutInputValue = '';
    } else {
      this.filterElement.value = '';
    }
  }
}

function isNumbers(array: Array<string | number>): array is number[] {
  return array.every((value) => typeof value === 'number');
}

function formDataToJson(data: FormData): { condition: OperatorKey, value: string } {
  return {
    condition: data.get('condition') as OperatorKey,
    value: data.get('value') as string,
  };
}

export function numericBandsToFlyoutFormState(bands: NumericFilterBand[]): [OperatorKey, number | undefined] {
  if (isComplexNumericFilter(bands)) {
    return ['complex', undefined];
  } else {
    const band = bands[0];
    if (band.lower === band.upper && band.lower !== undefined) {
      return ['equals', band.lower];
    } else if (!Number.isNaN(band.not)) {
      return ['not', band.not];
    } else if (band.lower !== undefined && band.strictLower) {
      return ['greaterThan', band.lower];
    } else if (band.lower !== undefined) {
      return ['greaterThanOrEqualTo', band.lower];
    } else if (band.upper !== undefined && band.strictUpper) {
      return ['lessThan', band.upper];
    } else {
      return ['lessThanOrEqualTo', band.upper];
    }
  }
}

/**
 * A complex numeric filter is a filter that has either multiple NumericFilterBands or a single one with the complex
 * flag set to true.
 */
function isComplexNumericFilter(bands: NumericFilterBand[]): boolean {
  if (bands.length > 1) {
    return true;
  }
  return bands[0].complex;
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-column-filter': ColumnFilter;
  }
}
