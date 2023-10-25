import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import styles from './chooser.css?inline';
import '../checkbox/checkbox.component';
import '../input/input.component';
import '../dropdown/dropdown.component';
import '../menu/menu.component';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';

export interface SearchCategory {
  fieldName: string;
  fieldVal: string;
}

export interface CheckedSearchCategory extends SearchCategory {
  checked: boolean;
}

/**
 * @property data - Array of elements that should be available to select
 * @property filterCategories - Array of categories to customize the filter functionality
 * @property filterFn - Override filter function with custom filtering
 * @property mapToDisplay - Override function to map from data entity to display string
 */
@customElement('dss-chooser')
export default class Chooser extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ attribute: false })
  public data?: any[];

  public _filterCategories?: SearchCategory[];

  @property({ attribute: false })
  get filterCategories() {
    return this._filterCategories;
  }

  set filterCategories(val: SearchCategory[] | undefined) {
    this._filterCategories = val;
    this.initializeCheckedFilterCategories();
  }

  @property({ attribute: false })
  public filterFn?: (entry: any, term: string) => boolean;

  @property({ attribute: false })
  public mapToDisplay: (entry: any) => string = (entry) => entry;

  @state()
  private inputFilterValue = '';

  @state()
  private checkedFilterCategories: CheckedSearchCategory[] = [];

  override render() {
    return html`
      <div class="chooser-container">
        <dss-dropdown
          @input=${(event: InputEvent) => this.handleTextInput(event)}
          editable
          @keydown="${this.handleKey}"
        >
          <dss-menu>
            ${when(this.data, () =>
              this.data
                ?.filter(entry => this.applyFilter(entry))
                .map(item => html`
                  <dss-menu-item .value="${item}">${this.mapToDisplay(item)}</dss-menu-item>`),
            )}
          </dss-menu>
        </dss-dropdown>

        <dss-dropdown icon="settings-ui" size="compact" .multiSelect="${true}">
          <dss-menu>
            ${this.checkedFilterCategories?.map(category => html`
              <dss-menu-item
                .value="${category}"
                @click=${(event: PointerEvent) => this.clickDetected(event, category)}
                @keydown=${(event: KeyboardEvent) => this.onCategoriesDropDownKeydown(event, category)}
              >
                <dss-checkbox
                  .label=${category.fieldName}
                  .checked=${category.checked}
                  size="compact"
                  tabindex="-1"
                ></dss-checkbox>
              </dss-menu-item>`,
            )}
          </dss-menu>
        </dss-dropdown>
      </div>
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.initializeCheckedFilterCategories();
  }

  private handleTextInput(event: InputEvent) {
    const inputElement = event.composedPath()[0];
    if (inputElement && inputElement instanceof HTMLInputElement) {
      this.inputFilterValue = inputElement.value;
    }
  }

  private toggleItemCheck(category: CheckedSearchCategory) {
    category.checked = !category.checked;
    this.requestUpdate();
  }

  private applyFilter(entry: any) {
    if (!this.filterFn) {
      return true;
    }
    return this.filterFn(entry, this.inputFilterValue);
  }

  private initializeCheckedFilterCategories(): void {
    if (this.filterCategories) {
      this.checkedFilterCategories = this.filterCategories.map(category => {
        return {
          ...category,
          checked: false,
        };
      });
    }
  }

  private onCategoriesDropDownKeydown(event: KeyboardEvent, category: CheckedSearchCategory) {
    if (ActionKeystrokes.includes(event.key)) {
      this.toggleItemCheck(category);
    }
  }

  private clickDetected(event: MouseEvent, category: CheckedSearchCategory) {
    event.preventDefault();
    if (event.detail > 0) {
      this.toggleItemCheck(category);
    }
  }

  private handleKey = (event: KeyboardEvent) => {
    const inputElement = event.composedPath()[0] as HTMLInputElement;
    if (event.key === 'Escape') {
      this.inputFilterValue = '';
      inputElement.value = '';
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-chooser': Chooser;
  }
}
