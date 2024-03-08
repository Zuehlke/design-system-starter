import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import styles from './label.css?inline';

export const labelPlacementOptions = ['top', 'left', 'right'] as const;
export type LabelPlacement = typeof labelPlacementOptions[number];

/**
 * @property required - Specify if label should show required flag
 * @csspart required - Change display property of required flag (default: none)
 */
@customElement('dss-label')
export default class Label extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: Boolean, reflect: true })
  public required = false;

  @property({ type: String })
  public label?: string;

  override render() {
    if (!this.label) {
      return nothing;
    }

    return html`
      <label>
        <span part="required">*</span>
        ${this.label}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-label': Label;
  }
}
