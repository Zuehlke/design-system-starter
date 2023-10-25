import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import styles from './tab.css?inline';
import { onRelevantKeyDownEvent } from '../tabGroup/tabGroup.component';
import '../button/button.component';
import '../icon/icon.component';

export interface TabEventsPayloadMap {
  'dss-tab-close': string;
}

export type DssTabCloseEvent = CustomEvent<string>;

export interface TabDataInterface {
  title: string;
}

/**
 * @fires {DssTabCloseEvent} dss-tab-close - Fires when the user presses the close button
 * @property title - Specify the account that the tab references
 * @property isActive - Specify whether the tab is currently active
 */

@customElement('dss-tab')
export default class Tab extends BaseElement<TabEventsPayloadMap> {

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String })
  public title = '';

  @property({ type: Boolean })
  public isActive = false;

  @property({ type: Boolean })
  public isVisible = true;

  override render() {
    return html`
      <div
        role="tab"
        class="basic-tab 
          ${this.isActive ? 'active' : ''}
          ${this.isVisible ? 'visible' : 'folded'}
        "
        tabindex="0"
      >
        ${this.title}
        <dss-button
          type="icon-only"
          @click=${(event: MouseEvent) => this.onCloseButtonClick(event)}
          @keydown=${(event: KeyboardEvent) => onRelevantKeyDownEvent(event, () => this.closeTab())}
        >
          <dss-icon icon="close-lg"></dss-icon>
        </dss-button>
      </div>
    `;
  }

  private onCloseButtonClick(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.closeTab();
  }

  private closeTab() {
    this.dispatchCustomEvent('dss-tab-close', this.title);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-tab': Tab;
  }

  interface WindowEventMap {
    'dss-tab-close': DssTabCloseEvent;
  }
}
