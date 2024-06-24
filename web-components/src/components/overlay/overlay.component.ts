import BaseElement from '../../internals/baseElement/baseElement';
import { html, PropertyValues, unsafeCSS } from 'lit';
import styles from './overlay.css?inline';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../button/button.component';
import '../icon/icon.component';
import '../draggable/draggable.component';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { Closable } from '../../internals/escController/closable';
import { deregisterOpenComponent, registerOpenComponent } from '../../internals/escController/escController';

export type DssOverlayClosedEvent = CustomEvent<void>;
export type DssOverlayOpenedEvent = CustomEvent<void>;

export interface OverlayEventsPayloadMap {
  'dss-overlay-closed': void;
  'dss-overlay-opened': void;
}

/**
 * @property header - Text to render in header row of overlay
 * @property show - Set overlay to be shown or not
 * @slot content - Pass the HTML structure that should be displayed as the content in the overlay
 * @slot footer - Pass the HTML structure that should be displayed as the footer in the overlay
 * @fires {DssOverlayOpenedEvent} dss-overlay-opened - Fires when the overlay has been opened
 * @fires {DssOverlayClosedEvent} dss-overlay-closed - Fires when the overlay has been closed
 */
@customElement('dss-overlay')
export default class Overlay extends BaseElement<OverlayEventsPayloadMap> implements Closable {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public header?: string;

  @property({ type: Boolean })
  public show = false;

  @state()
  private noFooter = true;

  @query('slot[name="footer"]')
  private footerSlot!: HTMLSlotElement;

  private position = { x: 0, y: 0 };

  private containerRef: Ref<HTMLDivElement> = createRef();

  private prefersReducedMotion = false;

  protected render() {
    return html`
      <dss-draggable
        axis="${this.header ? 'x' : 'none'}"
        snap="x"
        .position="${this.position}"
      >
        <div
          ${ref(this.containerRef)}
          class=${classMap({
            container: true,
            show: this.show,
          })}
          role="dialog"
          tabindex="-1"
        >

          ${when(this.header, () => html`
            <div class="header" data-dss-draggable-handle>
              <h2>${this.header}</h2>
              <dss-button type="icon-only" @click=${this.close}>
                <dss-icon icon="close-lg" size="large"></dss-icon>
              </dss-button>
            </div>
          `)}
          <div class="content">
            <slot name="content"></slot>
          </div>
          <div
            class=${classMap({
              footer: true,
              empty: this.noFooter,
            })}
          >
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
      </dss-draggable>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.close();
  }

  protected async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('show') && this.show) {
      await this.open();
    } else if (changedProperties.get('show') !== undefined && !this.show) {
      this.handleClosing();
    }
  }

  private onTransitionEnded = (event: TransitionEvent) => {
    if (event.propertyName === 'visibility' && this.show) {
      this.dispatchCustomEvent('dss-overlay-opened');
      this.containerRef.value?.removeEventListener('transitionend', this.onTransitionEnded);
    }
  };

  async open(): Promise<void> {
    registerOpenComponent(this);
    await this.updateComplete;
    if (this.prefersReducedMotion) {
      this.dispatchCustomEvent('dss-overlay-opened');
    } else {
      this.containerRef.value?.addEventListener('transitionend', this.onTransitionEnded, { passive: true });
    }
  }

  private handleClosing(): void {
    deregisterOpenComponent(this);
    this.position = { x: 0, y: 0 };
    this.dispatchCustomEvent('dss-overlay-closed');
  }

  close(): void {
    this.show = false;
  }

  private handleSlotChange(): void {
    this.noFooter = this.footerSlot?.assignedElements()?.length <= 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-overlay': Overlay;
  }

  interface WindowEventMap {
    'dss-overlay-closed': DssOverlayClosedEvent;
    'dss-overlay-opened': DssOverlayOpenedEvent;
  }
}
