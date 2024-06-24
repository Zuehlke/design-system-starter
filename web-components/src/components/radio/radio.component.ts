import { html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import styles from './radio.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { classMap } from 'lit/directives/class-map.js';
import { InputErrorState, InputSize } from '../input/input.component';
import '../../internals/hint/hint';
import { when } from 'lit/directives/when.js';

export const radioStates = [
  'unchecked',
  'checked',
] as const;
export type RadioState = typeof radioStates[number];

export type DssRadioSelectionChangeEvent = CustomEvent<string>;

export interface RadioEventsPayloadMap {
  'dss-radio-selection-change': string;
}

/**
 * @fires {DssRadioSelectionChangeEvent} dss-radio-selection-change - Fires when the user selects a radio
 * @slot slot - Pass the actual input element that should be wrapped. This will be invisible
 * @property label - Pass label that should be displayed next to the radio
 * @property size - Specify the size of the radio
 * @property hideMessage - Hide the empty line that is left for hints/errors/warnings
 * @property errorState - Specify an error state for the radio component
 * @property {string} message - Pass message to be displayed
 */
@customElement('dss-radio')
export default class Radio extends BaseElement<RadioEventsPayloadMap> {

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String })
  public size: InputSize = 'comfortable';

  @property({ type: String })
  public label = '';

  @property({ type: String })
  public errorState?: InputErrorState;

  @property({ type: String })
  public message?: string;

  @property({ type: Boolean })
  public hideMessage = false;

  @state()
  private inputState: RadioState = 'unchecked';

  @state()
  private inputFocused = false;

  @state()
  private isDisabled = false;

  @query('slot')
  defaultSlot!: HTMLSlotElement;

  override render() {
    return html`
      <slot @slotchange=${this.onSlotChange} @change=${this.onInputStateChange}></slot>
      <label
        @click=${this.handleLabelClick}
        class=${classMap({
          'disabled': this.isDisabled,
          'error': this.errorState === 'error',
          'warning': this.errorState === 'warning',
          'checked': this.inputState === 'checked',
          'focused': this.inputFocused,
        })}
      >
        <div class=${`basic-radio ${this.size}`}></div>
        ${this.label}
      </label>
      ${when(!this.hideMessage, () => html`
        <dss-hint .state="${this.errorState}" .message="${this.message}"></dss-hint>
      `)}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('dss-radio-selection-change', this.onCustomEvent, { passive: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('dss-radio-selection-change', this.onCustomEvent);
  }

  private onSlotChange() {
    this.syncToInputElementState();

    const currentInputElement = this.getInputElement();
    if (currentInputElement) {
      const mutationObserver = new MutationObserver(this.attributesChanged);
      mutationObserver.observe(currentInputElement, { attributes: true });

      currentInputElement.addEventListener('focus', () => this.setRadioFocus(true), { passive: true });
      currentInputElement.addEventListener('blur', () => this.setRadioFocus(false), { passive: true });
      if (this.label) {
        currentInputElement.setAttribute('aria-label', this.label);
      }
    }
  }

  private attributesChanged = (mutationList: MutationRecord[]) => {
    if (mutationList.some(mutation => mutation.attributeName === 'disabled')) {
      this.syncToInputElementState();
    }
  };

  private onCustomEvent = (event: DssRadioSelectionChangeEvent) => {
    if (this.getInputElement()?.name === event.detail) {
      this.syncToInputElementState();
    }
  };

  private getInputElement(): HTMLInputElement | undefined {
    const nodes = this.defaultSlot.assignedNodes();
    return nodes.find(node => node.nodeName === 'INPUT') as HTMLInputElement;
  }

  private syncToInputElementState = () => {
    const currentInputElement = this.getInputElement();

    if (currentInputElement?.disabled) {
      this.isDisabled = true;
    }

    if (currentInputElement?.checked) {
      this.inputState = 'checked';
    } else {
      this.inputState = 'unchecked';
    }
  };

  private handleLabelClick = () => {
    const currentInputElement = this.getInputElement();
    if (currentInputElement) {
      currentInputElement.click();
    }
  };

  private setRadioFocus(isFocused: boolean) {
    this.inputFocused = isFocused;

    setTimeout(() => {
      this.syncToInputElementState();
    }, 0);
  }

  private onInputStateChange = () => {
    this.syncToInputElementState();
    this.dispatchCustomEvent('dss-radio-selection-change', this.getInputElement()?.name);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-radio': Radio;
  }

  interface WindowEventMap {
    'dss-radio-selection-change': DssRadioSelectionChangeEvent;
  }
}
