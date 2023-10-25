import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import styles from './menuItem.css?inline';
import Checkbox from '../checkbox/checkbox.component';

/**
 * Menu item provides a single option for the user to pick from a menu.
 *
 * @property value - Value represented by this option. Can be a primitive or an object.
 * @property selected - Set selected state. This gets reflected to `aria-selected` attribute.
 * @slot slot - Pass the HTML structure that should be used to display the menu item
 */
@customElement('dss-menu-item')
export default class MenuItem extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({
    attribute: 'aria-selected', reflect: true, converter: {
      fromAttribute(): void {
        // Do not reflect back from Attribute
      },
      toAttribute(value: boolean): string {
        return value ? 'true' : 'false';
      },
    },
  })
  selected = false;

  @property()
  value?: any;

  @queryAssignedElements({ selector: 'dss-checkbox' })
  private slottedCheckbox!: Checkbox[];

  override render() {
    return html`
      <slot
        @slotchange="${this.onSlotChange}"
        @click="${this.handleClick}"
      ></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
  }

  override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('selected') && this.containsCheckbox()) {
      this.getSlottedCheckbox().checked = this.selected;
    }
  }

  private onSlotChange() {
    if (this.containsCheckbox()) {
      const checkbox = this.getSlottedCheckbox();
      checkbox.checked = this.selected;
      checkbox.setAttribute('tabindex', '-1');
    }
  }

  public getTextContent(): string {
    if (this.containsCheckbox()) {
      return this.getSlottedCheckbox().label;
    }
    return this.textContent?.trim() ?? '';
  }

  private handleClick(event: MouseEvent) {
    if (event.detail === 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private containsCheckbox(): boolean {
    return this.slottedCheckbox?.length > 0;
  }

  private getSlottedCheckbox(): Checkbox {
    return this.slottedCheckbox[0];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-menu-item': MenuItem;
  }
}
