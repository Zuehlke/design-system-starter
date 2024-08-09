import { html, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, query } from 'lit/decorators.js';
import styles from './buttongroup.css?inline';
import '../icon/icon.component';
import '../button/button.component';
import '../label/label.component';
import '../../internals/hint/hint';
import BaseElement from '../../internals/baseElement/baseElement';
import ToggleButton from '../toggleButton/toggleButton.component';
import { InputErrorState } from '../input/input.component';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LabelPlacement } from '../label/label.component';
import { when } from 'lit/directives/when.js';

export interface ButtonGroupTranslations {
  valueMissing?: string;
}

/**
 * @property name - Specify name property for form handling
 * @property value - Value of the pressed button
 * @property label - Pass label to be shown
 * @property labelPlacement - Specify where the label should be placed relative to the button group
 * @property required - Specify if this element is required
 * @property errorState - Specify the error state of the element
 * @property {string} message - Pass message to be shown with the error state
 * @property translations - Pass translations to use
 * @property hideMessage - Hide the empty line that is left for hints/errors/warnings.
 * @fires {Event} change - Fires when form state changed
 * @slot {ToggleButton[]} slot - Pass one or more dss-toggle-button
 */
@customElement('dss-button-group')
export default class ButtonGroup extends BaseElement {
  // noinspection JSUnusedGlobalSymbols
  static formAssociated = true;

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public name?: string;

  @property()
  public value?: string;

  @property()
  public label = '';

  @property({ reflect: true })
  public labelPlacement: LabelPlacement = 'top';

  @property({ type: Boolean })
  public required = false;

  @property()
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  @property({ type: Boolean, reflect: true })
  public hideMessage = false;

  @property({ type: Object })
  public translations: ButtonGroupTranslations = {
    valueMissing: 'You have to select an option',
  };

  @query('slot')
  private defaultSlot!: HTMLSlotElement;

  private buttonWrapper: Ref<HTMLDivElement> = createRef();
  private internals: ElementInternals;
  private isFocussed = false;
  private debounceBlur?: NodeJS.Timeout;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override render() {
    return html`
      <dss-label label="${ifDefined(this.label)}" ?required="${this.required}"></dss-label>
      <div class="button-wrapper" tabindex="-1" ${ref(this.buttonWrapper)} aria-label="${ifDefined(this.label)}">
        <slot
          @slotchange=${this.handleSlotChange}
          @click="${this.handleClick}"
          @focusin="${this.handleSlotFocusIn}"
          @focusout="${this.handleSlotFocusOut}"
        ></slot>
      </div>

      ${when(!this.hideMessage, () => html`
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      `)}
    `;
  }

  handleSlotChange() {
    const buttons = this.getButtons();

    if (buttons.length > 1) {
      buttons.forEach((button) => {
        button.overlapBorder = 'left';
        button.removeRadius = 'all';

        if (this.value && button.value === this.value) {
          this.pressButton(button);
        }
      });

      buttons[0].removeRadius = 'right';
      buttons[0].overlapBorder = 'none';
      buttons[buttons.length - 1].removeRadius = 'left';
    } else if (buttons.length === 1) {
      buttons[0].removeRadius = 'none';
      buttons[0].overlapBorder = 'none';
    }
    this.updateValidity();
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    if (this.defaultSlot && name === 'value') {
      const buttons = this.getButtons();
      const buttonsHaveValues = buttons.findIndex(button => button.value) >= 0;
      if (buttonsHaveValues) {
        buttons.forEach(button => button.pressed = this.value === button.value);
        this.internals.setFormValue(this.value ?? null);
        this.updateValidity();
      }
    }
    return super.requestUpdate(name, oldValue);
  }

  private handleClick({ target }: Event) {
    this.pressButton(this.getButtons().find(button => button.contains(target as Node)));
  }

  private pressButton(pressedButton?: ToggleButton): void {
    if (!pressedButton) {
      return;
    }

    this.value = pressedButton.value;
    this.dispatchChangeEvent();
  }

  private updateValidity(): void {
    this.internals.setValidity(
      { valueMissing: this.required && this.value === undefined },
      this.translations.valueMissing,
      this.buttonWrapper.value,
    );
  }

  private getButtons(): ToggleButton[] {
    return this.defaultSlot.assignedElements()
      .filter((element): element is ToggleButton => element instanceof ToggleButton);
  }

  @eventOptions({ passive: true })
  private handleSlotFocusIn(): void {
    clearTimeout(this.debounceBlur);
    if (!this.isFocussed) {
      this.dispatchEvent(new Event('focus', { composed: false, bubbles: false }));
      this.isFocussed = true;
    }
  }

  @eventOptions({ passive: true })
  private handleSlotFocusOut(): void {
    if (this.isFocussed) {
      this.debounceBlur = setTimeout(() => {
        this.dispatchEvent(new Event('blur', { composed: false, bubbles: false }));
        this.isFocussed = false;
      }, 0);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-button-group': ButtonGroup;
  }
}
