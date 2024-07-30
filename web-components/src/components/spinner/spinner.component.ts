import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { unsafeCSS } from 'lit';
import styles from './spinner.css?inline';

export const spinnerTypes = [
  'primary',
  'secondary',
  'ghost',
  'success',
] as const;
export type SpinnerType = typeof spinnerTypes[number];

export const spinnerSizes = [
  'small',
  'medium',
  'stretch',
] as const;
export type SpinnerSize = typeof spinnerSizes[number];

export const spinnerThickness = [
  'thin',
  'thick',
] as const;
export type SpinnerThickness = typeof spinnerThickness[number];

/**
 * @property type - Set the type of the spinner
 * @property size - Set the size of the spinner
 * @property thickness - Set the thickness of the spinner
 * @cssprop --spinner-background-color - Controls the background color of the donut
 */
@customElement('dss-spinner')
export default class Spinner extends BaseElement {

  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  type: SpinnerType = 'primary';

  @property({ reflect: true })
  size: SpinnerSize = 'medium';

  @property({ reflect: true })
  thickness: SpinnerThickness = 'thin';

  override render() {
    if (this.thickness === 'thick') {
      return html`
        <svg viewBox="0 0 22 22" fill="none" role="status" xmlns="http://www.w3.org/2000/svg" >
          <circle cx="11" cy="11" r="9" stroke-width="4"/>
          <path d="M20 11C20 6.02944 15.9706 2 11 2" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;
    }
    return html`
      <svg viewBox="0 0 18 18" fill="none" role="status" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="8" stroke-width="2"/>
        <path d="M17 9C17 4.58172 13.4183 1 9 1" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-spinner': Spinner;
  }
}
