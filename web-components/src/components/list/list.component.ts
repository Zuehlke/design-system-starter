import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './list.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';

export const replaceMode = [
  'swap',
  'append',
] as const;
export type ReplaceMode = typeof replaceMode[number] | string;

/**
 * @slot slot - List of elements which can be reordered by dragging and dropping. Every element that should be draggable needs the draggable attribute set to true.
 */
@customElement('dss-list')
export default class List extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  private dragSrcEl?: EventTarget | null;

  override render() {
    return html`
      <slot
        @dragstart="${this.handleDragStart}"
        @dragenter="${this.handleDragEnter}"
        @dragover="${(event: DragEvent) => event.preventDefault()}"
      ></slot>
    `;
  }

  handleDragStart(event: DragEvent) {
    this.dragSrcEl = this.getTarget(event)

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  handleDragEnter(event: DragEvent) {
    const targetItem = this.getTarget(event);
    const sourceItem = this.dragSrcEl as HTMLElement;

    if (targetItem && targetItem !== this.dragSrcEl) {
      const srcIndex = this.getElementIndex(sourceItem, this);
      const targetIndex = this.getElementIndex(targetItem, this);

      if (targetIndex > srcIndex) {
        targetItem.after(sourceItem);
      } else {
        targetItem.before(sourceItem);
      }
    }
  }

  private getTarget(e: DragEvent): HTMLElement | undefined {
    return e.composedPath().find((item): item is HTMLElement =>
      item instanceof HTMLElement && item.hasAttribute('draggable'));
  }

  getElementIndex(element: HTMLElement, parent: HTMLElement) {
    return Array.from(parent.children).indexOf(element);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-list': List;
  }
}
