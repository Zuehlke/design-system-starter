import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import styles from './dropdown.css?inline';
import '../icon/icon.component';
import '../button/button.component';
import '../input/input.component';
import '../label/label.component';
import '../outsideClick/outsideClick.component';
import '../../internals/hint/hint';
import '../../internals/floatingElement/floatingElement';
import Menu, { DssMenuSelectionEvent } from '../menu/menu.component';
import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputErrorState, InputSize } from '../input/input.component';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { Placement } from '@floating-ui/dom';
import MenuItem from '../menuItem/menuItem.component';
import { when } from 'lit/directives/when.js';
import { LabelPlacement } from '../label/label.component';
import { Closable } from '../../internals/escController/closable';
import { deregisterOpenComponent, registerOpenComponent } from '../../internals/escController/escController';
import { Icons } from '../icon/icons';

export interface DropdownTranslations {
  valueMissing?: string;
}

/**
 * @property name - Specify name property for form handling
 * @property placement - Specify where the dropdown will be shown if there is enough space, relative to the trigger. Default: 'bottom-start'. Unsetting placement defaults to auto placement.
 * @property editable - Allows typing into the dropdown input element
 * @property block - Let dropdown input element grow full width
 * @property value - Selected value
 * @property icon - Specify icon to use for the dropdown. Defaults to the `down`/`up` caret icons
 * @property label - Pass label to default input
 * @property labelPlacement - Specify where the label should be placed relative to the dropdown
 * @property required - Specify if form element is required
 * @property disabled - Specify if form element is disabled
 * @property errorState - Specify the errorState of the underlying input
 * @property {string} message - Pass message to be shown with the underlying input
 * @property toFormValue - Transforms the selected value when the dropdown is used in a form. Default: JSON.stringify
 * @property updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @property size - Specify the size of the underlying input
 * @property hideMessage - Hide the empty line that is left for hints/errors/warnings. Happens automatically when size is set to 'compact'.
 * @property multiSelect - Specify if the dropdown should allow multiple selections
 * @property values - Tracks the selected values when multiSelect is true
 * @property hideAllSelected - Specify if the selected values in the textbox should be hidden when all are selected
 * @fires {Event} change - Fires when form state changed
 * @fires {FocusEvent} blur - Fires when component is blurred
 * @slot slot - DssMenu containing a list of DssMenuItem each containing an option the user can select from
 */
@customElement('dss-dropdown')
export default class Dropdown extends BaseElement implements Closable {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public name?: string;

  @property()
  public placement?: Placement = 'bottom-start';

  @property({ reflect: true, type: Boolean })
  public editable = false;

  @property()
  public value?: any;

  @property()
  public icon?: Icons;

  @property({ reflect: true, type: Boolean })
  public disabled = false;

  @property({ reflect: true, type: Boolean })
  public open = false;

  @property()
  public label?: string;

  @property({ reflect: true })
  public labelPlacement: LabelPlacement = 'top';

  @property({ type: Boolean })
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public toFormValue = (value: any) => typeof value === 'string' ? value : JSON.stringify(value);

  @property()
  public message?: string;

  @property()
  public size: InputSize = 'comfortable';

  @property({ type: Boolean })
  public hideMessage = false;

  @property({ type: Object })
  public translations: DropdownTranslations = {
    valueMissing: 'You have to select an option',
  };

  @property({ type: Boolean })
  public updateOnAnimate?: boolean;

  @property({ type: Boolean })
  public multiSelect = false;

  @property({ type: Array })
  public values: string[] = [];

  @property({ type: Boolean })
  public hideAllSelected = false;

  @property({ reflect: true, type: Boolean })
  public block = false;

  @query('input')
  private inputElement?: HTMLInputElement;

  @queryAssignedElements({ selector: 'dss-menu' })
  private menuElement!: Menu[];

  private triggerRef: Ref<HTMLSpanElement> = createRef();
  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-label label="${ifDefined(this.label)}" ?required="${this.required}"></dss-label>
      <dss-outside-click .onOutsideClick="${this.close}">
        <dss-floating
          placement="${ifDefined(this.placement)}"
          ?active="${this.open}"
          ?updateOnAnimate="${this.updateOnAnimate}"
          @focusout="${this.handleFocusOut}"
        >
          <dss-input
            slot="anchor"
            class="trigger-area"
            role="listbox"
            aria-label="${ifDefined(this.label)}"
            aria-expanded=${this.open}
            @keydown="${this.handleKeyPress}"
            @click="${this.toggle}"
            tabindex="-1"
            ${ref(this.triggerRef)}
            ?block="${this.block}"
            .errorState="${this.errorState}"
            .hideMessage="${true}"
            size="${this.size}"
          >
            <input
              type="text"
              ?readonly="${!this.editable}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
            >
            <dss-button type="icon-only" ?disabled="${this.disabled}" tabindex="-1" slot="input-button">
              <dss-icon icon="${this.actualIcon}" size="medium"></dss-icon>
            </dss-button>
          </dss-input>

          <slot
            @dss-menu-selection="${this.selectedRow}"
            @slotchange=${this.handleSlotChange}
          ></slot>
        </dss-floating>
      </dss-outside-click>
      ${when(this.showMessage(), () => html`
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      `)}
    `;
  }

  connectedCallback(): void {
    this.addEventListener('blur', (event: FocusEvent) => {
      if (event.relatedTarget && this.menuElement[0]?.contains(event.relatedTarget as Node)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, { capture: true });
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    deregisterOpenComponent(this);
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.setFormValueAndValidity();
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('open')) {
      if (this.open) {
        registerOpenComponent(this);
      } else {
        deregisterOpenComponent(this);
      }
    }
    if (changedProperties.has('values') || changedProperties.has('value')) {
      if (changedProperties.has('values') && this.getMenu()?.getAllItems().length) {
        this.syncDomToMultiValueChange();
      }
      if (changedProperties.has('value') && this.getMenu()?.getAllItems().length) {
        this.syncDomToSingleValueChange();
      }
      this.setFormValueAndValidity();
    }
  }

  handleSlotChange() {
    const menuItems = this.getMenuItems();
    if (menuItems && menuItems.length) {
      menuItems.forEach((menuitem) => {
        menuitem.setAttribute('role', 'option');
      });
    }

    if (this.value) {
      this.syncDomToSingleValueChange();
    }
    if (this.values.length > 0) {
      this.syncDomToMultiValueChange();
    }
  }

  override requestUpdate(name?: keyof Dropdown, oldValue?: unknown) {
    if (name === 'value') {
      this.syncDomToSingleValueChange();
    }
    if (name === 'values') {
      this.syncDomToMultiValueChange();
    }
    return super.requestUpdate(name, oldValue);
  }

  private showMessage(): boolean {
    return this.size !== 'compact' && !this.hideMessage;
  }

  private get actualIcon() {
    if (this.icon) {
      return this.icon;
    }

    return this.open ? 'chevron-up' : 'chevron-down';
  }

  private toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  private show() {
    this.open = true;
  }

  private handleFocusOut(event: FocusEvent) {
    if (!this.isKeepingFocus(event)) {
      this.close();
    }
  }

  private isKeepingFocus(event: FocusEvent) {
    return this.contains(event.relatedTarget as Element);
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (ActionKeystrokes.includes(event.key)) {
      event.preventDefault();
      this.toggle();
    } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!this.open) {
        this.show();
      }
      const menu = this.getMenu();
      if (menu) {
        const items = menu.getAllItems();
        if (items.length > 0) {
          const firstItem = items[0];
          const lastItem = items[items.length - 1];

          if (event.key === 'ArrowDown' || event.key === 'Home') {
            menu.setActiveItem(firstItem);
            firstItem.focus();
          } else {
            menu.setActiveItem(lastItem);
            lastItem.focus();
          }
        }
      }
    }
  };

  private getMenu(): Menu | undefined {
    return this.menuElement?.[0] as Menu ?? undefined;
  }

  private getMenuItems(): MenuItem[] | undefined {
    return this.getMenu()?.getAllItems?.();
  }

  private selectedRow(event: DssMenuSelectionEvent) {
    if (this.multiSelect) {
      if (this.values.includes(event.detail.value)) {
        this.values = this.values.filter((value) => value !== event.detail.value);
      } else {
        this.values = [...this.values, event.detail.value];
      }
    } else {
      this.value = event.detail.value;
    }
    this.setFormValueAndValidity();
    this.dispatchChangeEvent();

    if (!this.multiSelect) {
      this.close();
      this.inputElement?.focus();
    }
  }

  private syncDomToSingleValueChange(): void {
    const menuItems = this.getMenuItems();
    if (!this.inputElement || !menuItems || menuItems.length === 0) {
      return;
    }

    if (menuItems && menuItems.length) {
      menuItems.forEach((menuItem) => menuItem.selected = false);
    }
    const selectedMenuItem = menuItems.find(menuItem => menuItem.value === this.value || menuItem.textContent === this.value);
    if (selectedMenuItem?.textContent) {
      this.inputElement.value = selectedMenuItem.textContent;
      selectedMenuItem.selected = true;
    } else {
      this.inputElement.value = '';
    }
  }

  private syncDomToMultiValueChange(): void {
    const menuItems = this.getMenuItems()?.filter((menuItem) => !menuItem.dataset['dssDropdownIgnore']);
    if (!this.inputElement || !menuItems || menuItems.length === 0) {
      return;
    }

    menuItems.forEach((menuItem) => menuItem.selected = this.values.includes(menuItem.value));

    const selectedMenuItems = menuItems.filter((menuItem) => menuItem.selected);
    if (this.hideAllSelected && selectedMenuItems.length === menuItems.length) {
      this.inputElement.value = '';
    } else {
      this.inputElement.value = selectedMenuItems
        .map((menuItem) => menuItem.getTextContent())
        .join(', ');
    }
  }

  private setFormValueAndValidity() {
    this.internals.setFormValue(this.toFormValue(this.value));
    this.internals.setValidity(
      { valueMissing: this.required && this.value === undefined },
      this.translations.valueMissing,
      this.triggerRef.value,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-dropdown': Dropdown;
  }
}
