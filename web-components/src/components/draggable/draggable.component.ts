import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import BaseElement from '../../internals/baseElement/baseElement';
import { html } from 'lit-html';
import type { DragAxis, DragEventData, Draggable as NeoDraggable, DragOptions } from '@neodrag/vanilla';
import { PropertyValues, unsafeCSS } from 'lit';
import styles from './draggable.css?inline';

export const draggableBounds = [
  'body',
  'parent',
] as const;
export type DraggableBounds = typeof draggableBounds[number] | string;

const WATCHED_PROPS: Array<keyof Draggable> = ['axis', 'bounds', 'position'];

/**
 * @property axis - the axis in which the element is allowed to be dragged
 * @property bounds - the boundary of the drag area, pass a CSS selector string to use an element other than the body or parent element
 * @property snap - axis of the boundary to which the element should snap to when dropped
 * @property position - set horizontal and vertical offset in pixels relative to the original position
 * @slot slot - element which should be made draggable
 */
@customElement('dss-draggable')
export default class Draggable extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public axis: DragAxis = 'both';

  @property()
  public bounds: DraggableBounds = 'body';

  @property()
  public snap: DragAxis = 'none';

  @property({ type: Object, reflect: false, attribute: false })
  public position: DragOptions['position'] = { x: 0, y: 0 };

  @queryAssignedElements()
  private assignedElements!: HTMLElement[];

  private neoDraggable?: NeoDraggable;

  override render() {
    return html`
      <slot @slotchange="${this.onSlotChange}"></slot>
    `;
  }

  override willUpdate(_changedProperties: PropertyValues<Draggable>) {
    const keys = [..._changedProperties.keys()] as Array<keyof Draggable>;
    if (keys.some(key => WATCHED_PROPS.includes(key))) {
      this.neoDraggable?.updateOptions({ axis: this.axis, bounds: this.bounds, position: this.position });
    }
  }

  private async onSlotChange() {
    const [slottedElement] = this.assignedElements;
    if (slottedElement) {
      this.neoDraggable?.destroy();
      const { Draggable: NeoDraggable } = await import('@neodrag/vanilla');
      this.neoDraggable = new NeoDraggable(slottedElement, this.getOptions());
      const dragHandles = [...slottedElement.querySelectorAll('[data-dss-draggable-handle]')]
        .filter((element): element is HTMLElement => element instanceof HTMLElement);
      if (dragHandles.length > 0) {
        this.neoDraggable.updateOptions({ handle: dragHandles });
      }
    }
  }

  private getOptions(): DragOptions {
    return {
      axis: this.axis,
      bounds: this.bounds,
      legacyTranslate: false,
      position: this.position,
      onDragEnd: data => this.onDragEnd(data),
    };
  }

  private onDragEnd({ currentNode, offsetX: x, offsetY: y }: DragEventData): void {
    if (this.snap === 'none') {
      return;
    }
    const boundingRect = this.getBoundingRect();
    if (this.snap === 'x' || this.snap === 'both') {
      const horizontalSpace = boundingRect.width - currentNode.getBoundingClientRect().width;
      x = Math.abs(x) > (horizontalSpace / 2) ? horizontalSpace * Math.sign(x) : 0;
    }
    if (this.snap === 'y' || this.snap === 'both') {
      const verticalSpace = boundingRect.height - currentNode.getBoundingClientRect().height;
      y = Math.abs(y) > (verticalSpace / 2) ? verticalSpace * Math.sign(y) : 0;
    }
    this.neoDraggable?.updateOptions({ position: { x, y } });
  }

  private getBoundingRect(): DOMRect {
    if (this.bounds === 'body') {
      return document.body.getBoundingClientRect();
    } else if (this.bounds === 'parent') {
      return this.getBoundingClientRect();
    }
    const element = document.querySelector(this.bounds);
    if (element) {
      return element.getBoundingClientRect();
    }
    return document.documentElement.getBoundingClientRect();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-draggable': Draggable;
  }
}
