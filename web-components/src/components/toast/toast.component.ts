import BaseElement from '../../internals/baseElement/baseElement';
import { html, unsafeCSS } from 'lit';
import styles from './toast.css?inline';
import { customElement, property } from 'lit/decorators.js';
import { Icons } from '../icon/icons';
import { when } from 'lit-html/directives/when.js';
import '../icon/icon.component';
import '../button/button.component';

export const toastTypes = [
  'error',
  'warning',
  'info',
] as const;
export type ToastType = typeof toastTypes[number];

const statusToIcon: Record<ToastType, Icons> = {
  error: 'stop-circle',
  warning: 'warning-circle',
  info: 'info',
};

export type DssToastClosedEvent = CustomEvent<void>;

export interface ToastEventsPayloadMap {
  'dss-toast-closed': void;
}

/**
 * @property type - Set the display type of the toast
 * @property heading - Pass heading to show
 * @property message - Pass message to show
 * @property closable - Allow toast to be closed. This will emit the closed event and has to be handled outside the component
 * @property hideIcon - Allow toast to hide the icon.
 * @fires {DssToastClosedEvent} dss-toast-closed - Fires when the toast has been closed
 */
@customElement('dss-toast')
export default class Toast extends BaseElement<ToastEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public type: ToastType = 'info';

  @property()
  public heading?: string;

  @property()
  public message?: string;

  @property({ type: Boolean })
  public closable = false;

  @property({ type: Boolean })
  public hideIcon = false;

  protected render() {
    return html`
      <div role="alert" class="container ${this.type}">
        <div class="text-container">
          ${when(this.heading, () => html`
            <span>${this.heading}</span>
          `)}
          ${when(this.message, () => html`
            <small>${this.message}</small>
          `)}
        </div>

        ${when(!this.hideIcon, () => html`
          <div class="icon-container">
            <dss-icon size="huge" icon="${statusToIcon[this.type]}"></dss-icon>
          </div>
        `)}

        ${when(this.closable, () => html`
          <div class="close-container">
            <dss-button type="icon-only" @click=${() => this.dispatchCustomEvent('dss-toast-closed')}>
              <dss-icon size="large" icon="close-lg"></dss-icon>
            </dss-button>
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-toast': Toast;
  }

  interface WindowEventMap {
    'dss-toast-closed': DssToastClosedEvent;
  }
}
