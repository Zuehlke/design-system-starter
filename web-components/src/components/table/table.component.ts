import { html, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import {
  ColumnDef,
  CoreHeader,
  createTable,
  FilterFn,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  HeaderGroup,
  Row,
  RowData,
  RowSelectionState,
  Table as TanstackTable,
  TableOptionsResolved,
  TableState,
  Updater,
} from '@tanstack/table-core';
import { repeat } from 'lit-html/directives/repeat.js';
import { when } from 'lit-html/directives/when.js';
import styles from './table.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import '../icon/icon.component';
import '../button/button.component';
import '../checkbox/checkbox.component';
import '../pagination/pagination.component';
import '../flyout/flyout.component';
import './filter/columnFilter';
import { DssPaginationPageIndexSelectedEvent } from '../pagination/pagination.component';
import { dateRange, multiSelect, numeric, select } from './filter/customFilters';
import ColumnFilter, { ColumnFilterTranslations } from './filter/columnFilter';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map.js';
import { ClassInfo, classMap } from 'lit-html/directives/class-map.js';
import { flexRender, flexRenderWithLoadingState } from './flexRender';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { DssMenuSelectionEvent } from '../menu/menu.component';

export type { StyleInfo } from 'lit-html/directives/style-map.js';
export type { ClassInfo } from 'lit-html/directives/class-map.js';
export type { ColumnDef } from '@tanstack/table-core';
export type DssTableSelectionChangeEvent = CustomEvent<any[]>;
export type DssTableRowClickEvent = CustomEvent;
export type EvenOdd = 'even' | 'odd';
export type TableRenderLocation = 'head' | 'filter' | 'body' | 'bodyGroupHead' | 'foot';

export interface WithSubRows<T> {
  subRows?: T[];
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    numeric: FilterFn<unknown>;
    dateRange: FilterFn<unknown>;
    select: FilterFn<unknown>;
    multiSelect: FilterFn<unknown>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    styles?: (data: TData) => StyleInfo;
    classes?: (data: TData) => ClassInfo;
    alignRight?: boolean;
    filteredTotal?: (table: TanstackTable<any>) => any;
  }
}

interface MenuItemValue<TData extends RowData = any> {
  menuItem: ContextMenuItem<TData>;
  row: Row<TData>;
}

export interface BasicContextMenuItem<TData extends RowData = any> {
  text: string;
  isHidden?: (rowData: TData) => boolean;
}

export interface LinkContextMenuItem<TData extends RowData = any> extends BasicContextMenuItem<TData> {
  selectHandler?: never;
  linkFn: (rowData: TData) => string;
}

export interface CallbackContextMenuItem<TData extends RowData = any> extends BasicContextMenuItem<TData> {
  linkFn?: never;
  selectHandler: (rowData: TData) => void;
}

export type ContextMenuItem<TData extends RowData = any> = LinkContextMenuItem<TData> | CallbackContextMenuItem<TData>;

export interface TableEventsPayloadMap {
  'dss-table-selection-change': any[];
  'dss-table-row-double-click': any;
}

export interface TableTranslations {
  selectedElements?: string;
  filteredElements?: string;
  totalElements?: string;
  clearAllFilters?: string;
  columnFilterTranslations?: ColumnFilterTranslations;
}

export const DEFAULT_TABLE_TRANSLATIONS: TableTranslations = {
  filteredElements: 'Filtered Elements',
  selectedElements: 'Selected Elements',
  totalElements: 'Total Elements',
  clearAllFilters: 'Clear all',
};

const WATCHED_PROPS: Array<keyof Table> = ['columns', 'data', 'sortable', 'paginate', 'resizable', 'loading'];
export const PAGE_SIZE = 20;
// This constant is used by the footer to calculate the maximum possible colspan
const POSSIBLE_EXTRA_COLUMNS = 3;
const PLACEHOLDER_DATA_ROWS = Array(10).fill({});
const EMPTY_BODY_CELL = html`
  <td></td>
`;

/**
 * @fires {DssTableSelectionChangeEvent} dss-table-selection-change - Fires when the selection of rows changed
 * @fires {DssTableRowClickEvent} dss-table-row-double-click - Fires when a row is double-clicked
 * @property columns - The column definition for this table. See TanStack Table for Reference
 * @property data - Array of rows that should be displayed with the given columns definition
 * @property {ContextMenuItem} menuItems - Array of menu items options
 * @property customStyles - Pass Styles that will be defined inside the table shadow root
 * @property selectable - Allow rows to be selectable, default false
 * @property sortable - Allow table headers to be sortable, default false
 * @property paginate - Add pagination to the table
 * @property filterable - Add filters to the table columns
 * @property resizable - Allow columns to be resized
 * @property draggableColumns - Enable drag-and-drop of columns to order them manually
 * @property translations - Pass translated texts
 * @property useRowGrouping - Setting this to true will make the table expanded by default and apply row group header styles.
 * @property loading - Enable loading skeleton styles
 */
@customElement('dss-table')
export default class Table extends BaseElement<TableEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: Array, attribute: false })
  public data?: any[];
  @property({ type: Array, attribute: false })
  public columns?: ColumnDef<any>[];
  @property({ attribute: false })
  public customStyles?: string;
  @property({ type: Boolean, attribute: false })
  public selectable = false;
  @property({ type: Boolean, attribute: false })
  public paginate = false;
  @property({ type: Boolean, attribute: false })
  public sortable = false;
  @property({ type: Boolean, attribute: false })
  public filterable = false;
  @property({ type: Boolean, attribute: false })
  public resizable = false;
  @property({ type: Boolean, attribute: false })
  public draggableColumns = false;
  @property({ type: Array, attribute: false })
  public menuItems: ContextMenuItem[] = [];
  @property({ type: Boolean })
  public useRowGrouping = false;
  @property({ attribute: false })
  public loading = false;

  @queryAll('dss-column-filter')
  private filters!: NodeListOf<ColumnFilter>;

  private table?: TanstackTable<any>;
  private headerRef: Ref<HTMLElement> = createRef();
  private footerRef: Ref<HTMLElement> = createRef();
  private interceptTop: Ref<HTMLDivElement> = createRef();
  private interceptBottom: Ref<HTMLDivElement> = createRef();
  private intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const relevantElement = entry.target === this.interceptTop.value
          ? this.headerRef.value!
          : this.footerRef.value!;
        if (entry.isIntersecting) {
          relevantElement.classList.remove('sticky');
        } else {
          relevantElement.classList.add('sticky');
        }
      });
    },
    {
      threshold: [1],
    },
  );

  private _translations: TableTranslations = DEFAULT_TABLE_TRANSLATIONS;

  get translations() {
    return this._translations;
  }

  @property({ attribute: false })
  set translations(overwrittenTranslations: TableTranslations) {
    this._translations = {
      ...DEFAULT_TABLE_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  renderFilteredColumnFooters() {
    if (this.table) {
      return html`
        ${this.table.getFooterGroups().map(footerGroup => html`
          <tr class="column-footer">
            ${this.renderExpansionCell('foot')}
            ${this.renderSelectionCell('foot')}
            ${this.renderActionCell('foot')}
            ${footerGroup.headers.map(footer => html`
              <td class=${classMap({ 'text-right': footer.column.columnDef.meta?.alignRight ?? false })}>
                ${footer.isPlaceholder
                  ? nothing
                  : flexRenderWithLoadingState(footer.column.columnDef.footer, footer.getContext(), this.loading)
                }
              </td>
            `)}
          </tr>
        `)}

        <tr>
          <th
            class="footer-row-border"
            colspan=${this.columns?.length ? (this.table.getAllLeafColumns().length + POSSIBLE_EXTRA_COLUMNS) : 0}
          ></th>
        </tr>

        <tr class="column-footer filtered">
          ${this.renderExpansionCell('foot')}
          ${this.renderSelectionCell('foot')}
          ${this.renderActionCell('foot')}

          ${this.table.getAllColumns().map(column => (
            column.columnDef.meta?.filteredTotal?.(this.table!) !== undefined
              ? html`
                <td class=${classMap({ 'text-right': column.columnDef.meta?.alignRight ?? false })}>
                  ${column.columnDef.meta?.filteredTotal(this.table!)}
                </td>
              `
              : EMPTY_BODY_CELL
          ))}
        </tr>

        <tr>
          <th
            class="footer-row-border"
            colspan=${this.columns?.length ? (this.table.getAllLeafColumns().length + POSSIBLE_EXTRA_COLUMNS) : 0}
          ></th>
        </tr>
      `;
    }
    return nothing;
  }

  override render() {
    if (!this.table || !this.columns || !this.data) {
      return;
    }

    return html`
      ${when(this.customStyles, () => html`
        <style>${unsafeCSS(this.customStyles)}</style>
      `)}
      <div ${ref(this.interceptTop)}></div>
      <table class="${classMap({ loading: this.loading })}">
        ${this.renderHeader()}
        ${when(this.useRowGrouping,
          () => {
            const preExpandedRows = this.table!.getPreExpandedRowModel().rows;
            return this.renderMultiBody(preExpandedRows);
          },
          () => html`
            <tbody>
            ${repeat(
              this.table!.getRowModel().rows,
              (row) => row.id,
              (row) => this.renderBodyRow(row, this.getEvenOddOfParentRow(row, this.table!.getRowModel().rows.filter((row) => row.depth === 0))),
            )}
            </tbody>
          `,
        )}
        ${when(this.shouldRenderFooter(), () => this.renderFooter())}
      </table>
      <div ${ref(this.interceptBottom)}></div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.necessaryPropertiesSet()) {
      this.initTable();
      this.requestUpdate();
    }
  }

  override disconnectedCallback() {
    this.intersectionObserver.disconnect();
    super.disconnectedCallback();
  }

  override willUpdate(_changedProperties: PropertyValues) {
    const keys = Array.from(_changedProperties.keys());
    if (keys.some((key) => WATCHED_PROPS.includes(key as keyof Table))
      && this.necessaryPropertiesSet()) {
      if (this.table) {
        this.table.setOptions((prev) => ({
          ...prev,
          ...this.getFeatureRowModels(),
          data: this.loading && this.data!.length === 0 ? PLACEHOLDER_DATA_ROWS : this.data!,
          columns: this.columns!,
          state: {
            ...prev.state,
            columnOrder: this.columns!.map(col => col.id as string),
            pagination: {
              pageIndex: prev.state.pagination?.pageIndex ?? 0,
              pageSize: PAGE_SIZE,
            },
          },
        }));
      } else {
        this.initTable();
      }
    }
  }

  override firstUpdated() {
    this.intersectionObserver.observe(this.interceptTop.value!);
    this.intersectionObserver.observe(this.interceptBottom.value!);
  }

  public async exportTable(fileName?: string) {
    if (this.table) {
      const { exportTable } = await import('./export/exportTable');
      exportTable(this.table, fileName);
    }
  }

  private renderHeader(): TemplateResult<1> {
    return html`
      <thead ${ref(this.headerRef)}>
      ${this.table!.getHeaderGroups().map((headerGroup) => html`
        <tr>
          ${this.renderExpansionCell('head')}
          ${this.renderSelectionCell('head')}
          ${this.renderActionCell('head')}
          ${headerGroup.headers.map((header) => html`
            <th
              colSpan=${header.colSpan}
              ?draggable=${this.draggableColumns}
              @dragstart=${({ dataTransfer }: DragEvent) => this.handleDragStart(header, dataTransfer)}
              @dragover=${(event: DragEvent) => this.handleDragOver(event)}
              @drop=${({ dataTransfer }: DragEvent) => this.handleDrop(header, dataTransfer)}
              class=${classMap({ 'text-right': header.column.columnDef.meta?.alignRight ?? false })}
              style="${header.column.getCanResize() ? `width: ${header.getSize()}px` : ''}"
            >
              ${when(this.sortable,
                () => html`
                  <div class="sortable-header" @click=${header.column.getToggleSortingHandler()}>
                    <span>${this.renderHeaderCell(header)}</span>
                    ${when(header.column.getIsSorted(), () => html`
                      <dss-icon
                        icon="chevron-up"
                        class="sort-icon icon-${header.column.getIsSorted()}"
                        size="xsmall"
                      ></dss-icon>
                    `)}
                  </div>
                `,
                () => this.renderHeaderCell(header),
              )}
              ${when(header.column.getCanResize(), () => html`
                <div
                  @mousedown=${(event: MouseEvent) => this.startResizing(event, header)}
                  @touchstart=${(event: TouchEvent) => this.startResizing(event, header)}
                  class="resizer"
                  role="separator"
                ></div>
              `)}
            </th>
          `)}
        </tr>
        ${when(this.filterable, () => this.renderFilterRow(headerGroup))}
      `)}
      </thead>
    `;
  }

  private renderFilterRow(headerGroup: HeaderGroup<any>): TemplateResult<1> {
    return html`
      <tr>
        ${this.renderExpansionCell('filter')}
        ${this.renderSelectionCell('filter')}
        ${this.renderActionCell('filter')}
        ${when(this.menuItems.length > 0 && !this.filterable, () => EMPTY_BODY_CELL)}
        ${headerGroup.headers.map((header) => html`
          <td class=${classMap({ 'text-right': header.column.columnDef.meta?.alignRight ?? false })}>
            <dss-column-filter
              .header=${header as any}
              .translations="${this.translations.columnFilterTranslations}"
              .disabled="${this.loading}"
            ></dss-column-filter>
          </td>
        `)}
      </tr>
    `;
  }

  private renderMultiBody(rows: Row<any>[]): unknown {
    return repeat(rows, (row) => row.id, (row) => html`
      <tbody>
      <tr class="group-header">
        ${this.renderBodyRowContent(row, 'bodyGroupHead')}
      </tr>
      ${when(
        !this.hasMoreThanOneSubLevel(row),
        () => repeat(
          row.subRows,
          (leafRow) => leafRow.id,
          (leafRow) => this.renderBodyRow(leafRow, this.getEvenOddReversed(leafRow)),
        ),
      )}
      </tbody>
      ${when(this.hasMoreThanOneSubLevel(row), () => this.renderMultiBody(row.subRows))}
    `);
  }

  private renderBodyRow(row: Row<any>, evenOdd: 'even' | 'odd'): TemplateResult<1> {
    return html`
      <tr
        class="${evenOdd}"
        @dblclick="${() => this.dispatchCustomEvent('dss-table-row-double-click', row.original)}"
      >
        ${this.renderBodyRowContent(row)}
      </tr>
    `;
  }

  private renderBodyRowContent(row: Row<any>, location: TableRenderLocation = 'body'): TemplateResult<1> {
    return html`
      ${this.renderExpansionCell(location, row)}
      ${this.renderSelectionCell(location, row)}
      ${this.renderActionCell(location, row)}
      ${row.getVisibleCells().map((cell, index) => {
        const rowData = row.original;
        const columnDef = cell.getContext().column.columnDef;
        return html`
          <td
            style="${styleMap({
              ...columnDef.meta?.styles?.(rowData),
              width: cell.column.getCanResize() ? `${cell.column.getSize()}px` : undefined,
            })}"
            class="${classMap({
              ...columnDef.meta?.classes?.(rowData),
              'text-right': columnDef.meta?.alignRight ?? false,
              'first-content': index === 0,
            })}"
            data-depth="${row.depth}"
          >
            ${flexRenderWithLoadingState(
              columnDef.cell,
              cell.getContext(),
              this.loading,
            )}
          </td>
        `;
      })}
    `;
  }

  private renderFooter() {
    return html`
      <tfoot ${ref(this.footerRef)}>

      ${when(this.filterable && this.hasActiveFilters(), () => this.renderFilteredColumnFooters())}

      <tr>
        <td colspan="${this.table!.getAllColumns().length + POSSIBLE_EXTRA_COLUMNS}">
          <div class="footer">
            <span class="footer-information">
              <span>
                ${this.translations.totalElements}:
                ${this.loading ? html`&ndash;` : this.table!.getCoreRowModel().flatRows.length}
              </span>
              ${when(this.filterable && this.hasActiveFilters(), () => html`
                <span>
                  ${this.translations.filteredElements}:
                  ${this.loading ? html`&ndash;` : this.table!.getFilteredRowModel().flatRows.length}
                </span>
              `)}
              ${when(this.selectable, () => html`
                <span>${this.translations.selectedElements}: 
                  ${this.loading ? html`&ndash;` : this.table!.getSelectedRowModel().flatRows.length}</span>
              `)}
            </span>
            ${when(this.paginate, () => html`
              <dss-pagination
                .activePageIndex=${this.table!.getState().pagination.pageIndex}
                .pageCount=${this.table!.getPageCount()}
                .firstPage=${() => this.table!.setPageIndex(0)}
                .previousPage=${() => this.table!.previousPage()}
                .nextPage=${() => this.table!.nextPage()}
                .lastPage=${() => this.table!.setPageIndex(this.table!.getPageCount() - 1)}
                .canGetPreviousPage=${this.table!.getCanPreviousPage}
                .canGetNextPage=${this.table!.getCanNextPage}
                @dss-pagination-page-index-selected=${({ detail }: DssPaginationPageIndexSelectedEvent) => this.table!.setPageIndex(detail)}
              ></dss-pagination>
            `)}
          </div>
        </td>
      </tr>
      </tfoot>
    `;
  }

  private renderExpansionCell(location: TableRenderLocation, row?: Row<any>): TemplateResult<1> | Symbol {
    if (this.table?.getCanSomeRowsExpand() && !this.useRowGrouping) {
      if (location === 'head') {
        return html`
          <th class="expand-header">
            <dss-button
              type="icon-only"
              .disabled="${this.loading}"
              @click=${this.table?.getToggleAllRowsExpandedHandler()}
            >
              <dss-icon
                icon="${this.table?.getIsAllRowsExpanded() ? 'minus-sm' : 'add-sm'}"
                size="xsmall"
              ></dss-icon>
            </dss-button>
          </th>
        `;
      } else if (location === 'filter' || location === 'foot') {
        return EMPTY_BODY_CELL;
      } else if (row !== undefined) {
        return html`
          <td class="expand-cell" data-depth="${row.depth}">
            ${when(row.getCanExpand(), () => html`
              <dss-button
                type="icon-only"
                @click=${row.getToggleExpandedHandler()}
              >
                <dss-icon
                  icon="${row.getIsExpanded() ? 'minus-sm' : 'add-sm'}"
                  size="xsmall"
                ></dss-icon>
              </dss-button>
            `)}
          </td>
        `;
      }
    }
    return nothing;
  }

  private renderSelectionCell(location: TableRenderLocation, row?: Row<any>): TemplateResult<1> | Symbol {
    if (this.selectable) {
      if (location === 'head') {
        return html`
          <th>
            <dss-checkbox
              size="compact"
              @change=${this.table!.getToggleAllRowsSelectedHandler()}
              .checked=${this.table!.getIsAllRowsSelected()}
              .indeterminate=${this.table!.getIsSomeRowsSelected()}
              .disabled="${this.loading}"
            ></dss-checkbox>
          </th>
        `;
      } else if (location === 'filter' || location === 'bodyGroupHead' || location === 'foot') {
        return EMPTY_BODY_CELL;
      } else if (row !== undefined) {
        return html`
          <td>
            <dss-checkbox
              size="compact"
              @change=${row.getToggleSelectedHandler()}
              .checked=${row.getIsSelected()}
              .indeterminate=${row.getIsSomeSelected()}
              .disabled="${this.loading}"
            ></dss-checkbox>
          </td>
        `;
      }
    }
    return nothing;
  }

  private renderActionCell(location: TableRenderLocation, row?: Row<any>): TemplateResult<1> | Symbol {
    if (this.filterable || this.menuItems.length > 0) {
      if (location === 'filter') {
        return html`
          <td>
            <dss-button
              aria-label="${this.translations.clearAllFilters}"
              class="${classMap({
                'clear-all-button': true,
                'clear-all-button-hidden': !this.hasActiveFilters(),
              })}"
              @click="${() => this.resetFilters()}"
              type="icon-only"
              tooltip=${this.translations.clearAllFilters}
              .disabled="${this.loading}"
            >
              <dss-icon icon="close-sm" size="small"></dss-icon>
            </dss-button>
          </td>
        `;
      } else if (location === 'head' || location === 'foot') {
        return EMPTY_BODY_CELL;
      }
    }
    if (location === 'body' || location === 'bodyGroupHead') {
      if (this.filterable && !this.menuItems.length || location === 'bodyGroupHead') {
        return EMPTY_BODY_CELL;
      } else if (this.menuItems.length && row !== undefined) {
        return html`
          <td>
            <dss-flyout placement="bottom-start">
              <dss-button slot="trigger" type="icon-only" .disabled="${this.loading}">
                <dss-icon icon="more-h"></dss-icon>
              </dss-button>

              <dss-menu @dss-menu-selection="${this.handleMenuSelectionEvent}">
                ${this.menuItems
                  .filter(menuItem => this.shouldRenderMenuItem(row.original, menuItem))
                  .map(menuItem => html`
                      <dss-menu-item .value="${{ menuItem, row } as MenuItemValue}">
                        ${when(menuItem.linkFn !== undefined,
                          () => html`
                            <a href="${menuItem.linkFn!(row.original)}" target="_blank">${menuItem.text}</a>
                          `,
                          () => menuItem.text,
                        )}
                      </dss-menu-item>
                    `,
                  )}
              </dss-menu>
            </dss-flyout>
          </td>
        `;
      }
    }
    return nothing;
  }

  private hasMoreThanOneSubLevel(row: Row<any>): boolean {
    return row.subRows?.some(subRow => subRow.getCanExpand());
  }

  private handleDragStart(header: Header<any, unknown>, dataTransfer: DataTransfer | null): void | typeof nothing {
    return this.draggableColumns
      ? dataTransfer?.setData('text/plain', header.column.id)
      : nothing;
  }

  private handleDragOver(event: DragEvent): void {
    this.draggableColumns ? event.preventDefault() : nothing;
  }

  private handleDrop(header: Header<any, unknown>, dataTransfer: DataTransfer | null): void | typeof nothing {
    return this.draggableColumns
      ? this.dropHeader(header.column.id, dataTransfer?.getData('text/plain'))
      : nothing;
  }

  private shouldRenderMenuItem(rowData: any, menuItem: ContextMenuItem) {
    if (menuItem.isHidden === undefined) {
      return true;
    }
    return !menuItem.isHidden(rowData);
  }

  private resetFilters(): void {
    this.filters.forEach(filter => filter.clear());
    this.table?.resetColumnFilters();
  }

  private hasActiveFilters(): boolean {
    if (!this.table) {
      return false;
    }
    return this.table.getState().columnFilters.length > 0;
  }

  private shouldRenderFooter() {
    return this.paginate || this.selectable || this.filterable;
  }

  private renderHeaderCell(header: CoreHeader<any, unknown>) {
    if (header.isPlaceholder) {
      return nothing;
    }
    return flexRender(
      header.column.columnDef.header,
      header.getContext(),
    );
  }

  private necessaryPropertiesSet(): boolean {
    return this.columns !== undefined && this.data !== undefined;
  }

  private initTable() {
    this.table = createTable(this.createOptions());
    this.table.setOptions((prev) => {
      const options = {
        ...prev,
        state: {
          ...this.table!.initialState,
          columnOrder: this.columns!.map(column => column.id as string),
          pagination: {
            pageIndex: 0,
            pageSize: PAGE_SIZE,
          },
        },
      };
      if (this.useRowGrouping) {
        options.filterFromLeafRows = true;
        options.state.expanded = true;
      }
      return options;
    });
  }

  private getFeatureRowModels(): Partial<TableOptionsResolved<any>> {
    const rowModels: Partial<TableOptionsResolved<any>> = {};
    if (this.sortable) {
      rowModels.getSortedRowModel = getSortedRowModel();
    }
    if (this.paginate) {
      rowModels.getPaginationRowModel = getPaginationRowModel();
    }
    if (this.filterable) {
      rowModels.getFilteredRowModel = getFilteredRowModel();
      rowModels.getFacetedUniqueValues = getFacetedUniqueValues();
    }
    return rowModels;
  }

  private createOptions() {
    const options: TableOptionsResolved<any> = {
      data: this.getTableData(),
      columns: this.columns!,
      state: {},
      filterFns: {
        numeric: numeric,
        dateRange: dateRange,
        select: select,
        multiSelect: multiSelect,
      },
      renderFallbackValue: null,
      columnResizeMode: 'onChange',
      enableColumnResizing: this.resizable,
      getSubRows: (row) => row.subRows,
      onStateChange: () => {
      },
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      ...this.getFeatureRowModels(),
      onRowSelectionChange: (updaterOrValue) => this.handleRowSelectionChange(updaterOrValue),
      onSortingChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'sorting'),
      onColumnOrderChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnOrder'),
      onExpandedChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'expanded'),
      onPaginationChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'pagination'),
      onColumnFiltersChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnFilters'),
      onColumnSizingChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnSizing'),
      onColumnSizingInfoChange: (updaterOrValue) => this.updatePartialTableState(updaterOrValue, 'columnSizingInfo'),
    };
    return options;
  }

  private getTableData(): any[] {
    if (this.loading && !this.data?.length) {
      return PLACEHOLDER_DATA_ROWS;
    }
    return this.data ?? [];
  }

  private handleRowSelectionChange(updaterOrValue: Updater<RowSelectionState>) {
    this.updatePartialTableState(updaterOrValue, 'rowSelection');
    this.dispatchCustomEvent('dss-table-selection-change', this.table!.getSelectedRowModel().rows.map(row => row.original));
  }

  private startResizing(event: MouseEvent | TouchEvent, header: Header<any, unknown>) {
    event.preventDefault();
    header.getResizeHandler()(event);
  }

  private updatePartialTableState(updaterOrValue: Updater<any>, field: keyof TableState): any {
    this.table!.setOptions((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        [field]: typeof updaterOrValue === 'function'
          ? updaterOrValue(this.table!.getState()[field])
          : updaterOrValue,
      },
    }));
    this.requestUpdate();
  }

  private dropHeader(dropColumnId: string, dragColumnId?: string) {
    if (!dragColumnId || dropColumnId === dragColumnId) {
      return;
    }
    const newColumnOrder = [...this.table!.getState().columnOrder];
    newColumnOrder.splice(
      newColumnOrder.indexOf(dropColumnId),
      0,
      newColumnOrder.splice(newColumnOrder.indexOf(dragColumnId), 1)[0],
    );
    this.updatePartialTableState(newColumnOrder, 'columnOrder');
  }

  private getEvenOddReversed(row: Row<any>): EvenOdd {
    return row.index % 2 === 0
      ? 'odd'
      : 'even';
  }

  private getEvenOddOfParentRow(row: Row<any>, topLevelRows: Row<any>[]): EvenOdd {
    let index: number;
    if (row.depth === 0) {
      index = topLevelRows.findIndex((currentRow) => currentRow === row);
    } else {
      const parentId = parseInt(row.id);
      index = topLevelRows.findIndex((currentRow) => parseInt(currentRow.id) === parentId);
    }
    return index % 2 === 0
      ? 'even'
      : 'odd';
  }

  private handleMenuSelectionEvent({ detail }: DssMenuSelectionEvent) {
    const value = detail.value as MenuItemValue;
    value.menuItem.selectHandler?.(value.row.original);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-table': Table;
  }

  interface WindowEventMap {
    'dss-table-selection-change': DssTableSelectionChangeEvent;
    'dss-table-row-double-click': DssTableRowClickEvent;
  }
}
