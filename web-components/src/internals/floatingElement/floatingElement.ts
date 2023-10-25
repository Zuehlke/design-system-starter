import { html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit-html/directives/ref.js';
import styles from './floatingElement.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { when } from 'lit-html/directives/when.js';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  ComputePositionConfig,
  flip,
  offset,
  Placement,
  shift,
  Side,
  size,
} from '@floating-ui/dom';

export const placementOptions: Placement[] = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'right-start',
  'right',
  'right-end',
  'left-start',
  'left',
  'left-end',
];

const TooltipOffset = {
  TopArrow: 16,
  TopNoArrow: 4,
  Bottom: 8,
  Right: 8,
};

const oppositeSide: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/**
 * @slot anchor - HTML structure that will be taken as reference for showing the tooltip
 * @slot slot - HTML structure that will be shown in the tooltip
 * @property placement - Specify where the tooltip will be shown if there is enough space. No placement means auto placement where there is the most amount of space.
 * @property active - Specify if the floating element is visible or not
 * @property arrow - Show arrow element towards the anchor
 * @property updateOnAnimate - Update positioning on animation frames. Use only when necessary due to performance concerns.
 * @csspart container - Styles the tooltip container, including the arrow
 * @csspart content - Styles the tooltip content inside the container
 */
@customElement('dss-floating')
export default class FloatingElement extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property()
  public placement?: Placement;

  @property({ reflect: true, type: Boolean })
  public active = false;

  @property({ type: Boolean, reflect: true })
  public arrow = false;

  @property({ type: Boolean })
  public updateOnAnimate = false;

  @query('slot[name="anchor"]')
  public anchorSlot!: HTMLSlotElement;

  @query('slot:not([name])')
  public contentSlot!: HTMLSlotElement;

  private tooltipElement: Ref<HTMLDivElement> = createRef();
  private arrowElement: Ref<HTMLDivElement> = createRef();
  private referenceElement?: Element;
  private stopAutoUpdate?: () => void;

  private get offset() {
    return this.arrow ? TooltipOffset.TopArrow : TooltipOffset.TopNoArrow;
  }

  protected render() {
    return html`
      <slot name="anchor" @slotchange=${this.handleAnchorSlotChange}></slot>
      <div class="floating" part="container" role="tooltip" ${ref(this.tooltipElement)}>
        <div class="floating-content" part="content">
          <slot @slotchange="${this.handleFloatingSlotChange}"></slot>
        </div>
        ${when(this.arrow, () => html`
          <div class="arrow" part="floating-arrow" ${ref(this.arrowElement)}></div>`)}
      </div>
    `;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.close();
  }

  private handleAnchorSlotChange() {
    this.referenceElement = this.anchorSlot.assignedElements({ flatten: true })[0];
    this.computeFloatingUiPosition();
  }

  private handleFloatingSlotChange() {
    this.computeFloatingUiPosition();
  }

  private async computeFloatingUiPosition(): Promise<void> {
    if (!this.referenceElement || !this.tooltipElement.value) {
      return;
    }
    const { middlewareData, placement, x, y } = await computePosition(
      this.referenceElement,
      this.tooltipElement.value,
      {
        placement: this.placement,
        middleware: this.getMiddlewareConfig(),
      },
    );
    if (!this.tooltipElement.value) {
      return;
    }
    Object.assign(this.tooltipElement.value.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    if (middlewareData.arrow && this.arrowElement.value) {
      const side = placement.split('-')[0] as Side;
      const { x, y } = middlewareData.arrow;
      Object.assign(this.arrowElement.value.style, {
        left: x !== undefined ? `${x}px` : '',
        top: y !== undefined ? `${y}px` : '',
        [oppositeSide[side]]: `${-this.arrowElement.value.offsetWidth / 2}px`,
      });
    }
  }

  private getMiddlewareConfig(): ComputePositionConfig['middleware'] {
    const middleware: ComputePositionConfig['middleware'] = [
      offset(this.offset),
      this.placement
        ? flip()
        : autoPlacement(),
      shift(),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight - TooltipOffset.Bottom}px`,
            maxWidth: `${availableWidth - TooltipOffset.Right}px`,
          });
        },
      }),
    ];
    if (this.arrow) {
      middleware.push(arrow({ element: this.arrowElement.value! }));
    }
    return middleware;
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has('active')) {
      if (this.active) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  private open() {
    if (this.referenceElement && this.tooltipElement.value) {
      this.stopAutoUpdate = autoUpdate(
        this.referenceElement,
        this.tooltipElement.value,
        () => this.computeFloatingUiPosition(),
        {
          animationFrame: this.updateOnAnimate,
        },
      );
    }
    this.tooltipElement.value?.setAttribute('data-show', '');
    this.referenceElement?.setAttribute('aria-expanded', 'true');
  }

  private close() {
    this.stopAutoUpdate?.();
    this.tooltipElement.value?.removeAttribute('data-show');
    this.referenceElement?.setAttribute('aria-expanded', 'false');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-floating': FloatingElement;
  }
}
