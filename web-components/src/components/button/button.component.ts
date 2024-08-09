import { html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './button.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ElementInternals } from 'element-internals-polyfill/dist/element-internals';
import { when } from 'lit/directives/when.js';
import '../tooltip/tooltip.component';
import '../spinner/spinner.component';
import { SpinnerType } from '../spinner/spinner.component';

export const buttonTypes = [
  'primary',
  'secondary',
  'ghost',
  'icon-only',
] as const;
export type ButtonType = typeof buttonTypes[number];
export const buttonSpacings = [
  'text',
  'icon',
  'icon-only',
] as const;
export type ButtonSpacing = typeof buttonSpacings[number];

export const buttonSides = [
  'none',
  'all',
  'left',
  'right',
] as const;
export type ButtonSide = typeof buttonSides[number];

/**
 * @slot slot - Pass the HTML structure that should be displayed inside the button
 * @property spacing - Set the inner spacings of the button
 * @property type - Set the type of the button
 * @property removeRadius - Specify if there should be no rounded borders
 * @property removeBorder - Specify if there should be no border
 * @property disabled - Specify if the button is disabled
 * @property tooltip - Show given text as tooltip
 * @property submit - When true, clicks on the button will submit the form it is attached to
 * @property {string} form - Set id of form this button should be attached to when outside of form tag
 * @property loading - Set loading state
 */
@customElement('dss-button')
export default class Button extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String })
  spacing: ButtonSpacing = 'text';

  @property({ type: String })
  type: ButtonType = 'primary';

  @property({ type: String })
  removeRadius: ButtonSide = 'none';

  @property({ type: String })
  removeBorder: ButtonSide = 'none';

  @property({ type: Boolean })
  disabled = false;

  @property()
  tooltip?: string;

  @property({ type: Boolean })
  submit = false;

  @property({ reflect: true })
  form?: string;

  @property({ type: Boolean, reflect: true })
  loading = false;


  @query('button')
  public nativeButton?: HTMLButtonElement;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    const slotName = this.tooltip ? 'trigger' : undefined;
    const button = html`
      <button
        slot="${ifDefined(slotName)}"
        part="button"
        class=${`type-${this.type} spacing-${this.buttonSpacing} remove-radius-${this.removeRadius} remove-border-${this.removeBorder}`}
        ?disabled=${this.disabled}
      >
        <slot @click="${this.handleClickEvent}"></slot>
        ${when(this.loading, () => html`
          <dss-spinner type="${this.mapButtonTypeToSpinnerType()}" size="small"></dss-spinner>
        `)}
      </button>
    `;

    return this.tooltip
      ? this.renderTooltip(button)
      : button;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.handleSubmit);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleSubmit);
  }

  private get buttonSpacing(): ButtonSpacing {
    if (this.type === 'icon-only') {
      return 'icon-only';
    }

    return this.spacing;
  }

  private mapButtonTypeToSpinnerType(): SpinnerType {
    if (this.type === 'primary') {
      return 'primary';
    } else if (this.type === 'ghost'){
      return 'ghost';  
    }
    return 'secondary';
  }

  private renderTooltip(trigger: TemplateResult) {
    return html`
      <dss-tooltip>
        ${trigger}
        ${this.tooltip}
      </dss-tooltip>
    `;
  }

  private handleClickEvent(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /** Untestable right now, because nwsapi inside jsdom fails because of a selector from element-internals-polyfill.
   * see: https://github.com/dperini/nwsapi/issues/69
   */
  private handleSubmit = () => {
    if (this.submit) {
      this.internals.form.requestSubmit();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-button': Button;
  }
}
