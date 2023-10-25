import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './checkbox.css?inline';
import { classMap } from 'lit-html/directives/class-map.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { InputErrorState, InputSize } from '../input/input.component';
import '../icon/icon.component';
import '../../internals/hint/hint';

/**
 * @property name - Specify name property for form handling
 * @property value - Represents the form value state
 * @property type - Statically set to "checkbox" for form libraries to understand its purpose
 * @property size - Specify size of checkbox
 * @property label - Pass label that should be displayed next to the checkbox
 * @property errorState - Define the error state of the component
 * @property {string} message - Specify the message shown with the errorState
 * @property checked - Map the checked state of the underlying checkbox
 * @property indeterminate - Map the indeterminate state of the underlying checkbox
 * @property disabled - Map the disabled state of the underlying checkbox
 * @property required - Map the required state of the underlying checkbox
 * @property {string} name - Specify the name of the form control as it will show up in FormData
 * @fires {Event} change - Fires when form state changed
 */
@customElement('dss-checkbox')
export default class Checkbox extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public name?: string;

  @property()
  public value?: string;

  @property()
  public readonly type = 'checkbox';

  @property({ reflect: true })
  public size: InputSize = 'comfortable';

  @property({ type: String })
  public label = '';

  @property({ type: String })
  public errorState?: InputErrorState;

  @property({ type: String })
  public message?: string;

  @property({ type: Boolean })
  public checked = false;

  @property({ type: Boolean })
  public indeterminate = false;

  @property({ type: Boolean })
  public disabled = false;

  @property({ type: Boolean })
  public required = false;

  private internals: ElementInternals;
  private inputRef: Ref<HTMLInputElement> = createRef();

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <label
        class=${classMap({
          'error': this.errorState === 'error',
          'warning': this.errorState === 'warning',
          'filled': this.checked || this.indeterminate,
        })}
        data-testid="label"
      >
        <div class="input-wrapper">
          <input
            ${ref(this.inputRef)}
            type="checkbox"
            .checked=${this.checked}
            .indeterminate=${this.indeterminate}
            .disabled=${this.disabled}
            .required=${this.required}
            @change=${(event: Event) => this.handleCheckboxChange(event)}
          >
          ${when(this.checked || this.indeterminate, () => html`
            <dss-icon
              role="figure"
              icon=${this.indeterminate ? 'minus-sm' : 'so-checkmark'}
              size=${this.size === 'compact' ? 'xsmall' : 'small'}
            ></dss-icon>
          `)}
        </div>
        <span>
          ${when(this.required, () => html`<span class="required">*</span>`)}
          ${this.label}
        </span>
      </label>
      ${when(this.size !== 'compact', () => html`
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      `)}
    `;
  }

  private handleCheckboxChange(event: Event) {
    const checkboxElement = event.target as HTMLInputElement;
    this.checked = checkboxElement.checked;
    this.value = checkboxElement.value;
    this.indeterminate = false;
    this.dispatchChangeEvent(event);
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('checked')) {
      this.internals.setFormValue(this.checked ? 'on' : null);
      this.value = this.checked ? 'on' : undefined;
      this.internals.setValidity(this.inputRef.value!.validity, this.inputRef.value!.validationMessage, this.inputRef!.value);
    }
    super.updated(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-checkbox': Checkbox;
  }
}
