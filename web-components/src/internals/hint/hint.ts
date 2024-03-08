import BaseElement from '../baseElement/baseElement';
import { customElement, property } from 'lit/decorators.js';
import { InputErrorState } from '../../components/input/input.component';
import { html } from 'lit-html';
import styles from './hint.css?inline';
import { unsafeCSS } from 'lit';
import '../../components/icon/icon.component';
import { when } from 'lit-html/directives/when.js';
import Button from '../../components/button/button.component';

const NON_BREAKING_SPACE = html`&nbsp;`;

/**
 * @property state - Specify error state
 * @property message - Pass message to be displayed
 */
@customElement('dss-hint')
export default class Hint extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public state?: InputErrorState;

  @property()
  public message?: string;

  protected render() {
    return html`
      <div class="message-wrapper">
        ${when(this.state, () => html`
          <dss-icon
            data-testid="error-icon"
            size="small"
            icon="${this.state === 'warning' ? 'warning-circle' : 'stop-circle'}"
          ></dss-icon>
        `)}
        <span>
          ${this.message ?? NON_BREAKING_SPACE}
        </span>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'dss-hint': Hint;
  }
}
