import { customElement, property } from 'lit/decorators.js';
import styles from './toggleButton.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../button/button.component';
import { ButtonSide, ButtonSpacing, ButtonType } from '../button/button.component';
import { html } from 'lit-html';
import { LitElement, PropertyValues, unsafeCSS } from 'lit';

export const toggleButtonTypes = [
  'default',
  'icon-only',
] as const;
export type ToggleButtonType = typeof toggleButtonTypes[number];

/**
 * @slot slot - Pass the HTML structure that should be displayed inside the button
 * @property spacing - Set the inner spacings of the button. For "icon-only" buttons defaults to "icon"
 * @property type - Set the type of the button
 * @property removeRadius - Specify if there should be no rounded borders
 * @property overlapBorder - Specify if the borders of this button should overlap and on which side
 * @property pressed - Specify if the button is pressed in which case the `selectedType` is used
 * @property disabled - Specify if the button is disabled
 * @property tooltip - Specify the label to be shown in a tooltip around the button. Mandatory for `icon-only` buttons
 * @property value - Specify value that is being picked up by the dss-button-group component
 *
 * @see {@link /button} button props
 */
@customElement('dss-toggle-button')
export default class ToggleButton extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];
  // delegatesFocus ensures clicks on slotted element passed to dss-button will trigger the right focus events on this component
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property()
  public spacing: ButtonSpacing = 'text';

  @property()
  public removeRadius: ButtonSide = 'none';

  @property()
  public overlapBorder: ButtonSide = 'none';

  @property()
  public type: ToggleButtonType = 'default';

  @property({ type: Boolean })
  public pressed = false;

  @property({ type: Boolean, reflect: true })
  public disabled = false;

  @property({ type: String })
  public value?: string;

  @property()
  public tooltip = '';

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.has('pressed')) {
      this.setHTMLButtonAriaPressed(this, this.pressed);
    }
  }

  setHTMLButtonAriaPressed(rootElement: HTMLElement, value: boolean) {
    const slottedHTMLButton = rootElement.shadowRoot?.querySelector('dss-button')?.nativeButton;

    if (slottedHTMLButton) {
      slottedHTMLButton.setAttribute('aria-pressed', `${value}`);
    }
  }

  protected render(): unknown {
    return html`
      <dss-button
        role="menuitemradio"
        spacing="${this.spacing}"
        type="${this.buttonType}"
        removeRadius="${this.removeRadius}"
        tooltip="${this.tooltip}"
        class=${`overlap-border-${this.overlapBorder}`}
        @click="${this.toggle}"
        ?disabled="${this.disabled}"
      >
        <slot></slot>
      </dss-button>
    `;
  }

  private toggle() {
    this.pressed = !this.pressed;
  }

  private get buttonType(): ButtonType {
    if (this.type === 'icon-only') {
      return this.type;
    }

    return this.pressed ? 'secondary' : 'ghost';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-toggle-button': ToggleButton;
  }
}
