import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './tag.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';

export const tagStates = [
  'error',
  'warning',
  'success',
  'info',
] as const;
export type TagState = typeof tagStates[number];

/**
 * @slot slot - HTML structure visible inside the tag
 * @property state - Specify the state of the tag
 */
@customElement('dss-tag')
export default class Tag extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ reflect: true })
  public state?: TagState;

  protected render() {
    return html`
      <div class="tag-container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-tag': Tag;
  }
}
