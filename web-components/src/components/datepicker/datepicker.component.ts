import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Core, easepick } from '@easepick/core';
import styles from './datepicker.css?inline';
import customStyles from './customize-ease.css?inline';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../input/input.component';
import '../flyout/flyout.component';
import { InputErrorState, InputSize } from '../input/input.component';
import { KbdPlugin } from '@easepick/kbd-plugin';
import { RangePlugin } from '@easepick/range-plugin';
import { IPickerConfig } from '@easepick/core/dist/types';

const DEFAULT_LOCALE = 'de-CH';

export interface DatepickerTranslations {
  dayOne?: string;
  dayPlural?: string;
}

export const DEFAULT_DATEPICKER_TRANSLATIONS: DatepickerTranslations = {
  dayOne: 'day',
  dayPlural: 'days',
};

export const RANGE_DELIMITER = ' - ';
export const RANGE_DELIMITER_REGEX = /\s*-\s*/;
export const RANGE_DATE_FORMAT = 'dd.MM.yyyy';

/**
 * @property name - Specify name property for form handling
 * @property value - Specify specific start date and represent form value state
 * @property label - Pass label to be shown on input
 * @property placeholder - Pass placeholder to be shown on input
 * @property required - Specify if form element is required
 * @property disabled - Specify if form element is disabled
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @property range - Specify if the datepicker should be a range picker
 * @property size - Specify size of the input field
 * @property block - Let datepicker input element grow full width
 * @fires {Event} change - Fires when form state changed
 */
@customElement('dss-datepicker')
export default class Datepicker extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public name?: string;

  @property()
  public value = '';

  @property()
  public label?: string;

  @property()
  public placeholder?: string;

  @property()
  public required = false;

  @property({ reflect: true, type: Boolean })
  public disabled = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  @property()
  public locale? = DEFAULT_LOCALE;

  @property()
  public range = false;

  @property()
  public size: InputSize = 'comfortable';

  @property({ type: Boolean, reflect: true })
  public block = false;

  @property({ attribute: false })
  set translations(overwrittenTranslations: DatepickerTranslations) {
    this._translations = {
      ...DEFAULT_DATEPICKER_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations() {
    return this._translations;
  }

  private _translations: DatepickerTranslations = DEFAULT_DATEPICKER_TRANSLATIONS;

  private inputRef: Ref<HTMLInputElement> = createRef();
  private easePickInputRef: Ref<HTMLInputElement> = createRef();
  private datePicker!: easepick.Core;
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-flyout placement="bottom-start">
        <dss-input
          ?block="${this.block}"
          label="${ifDefined(this.label)}"
          .errorState="${this.errorState}"
          .message="${this.message}"
          .size="${this.size}"
          .hideMessage="${this.message === undefined}"
          slot="trigger"
        >
          <input
            type="${this.usesDateInput() ? 'date' : 'text'}"
            placeholder="${ifDefined(this.placeholder)}"
            ${ref(this.inputRef)}
            ?required="${this.required}"
            .disabled="${this.disabled}"
            @blur="${() => this.parseFromUserInput(this.inputRef.value!.value)}"
            @click="${(event: MouseEvent) => event.preventDefault()}"
            value="${this.value}"
          >
          <dss-button slot="input-button" type="icon-only" .disabled="${this.disabled}">
            <dss-icon icon="date" size="medium"></dss-icon>
          </dss-button>
        </dss-input>
        <div>
          <input type="hidden" ${ref(this.easePickInputRef)}/>
        </div>
      </dss-flyout>
    `;
  }

  override firstUpdated(): void {
    const datePickerConfig = {
      doc: this.shadowRoot,
      element: this.easePickInputRef.value!,
      inline: true,
      visible: true,
      lang: this.locale,
      format: this.range ? RANGE_DATE_FORMAT.toUpperCase() : 'YYYY-MM-DD',
      css: customStyles,
      zIndex: 1,
      readonly: false,
      plugins: [KbdPlugin],
      KbdPlugin: {
        html: '<span tabindex="-1"></span>',
      },
      RangePlugin: {
        locale: {
          one: this.translations.dayOne,
          other: this.translations.dayPlural,
        },
        delimiter: RANGE_DELIMITER,
      },
      setup: (picker: Core) => {
        picker.on('select', () => {
          this.syncInputFromDatePicker(this.easePickInputRef.value!.value);
        });
        this.updateFormValueAndValidity();
      },
    } as IPickerConfig;
    if (this.range) {
      datePickerConfig.plugins!.push(RangePlugin);
      if (this.value) {
        const [start, end] = this.parseDateRangeFromValue();
        // 28.04.2023 the typing in the RangePlugin library is wrong. Should be `Date | string | number`
        datePickerConfig.RangePlugin!.startDate = start as any;
        datePickerConfig.RangePlugin!.endDate = end as any;
      }
    } else {
      datePickerConfig.date = this.value;
    }
    this.datePicker = new easepick.create(datePickerConfig);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.datePicker.destroy();
  }

  public getStartDate(): Date {
    return this.datePicker.getStartDate().toJSDate();
  }

  public getEndDate(): Date {
    return this.datePicker.getEndDate().toJSDate();
  }

  private usesDateInput(): boolean {
    return !this.range;
  }

  private syncInputFromDatePicker(input: string): void {
    this.inputRef.value!.value = input;
    this.updateValue(input);
  }

  private parseFromUserInput(userInput: string): void {
    if (!userInput) {
      this.datePicker.clear();
    } else if (this.range) {
      const [start, end] = userInput.split(RANGE_DELIMITER_REGEX);
      this.datePicker.setDateRange(start, end);
    } else {
      this.datePicker.setDate(userInput);
      this.datePicker.gotoDate(userInput);
    }
    this.updateValue(userInput);
  }

  private parseFromPropertyChange(propertyValue: string): void {
    if (propertyValue !== this.easePickInputRef.value?.value) {
      if (propertyValue) {
        if (this.range) {
          const [start, end] = propertyValue.split(RANGE_DELIMITER_REGEX);
          this.datePicker.setDateRange(start, end);
        } else {
          this.datePicker.gotoDate(this.value);
          if (this.value !== this.easePickInputRef?.value?.value) {
            this.datePicker.setDate(this.value);
          }
        }
      } else {
        this.inputRef!.value!.value = '';
        this.datePicker.clear();
      }
      this.updateFormValueAndValidity();
    }
  }

  private updateValue(value: string): void {
    this.value = value;
    this.updateFormValueAndValidity();
    this.dispatchChangeEvent();
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (this.datePicker && changedProperties.has('value')) {
      this.parseFromPropertyChange(this.value);
    }
    if (this.datePicker && changedProperties.has('locale')) {
      this.datePicker.options.lang = this.locale;
      this.datePicker.renderAll();
    }
    if (this.datePicker && changedProperties.has('range')) {
      this.datePicker.destroy();
      this.firstUpdated();
    }
  }

  private parseDateRangeFromValue(): string[] {
    return this.value.split(RANGE_DELIMITER_REGEX);
  }

  private updateFormValueAndValidity(): void {
    this.internals.setFormValue(this.inputRef.value!.value);
    this.internals.setValidity(this.inputRef.value!.validity, this.inputRef.value!.validationMessage);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-datepicker': Datepicker;
  }
}
