import BaseElement from '../../internals/baseElement/baseElement';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeCSS } from 'lit';
import styles from './pagination.css?inline';
import { classMap } from 'lit/directives/class-map.js';
import '../icon/icon.component';
import '../button/button.component';

export const PAGINATION_COUNT = 5;
const PAGINATION_OFFSET = Math.floor(PAGINATION_COUNT / 2);

export type DssPaginationPageIndexSelectedEvent = CustomEvent<number>;

export interface PaginationEventsPayloadMap {
  'dss-pagination-page-index-selected': number;
}

/**
 * @fires {DssPaginationPageIndexSelectedEvent} dss-pagination-page-index-selected - Fires when a new page index has been selected
 * @property pageCount - Number of pages to render
 * @property activePageIndex - Index of selected page
 * @property firstPage - Override selection of first page
 * @property previousPage - Override selection of previous page
 * @property nextPage - Override selection of next page
 * @property lastPage - Override selection of last page
 * @property canGetPreviousPage - Override if user can press previous/first page buttons
 * @property canGetNextPage - Override if user can press next/last page buttons
 */
@customElement('dss-pagination')
export default class Pagination extends BaseElement<PaginationEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ attribute: false })
  public pageCount!: number;

  @property({ attribute: false })
  public activePageIndex = 0;

  @property({ attribute: false })
  public firstPage: () => void = () => this.setActiveIndex(0);

  @property({ attribute: false })
  public previousPage: () => void = () => this.canGetPreviousPage() && this.setActiveIndex(this.activePageIndex - 1);

  @property({ attribute: false })
  public nextPage: () => void = () => this.canGetNextPage() && this.setActiveIndex(this.activePageIndex + 1);

  @property({ attribute: false })
  public lastPage: () => void = () => this.setActiveIndex(this.pageCount - 1);

  @property({ attribute: false })
  public canGetPreviousPage: () => boolean = () => this.activePageIndex !== 0;

  @property({ attribute: false })
  public canGetNextPage: () => boolean = () => this.activePageIndex !== this.pageCount - 1;

  override render() {
    if (!this.pageCount) {
      return;
    }

    return html`
      <dss-button
        type="icon-only"
        ?disabled=${!this.canGetPreviousPage()}
        @click=${() => this.firstPage()}
      >
        <dss-icon icon="previous" size="small"></dss-icon>
      </dss-button>
      <dss-button
        type="icon-only"
        ?disabled=${!this.canGetPreviousPage()}
        @click=${() => this.previousPage()}
      >
        <dss-icon icon="play" size="small" style="transform: rotateZ(180deg)"></dss-icon>
      </dss-button>
      ${this.calculatePageIndicesToDisplay().map((pageIndex) => html`
        <button
          class=${classMap({ 'active-page': this.activePageIndex === pageIndex })}
          @click=${() => this.setActiveIndex(pageIndex)}
        >
          ${pageIndex + 1}
        </button>
      `)}
      <dss-button
        type="icon-only"
        ?disabled=${!this.canGetNextPage()}
        @click=${() => this.nextPage()}
      >
        <dss-icon icon="play" size="small"></dss-icon>
      </dss-button>
      <dss-button
        type="icon-only"
        ?disabled=${!this.canGetNextPage()}
        @click=${() => this.lastPage()}
      >
        <dss-icon icon="next" size="small"></dss-icon>
      </dss-button>
    `;
  }

  private calculatePageIndicesToDisplay(): number[] {
    if (this.pageCount <= PAGINATION_COUNT) {
      return Array.from(Array(this.pageCount).keys());
    }
    const leftOverflow = this.activePageIndex - PAGINATION_OFFSET;
    const rightOverflow = (this.pageCount - 1) - (this.activePageIndex + PAGINATION_OFFSET);
    let modifier = -PAGINATION_OFFSET;
    if (leftOverflow < 0) {
      modifier = -PAGINATION_OFFSET + Math.abs(leftOverflow);
    } else if (rightOverflow < 0) {
      modifier = -PAGINATION_OFFSET - Math.abs(rightOverflow);
    }
    return Array.from(
      Array(PAGINATION_COUNT).keys(),
      (initialIndex) => this.activePageIndex + initialIndex + modifier,
    );
  }

  private setActiveIndex(index: number) {
    this.activePageIndex = index;
    this.dispatchCustomEvent('dss-pagination-page-index-selected', this.activePageIndex);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-pagination': Pagination;
  }

  interface WindowEventMap {
    'dss-pagination-page-index-selected': DssPaginationPageIndexSelectedEvent;
  }
}
