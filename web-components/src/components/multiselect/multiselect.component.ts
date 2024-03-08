import { PropertyDeclaration, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit-html/directives/ref.js';
import { html } from 'lit-html';
import styles from './multiselect.css?inline';
import '../button/button.component';
import '../icon/icon.component';
import '../label/label.component';
import '../../internals/hint/hint';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { InputErrorState } from '../input/input.component';
import { LabelPlacement } from '../label/label.component';
import { Placement } from '@floating-ui/dom';
import { Closable } from '../../internals/escController/closable';
import { deregisterOpenComponent, registerOpenComponent } from '../../internals/escController/escController';

export interface MultiselectTranslations {
  valueMissing?: string;
}

const DEFAULT_MULTISELECT_TRANSLATIONS: MultiselectTranslations = {
  valueMissing: 'Please select an option',
};

/**
 * @property name - Specify name property for form handling
 * @property label - The label that will be shown above the input
 * @property labelPlacement - Specify where the label should be placed relative to the multiselect
 * @property placeholder - The placeholder text that will be shown inside the input
 * @property options - Array of options the user can select from
 * @property errorState - Specify the error state of the element
 * @property {string} message - Specify the message shown with the errorState
 * @property value - Specify currently selected option(s)
 * @property mapToListItem - Override function to map from option entity to dropdown list display string
 * @property mapToPill - Override function to map from option entity to pill display string
 * @property toNativeFormValue - Override to map from selected options array to data for HTML form
 * @property filter - Override filter functionality to customize how options get filtered
 * @property limit - Specify the maximum amount of elements that can be selected at once. Default is 0 for unlimited
 * @property required - Specify if form element is required
 * @fires {Event} change - Fires when form state changed
 */
@customElement('dss-multiselect')
export default class Multiselect extends BaseElement implements Closable {

  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  placeholder = '';

  @property()
  label = '';

  @property({ reflect: true })
  public labelPlacement: LabelPlacement = 'top';

  @property()
  public errorState?: InputErrorState;

  @property({ type: Boolean })
  public required = false;

  @property()
  public message?: string;

  @property({ attribute: false })
  options: any[] = [];

  @property({ attribute: false })
  value: any[] = [];

  @property()
  name = '';

  @property({ type: Number })
  limit?: number;

  @property({ attribute: false })
  mapToPill: (element: any) => string = defaultMapToDisplay;

  @property({ attribute: false })
  mapToListItem: (element: any) => string = defaultMapToDisplay;

  @property({ attribute: false })
  public toNativeFormValue: (options: any[]) => FormData = (options: any[]) => {
    const formData = new FormData();

    options.forEach(option => {
      formData.append(this.name, option);
    });

    return formData;
  };

  @property({ attribute: false })
  filter: (option: any, inputValue?: string) => boolean = defaultFilter;

  public placement?: Placement = 'bottom-start';

  @property({ attribute: false })
  set translations(overwrittenTranslations: MultiselectTranslations) {
    this._translations = {
      ...DEFAULT_MULTISELECT_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations() {
    return this._translations;
  }

  private _translations: MultiselectTranslations = DEFAULT_MULTISELECT_TRANSLATIONS;

  @state()
  private showDropdown = false;

  private inputWrapperRef: Ref<HTMLDivElement> = createRef();
  private inputRef: Ref<HTMLInputElement> = createRef();
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    const inputValue = this.inputRef.value?.value;
    const filteredOptions = this.options
      .filter((option) => !this.value.map(this.mapToPill).includes(this.mapToPill(option)))
      .filter((option) => this.filter(option, inputValue));

    return html`
      <div class="container" ${ref(this.inputWrapperRef)}>
        <dss-label
          label="${ifDefined(this.label)}"
          ?required="${this.required}"
          @click="${this.handleLabelClick}"
        ></dss-label>

        <dss-outside-click .onOutsideClick="${() => this.showDropdown && this.close()}">
          <dss-floating
            placement="${ifDefined(this.placement)}"
            .active="${this.showDropdown}"
          >
            <div
              class="pills-input-wrapper"
              slot="anchor"
              data-testid="custom-element"
            >
              ${this.value.map((item) => html`
                <div class="pill">
                  <span>${this.mapToPill(item)}</span>
                  <dss-button type="icon-only" spacing="icon" @click=${() => this.unselect(item)}>
                    <dss-icon size="xsmall" icon="close-lg"></dss-icon>
                  </dss-button>
                </div>
              `)}

              <input
                aria-label="${ifDefined(this.label)}"
                ${ref(this.inputRef)}
                placeholder=${this.placeholder}
                autocomplete="off"
                @click=${this.open}
                @focus=${this.open}
                @input=${() => this.requestUpdate()}
                @keydown=${(e: KeyboardEvent) => this.handleSpecialKeys(e)}
              >
            </div>
            <dss-menu>
              ${filteredOptions.length > 0
                ? filteredOptions
                  .map((option) => html`
                    <dss-menu-item
                      @click=${() => this.select(option)}
                      @keydown=${(event: KeyboardEvent) => this.handleDropDownKeyboardNavigation(event, option)}
                      tabindex="0"
                      role="option"
                    >
                      ${this.mapToListItem(option)}
                    </dss-menu-item>

                  `)
                : html`
                  <dss-menu-item>No option</dss-menu-item>
                `
              }
            </dss-menu>
          </dss-floating>
        </dss-outside-click>
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      </div>
    `;
  }

  override requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration): void {
    if (name === 'value') {
      if (this.value) {
        this.setFormValueAndValidity();
      }
    }

    super.requestUpdate(name, oldValue, options);
  }

  select(selected: any) {

    if (this.limit && this.value.length >= this.limit) {
      this.value = [...this.value.slice(1), selected];
    } else {
      this.value = [...this.value, selected];
    }

    this.inputRef.value?.focus();
    this.inputRef.value!.value = '';
    this.dispatchChangeEvent();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    deregisterOpenComponent(this);
  }

  unselect(selected: string) {
    this.value = this.value.filter((option) => option !== selected);
    this.dispatchChangeEvent();
  }

  private setFormValueAndValidity() {
    if (this.internals) {
      this.internals.setFormValue(this.toNativeFormValue(this.value));

      this.internals.setValidity(
        { valueMissing: this.required && (this.value.length === 0) },
        this.translations.valueMissing,
        this.inputRef.value,
      );
    }
  }

  private handleSpecialKeys(event: KeyboardEvent) {

    if (event.key === 'Escape') {
      this.inputRef.value!.value = '';
      this.requestUpdate();
    }

    if (event.key === 'Backspace') {
      if (!this.inputRef.value?.value) {
        event.stopImmediatePropagation();
        this.value.pop();
        this.dispatchChangeEvent();
        this.requestUpdate();
      }
    }
  }

  private handleDropDownKeyboardNavigation(event: KeyboardEvent, option: any): void {
    if (ActionKeystrokes.includes(event.key)) {
      event.preventDefault();
      this.select(option);
    }
  }

  private handleLabelClick() {
    this.inputRef.value?.focus();
  }

  close() {
    this.showDropdown = false;
    this.onStateChange(this.showDropdown);
  }

  open() {
    this.showDropdown = true;
    this.onStateChange(this.showDropdown);
  }

  private onStateChange(isOpen: boolean) {
    if (isOpen) {
      registerOpenComponent(this);
    } else {
      deregisterOpenComponent(this);
    }
  }
}

function defaultFilter(option: any, inputValue?: string): boolean {
  if (!inputValue) {
    return true;
  }
  return JSON.stringify(option).toLowerCase().includes(String(inputValue).toLowerCase());
}

function defaultMapToDisplay(option: any): string {
  return String(option);
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-multiselect': Multiselect;
  }
}
