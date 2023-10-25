import { html, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, queryAssignedElements, state } from 'lit/decorators.js';
import styles from './input.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../../internals/hint/hint';
import '../label/label.component';
import '../spinner/spinner.component';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { when } from 'lit-html/directives/when.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { LabelPlacement } from '../label/label.component';

const textEncoder = new TextEncoder();

export const DEFAULT_DEBOUNCE = 500;

export const inputSizes = [
  'comfortable',
  'compact',
] as const;
export type InputSize = typeof inputSizes[number];

export const inputErrorStates = [
  'error',
  'warning',
] as const;
export type InputErrorState = typeof inputErrorStates[number];

export type DssInputDebouncedEvent = CustomEvent<string>;

export interface InputEventsPayloadMap {
  'dss-input-debounced': string;
}

export interface InputTranslations {
  characters?: string;
}

const DEFAULT_INPUT_TRANSLATIONS: InputTranslations = {
  characters: 'characters',
};

/**
 * @slot slot - Pass the actual input element that should be wrapped
 * @slot input-button - Pass a button to be displayed on the right side of the button
 * @property size - Specify size of input text
 * @property label - Pass label that will be displayed above the input
 * @property labelPlacement - Specify where the label should be placed relative to the input
 * @property debounce - Specify number of ms for the debounce timer to run
 * @property errorState - Specify error state
 * @property {string} message - Pass message to be displayed with error state
 * @property hideMessage - Hide the empty line that is left for hints/errors/warnings
 * @property countToMax - Specifiy maximum number of characters that will be counted and displayed to the user
 * @property translations - Overwrite input specific translations
 * @property block - Let input grow full width
 * @property loading - Show loading spinner on the right. This replaces the `input-button` slot
 * @fires {DssInputDebouncedEvent} dss-input-debounced - Fires when a change happened and the debounce timer ran out
 * @csspart required - Exported part of dss-label
 */
@customElement('dss-input')
export default class Input extends BaseElement<InputEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public size: InputSize = 'comfortable';

  @property()
  public label = '';

  @property({ reflect: true })
  public labelPlacement: LabelPlacement = 'top';

  @property({ attribute: false })
  public debounce = DEFAULT_DEBOUNCE;

  @property({ reflect: true })
  public errorState?: InputErrorState;

  @property()
  public message?: string;

  @property({ type: Boolean })
  public hideMessage = false;

  @property({ type: Number })
  public countToMax?: number;

  @property({ type: Boolean, reflect: true })
  public block = false;

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ attribute: false })
  set translations(overwrittenTranslations: InputTranslations) {
    this._translations = {
      ...DEFAULT_INPUT_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations() {
    return this._translations;
  }

  private _translations: InputTranslations = DEFAULT_INPUT_TRANSLATIONS;

  @state()
  private count = 0;

  @queryAssignedElements({ selector: ':is(input,textarea)' })
  private slottedInput!: Array<HTMLInputElement | HTMLTextAreaElement>;


  private timeout?: NodeJS.Timeout;

  private updateCountEventToOnInputEvent(customEvent: Event): void {
    this.onInput(customEvent as InputEvent);
  }

  override render() {
    return html`
      <dss-label
        label="${ifDefined(this.label)}"
        exportparts="required"
        @click=${this.handleLabelClick}
      ></dss-label>
      <div class="input-wrapper" @click=${this.handleClick}>
        <slot
          @input=${this.onInput}
          @slotchange=${this.handleSlotChange}
          @dss-input-update-count=${this.updateCountEventToOnInputEvent}
        ></slot>
        ${when(this.loading,
          () => html`
            <dss-spinner size="small" type="secondary"></dss-spinner>
          `,
          () => html`
            <slot name="input-button"></slot>
          `,
        )}
      </div>
      ${when(this.countToMax !== undefined, () => html`
        <span class="count" data-testid="count">
          <span class="${classMap({ 'count--invalid': this.count > this.countToMax! })}">${this.count}</span>/${this.countToMax}
          ${this.translations.characters}
        </span>
      `)}
      ${when(!this.hideMessage && this.size !== 'compact', () => html`
        <dss-hint .state="${this.errorState}" .message="${this.message}" data-testid="message-container"></dss-hint>
      `)}
    `;
  }

  public formResetCallback(): void {
    this.updateCount();
  }

  @eventOptions({ passive: true })
  private onInput(event: InputEvent): void {
    clearTimeout(this.timeout);
    const inputElement = event.composedPath()[0] as HTMLInputElement;
    this.timeout = setTimeout(
      () => this.dispatchCustomEvent('dss-input-debounced', inputElement.value),
      this.debounce,
    );
    this.updateCount();
  }

  private updateCount(): void {
    if (this.countToMax !== undefined) {
      const firstInput = this.slottedInput[0];
      if (firstInput) {
        // Get length in utf-8 bytes
        this.count = textEncoder.encode(firstInput.value).length;
      }
    }
  }

// implemented our own click handler because label is in shadow DOM and input element in light DOM, so the 'for' attribute does not work
  // see also: https://github.com/whatwg/html/issues/3219
  private handleLabelClick(): void {
    this.slottedInput[0]?.focus();
  }

  private handleSlotChange(): void {
    if (this.label) {
      this.slottedInput[0]?.setAttribute('aria-label', this.label);
    }
  }

  private handleClick(event: MouseEvent): void {
    if (this.slottedInput.some(input => input.disabled)) {
      event.stopImmediatePropagation();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-input': Input;
  }

  interface WindowEventMap {
    'dss-input-debounced': DssInputDebouncedEvent;
  }
}
