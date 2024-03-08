import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './flyout.css?inline';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { Placement } from '@floating-ui/dom';
import '../outsideClick/outsideClick.component';
import '../../internals/floatingElement/floatingElement';
import { Closable } from '../../internals/escController/closable';
import { deregisterOpenComponent, registerOpenComponent } from '../../internals/escController/escController';

export interface FlyoutEventsPayloadMap {
  'dss-flyout-state-change': boolean;
}

export type DssFlyoutStateChangeEvent = CustomEvent<boolean>;
/**
 * @property placement - Specify where the flyout will be shown if there is enough space, relative to the trigger. Default: 'bottom-start'. Unsetting placement defaults to auto placement.
 * @property arrow - Draws an arrow between the trigger and the flyout
 * @property {boolean} updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @slot slot - Pass the content of the flyout
 * @slot trigger - The flyouts trigger
 * @fires {DssFlyoutStateChangeEvent} dss-flyout-state-change - Fires when the flyout changes state
 */
@customElement('dss-flyout')
export default class Flyout extends BaseElement<FlyoutEventsPayloadMap> implements Closable {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement?: Placement = 'bottom';

  @property({ type: Boolean })
  public arrow = false;

  @property({ type: Boolean, reflect: true, attribute: 'aria-expanded' })
  public open = false;

  @property({ type: Boolean })
  public updateOnAnimate?: boolean;

  override render() {
    return html`
      <dss-outside-click .onOutsideClick="${() => this.open && this.close()}">
        <dss-floating
          placement="${ifDefined(this.placement)}"
          .active="${this.open}"
          .arrow="${this.arrow}"
          .updateOnAnimate="${ifDefined(this.updateOnAnimate)}"
        >
          <span
            slot="anchor"
            class="trigger-area"
            @keydown="${this.handleKeyPress}"
            @click="${this.toggle}"
          >
            <slot name="trigger"></slot>
          </span>

          <slot></slot>
        </dss-floating>
      </dss-outside-click>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    deregisterOpenComponent(this);
  }

  private onStateChange(isOpen: boolean) {
    this.dispatchCustomEvent('dss-flyout-state-change', isOpen);
    if (isOpen) {
      registerOpenComponent(this);
    } else {
      deregisterOpenComponent(this);
    }
  }

  close() {
    this.open = false;
    this.onStateChange(this.open);
  }

  private toggle() {
    this.open = !this.open;
    this.onStateChange(this.open);
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (ActionKeystrokes.includes(event.key)) {
      event.preventDefault();
      this.toggle();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-flyout': Flyout;
  }

  interface WindowEventMap {
    'dss-flyout-state-change': DssFlyoutStateChangeEvent;
  }
}
