import { html, unsafeCSS } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import styles from './menu.css?inline';
import MenuItem from '../menuItem/menuItem.component';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';


export interface MenuEventsPayloadMap {
  'dss-menu-selection': {
    value?: any,
    text: string
  };
}

export type DssMenuSelectionEvent = CustomEvent<MenuEventsPayloadMap['dss-menu-selection']>;

/**
 * @fires {DssMenuSelectionEvent} dss-menu-selection - Fires when user selects a menu item
 * @slot slot - List of MenuItem each containing an option the user can select from
 */
@customElement('dss-menu')
export default class Menu extends BaseElement<MenuEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @queryAssignedElements()
  private assignedElements!: HTMLElement[];

  override render() {
    return html`
      <slot
        @slotchange="${this.handleSlotChange}"
        @click="${this.handleClick}"
      ></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menu');
    this.addEventListener('keydown', this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleSlotChange() {
    const items = this.getAllItems();
    if (items.length > 0) {
      this.setActiveItem(items[0]);
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (ActionKeystrokes.includes(event.key)) {
      event.preventDefault();
      this.handleSelection(event);
    } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const items = this.getAllItems();
      let activeItem = this.getActiveItem(items);

      if (event.key === 'ArrowUp') {
        activeItem--;
      } else if (event.key === 'ArrowDown') {
        activeItem++;
      } else if (event.key === 'Home') {
        activeItem = 0;
      } else if (event.key === 'End') {
        activeItem = items.length - 1;
      }

      if (activeItem < 0) {
        activeItem = items.length - 1;
      } else if (activeItem > items.length - 1) {
        activeItem = 0;
      }

      this.setActiveItem(items[activeItem]);
      items[activeItem].focus();
    }
  };

  getActiveItem(items: MenuItem[]) {
    const activeItem = items.findIndex(element => element.getAttribute('tabindex') === '0');
    return activeItem !== -1 ? activeItem : 0;
  }

  getAllItems(): MenuItem[] {
    return this.assignedElements
      .filter((element): element is MenuItem => element instanceof MenuItem);
  }

  setActiveItem(activeItem: MenuItem) {
    this.getAllItems().forEach(item => item.setAttribute('tabindex', item === activeItem ? '0' : '-1'));
  }

  private handleClick = (event: PointerEvent) => {
    if (event.detail > 0 && event.target instanceof Element) {
      this.handleSelection(event);
    }
  };

  private handleSelection = (event: Event) => {
    const target = event.target as Element;
    const menuItem = target.closest('dss-menu-item') ?? event.composedPath()[0];
    if (menuItem instanceof MenuItem) {
      this.setActiveItem(menuItem);
      this.dispatchCustomEvent('dss-menu-selection', {
        value: menuItem.value,
        text: menuItem.getTextContent(),
      });
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-menu': Menu;
  }

  interface WindowEventMap {
    'dss-menu-selection': DssMenuSelectionEvent;
  }
}
