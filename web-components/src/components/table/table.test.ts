import './table.component';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { ColumnDef, ColumnMeta } from '@tanstack/table-core';
import { screen, within } from 'shadow-dom-testing-library';
import { ContextMenuItem, DEFAULT_TABLE_TRANSLATIONS, TableTranslations } from './table.component';
import userEvent from '@testing-library/user-event';

interface TestData {
  name: string;
  age?: number;
}

interface TestColumnWithMeta {
  name: string;
  age?: number;
  meta: ColumnMeta<TestData, any>;
}

describe('Table', () => {
  test('should render data with given config', async () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'TestName' }];

    const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
      <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
    `);

    const table = element.shadowRoot!.querySelector('table')!;
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(table.querySelector('tbody tr:first-child td:nth-child(1)')).toHaveTextContent(testData[0].name);
  });

  test('should emit double click event when row is clicked', async () => {
    const user = userEvent.setup();
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'TestName' }];
    const spy = vi.fn();

    await fixture(html`
      <dss-table .columns=${testColumns as any[]} .data=${testData} @dss-table-row-double-click="${spy}"></dss-table>
    `);

    await user.dblClick(screen.getAllByShadowRole('row')[1]);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: testData[0],
    }));
  });

  describe('custom styling', async () => {
    test('should render custom element and styles in header and cell when set', async () => {
      const styles = '.test { background: red }';
      const testColumns: ColumnDef<TestData>[] = [{
        id: 'name',
        accessorKey: 'name',
        header: () => html`<strong class="test">Header</strong>`,
        cell: ({ row: { original } }) => html`<span class="test">${original.name}</span>`,
      }];
      const testData = [{ name: 'TestName' }];

      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .customStyles=${styles}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      const styleElement: HTMLStyleElement = shadowRoot.querySelector('style')!;
      expect(styleElement.textContent).toBe(styles);
      expect(shadowRoot.querySelector('thead th strong')).toHaveClass('test');
      expect(shadowRoot.querySelector('tbody td span')).toHaveClass('test');
    });

    test('should render custom styles in cell when set', async () => {
      const testColumns: ColumnDef<TestData>[] = [{
        id: 'name',
        accessorKey: 'name',
        meta: {
          styles: () => ({ background: 'red' }),
        },
      }];
      const testData = [{ name: 'TestName' }];

      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      expect(screen.getByShadowRole('cell')).toHaveStyle({ background: 'red' });
    });

    test('should set classes on cell when set', async () => {
      const styles = '.test { background: red }';
      const testColumns: ColumnDef<TestData>[] = [{
        id: 'name',
        accessorKey: 'name',
        meta: {
          classes: () => ({ test: true }),
        },
      }];
      const testData = [{ name: 'TestName' }];

      await fixture(html`
        <dss-table .customStyles="${styles}" .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      expect(screen.getByShadowRole('cell')).toHaveClass('test');
    });

    test('should set text alignment on column cells when right alignment is set', async () => {
      const testColumns: ColumnDef<TestData>[] = [{
        id: 'name',
        accessorKey: 'name',
        meta: {
          alignRight: true,
        },
      }];
      const testData = [{ name: 'TestName' }];

      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      expect(screen.getByShadowRole('columnheader')).toHaveClass('text-right');
      expect(screen.getByShadowRole('cell')).toHaveClass('text-right');
    });
  });

  describe('drag and drop', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'firstName', accessorKey: 'firstName' },
      { id: 'lastName', accessorKey: 'lastName' },
      { id: 'age', accessorKey: 'age' },
    ];
    const testData = [{ firstName: 'first name', lastname: 'last name', age: 10 }];
    let dataTransferMock!: DataTransfer;

    beforeEach(() => {
      const storedData: Record<string, string> = {};
      dataTransferMock = {
        setData(format: string, data: string): void {
          storedData[format] = data;
        },
        getData(format: string): string {
          return storedData[format];
        },
      } as DataTransfer;
    });

    test('should move dragged column after column dropped on when moving to the right', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .draggableColumns="${true}"></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      fireEvent.dragStart(table.querySelector('thead th:first-child')!, { dataTransfer: dataTransferMock });
      fireEvent.drop(table.querySelector('thead th:nth-child(2)')!, { dataTransfer: dataTransferMock });

      await elementUpdated(element);
      expect(table.querySelector('thead th:first-child')).toHaveTextContent('lastName');
    });

    test('should move dragged column in front of column dropped on when moving to the left', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .draggableColumns="${true}"></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      fireEvent.dragStart(table.querySelector('thead th:nth-child(3)')!, { dataTransfer: dataTransferMock });
      fireEvent.drop(table.querySelector('thead th:first-child')!, { dataTransfer: dataTransferMock });

      await elementUpdated(element);
      expect(table.querySelector('thead th:first-child')).toHaveTextContent('age');
    });
  });

  describe('selectable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'TestName' }, { name: 'SecondTestName' }];

    test('should show checkboxes on any level when selectable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('thead th:first-child dss-checkbox')).not.toBeNull();
      expect(table.querySelector('tbody td:first-child dss-checkbox')).not.toBeNull();
    });

    test('should emit all selected rows when click on header checkbox', async () => {
      const listenerSpy = vi.fn();
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);
      element.addEventListener('dss-table-selection-change', listenerSpy);

      fireEvent.change(element.shadowRoot!.querySelector('thead dss-checkbox')!, { target: { checked: true } });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: testData,
      }));
    });

    test('should emit specific selected row when click on row checkbox', async () => {
      const listenerSpy = vi.fn();
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);
      element.addEventListener('dss-table-selection-change', listenerSpy);

      fireEvent.change(element.shadowRoot!.querySelector('tbody dss-checkbox')!, { target: { checked: true } });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: [testData[0]],
      }));
    });

    test('should mark checkboxes according to row selection', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('tbody dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(shadowRoot.querySelector('tbody tr:first-child dss-checkbox')).toHaveProperty<boolean>('checked', true);
      expect(shadowRoot.querySelector('tbody tr:nth-child(2) dss-checkbox')).toHaveProperty<boolean>('checked', false);
      expect(shadowRoot.querySelector('thead tr dss-checkbox')).toHaveProperty<boolean>('indeterminate', true);
    });

    test('should mark all checkboxes when selecting header checkbox', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('thead dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(shadowRoot.querySelector('thead tr dss-checkbox')).toHaveProperty<boolean>('checked', true);
      shadowRoot.querySelectorAll('tbody tr dss-checkbox input').forEach((element) =>
        expect(element).toHaveProperty<boolean>('checked', true),
      );
    });

    test('should show number of selected rows in footer', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .selectable=${true}></dss-table>
      `);

      const shadowRoot = element.shadowRoot!;
      fireEvent.change(shadowRoot.querySelector('tbody dss-checkbox')!, { target: { checked: true } });
      await elementUpdated(element);

      expect(screen.getByShadowText(`${DEFAULT_TABLE_TRANSLATIONS.selectedElements}: 1`)).toBeInTheDocument();
    });
  });

  describe('sortable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'B Test' }, { name: 'A Test' }, { name: 'C Test' }];

    test('should sort column on click in header cell when sortable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .sortable=${true}></dss-table>
      `);
      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('tbody tr:first-child td:first-child')).toHaveTextContent('A Test');
      expect(table.querySelector('tbody tr:last-child td:first-child')).toHaveTextContent('C Test');
    });

    test('should handle icon status when sorting', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .sortable=${true}></dss-table>
      `);
      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toHaveClass('icon-asc');

      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toHaveClass('icon-desc');

      (table.querySelector('thead th div') as HTMLDivElement).click();
      await elementUpdated(element);

      expect(table.querySelector('thead th:first-child dss-icon')).toBeNull();
    });
  });

  describe('expandable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [
      { name: 'A Test', subRows: [{ name: 'AA Test', subRows: [{ name: 'AAA Test' }] }] },
      { name: 'B Test', subRows: [{ name: 'BA Test' }, { name: 'BB Test' }] },
      { name: 'C Test' },
    ];

    test('should show expansion button in header if any rows are expandable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('thead th:first-child dss-button')).not.toBeNull();
    });

    test('should show expansion button in rows that are expandable', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      expect(table.querySelector('tbody tr:nth-child(1) td:first-child dss-button')).not.toBeNull();
      expect(table.querySelector('tbody tr:nth-child(2) td:first-child dss-button')).not.toBeNull();
      expect(table.querySelector('tbody tr:nth-child(3) td:first-child dss-button')).toBeNull();
    });

    test('should show all rows expanded when clicking on header expansion button', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);

      expect(table.querySelectorAll('tbody tr')).toHaveLength(7);
    });

    test('should show one layer more on expand row click', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;

      (table.querySelector('tbody tr:first-child td:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(4);

      (table.querySelector('tbody tr:nth-child(2) td:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(5);
    });

    test('should add even/odd classes same as parent on all sub rows', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData}></dss-table>
      `);

      const table = element.shadowRoot!.querySelector('table')!;
      (table.querySelector('thead th:first-child dss-button') as HTMLButtonElement).click();
      await elementUpdated(element);

      expect(table.querySelector('tbody tr:nth-of-type(1)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(2)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(3)')).toHaveClass('even');
      expect(table.querySelector('tbody tr:nth-of-type(4)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(5)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(6)')).toHaveClass('odd');
      expect(table.querySelector('tbody tr:nth-of-type(7)')).toHaveClass('even');
    });
  });

  describe('filterable', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [{ name: 'A Test' }];

    test('shows filter row when filterable set to true', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .filterable=${true}></dss-table>
      `);

      expect(element.shadowRoot!.querySelector('dss-column-filter')).toBeInTheDocument();
    });

    test('shows header and footer elements when one of the filters is active', async () => {
      const user = userEvent.setup();
      const element = await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .filterable=${true}
        ></dss-table>
      `);

      // not visible when no filter is active
      expect(screen.getByShadowLabelText(DEFAULT_TABLE_TRANSLATIONS.clearAllFilters!)).toHaveClass('clear-all-button-hidden');
      expect(screen.queryByShadowText(`${DEFAULT_TABLE_TRANSLATIONS.filteredElements}: 1`)).not.toBeInTheDocument();

      const filterInput = element.shadowRoot!.querySelector('dss-column-filter')!.shadowRoot!.querySelector('input')!;
      await user.type(filterInput, 'test');

      // visible when no filter is active
      await waitFor(() => expect(screen.getByShadowLabelText(DEFAULT_TABLE_TRANSLATIONS.clearAllFilters!)).not.toHaveClass('clear-all-button-hidden'));
      expect(screen.queryByShadowText(`${DEFAULT_TABLE_TRANSLATIONS.filteredElements}: 1`)).toBeInTheDocument();
    });

    test('clicking on "clear all filters" resets filters', async () => {
      const user = userEvent.setup();
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .filterable=${true}
        ></dss-table>
      `);

      // table is not filtered
      expect(screen.getByShadowText('A Test')).toBeInTheDocument();

      // filter table
      const filterInput = element.shadowRoot!.querySelector('dss-column-filter')!.shadowRoot!.querySelector('input');
      await user.type(filterInput!, '123');
      await waitFor(() => expect(screen.queryByShadowText('A Test')).not.toBeInTheDocument());

      // clear filter
      const clearAllButton = screen.getByShadowText(DEFAULT_TABLE_TRANSLATIONS.clearAllFilters!);
      await user.click(clearAllButton);
      await waitFor(() => expect(screen.queryByShadowText('A Test')).toBeInTheDocument());
      expect(filterInput).toHaveValue('');
    });

    test('when a filter is applied, its corresponding column footer displays the expected value', async () => {
      const user = userEvent.setup();

      const testColumnsWithMeta: ColumnDef<TestColumnWithMeta>[] = [
        {
          id: 'captionColumn',
          accessorKey: 'captionColumn',
          footer: () => 'Caption A',
          meta: {
            filteredTotal: () => 'Caption B',
          },
        },
        {
          id: 'name',
          accessorKey: 'name',
          footer: () => 'Total unfiltered value',
          meta: {
            filteredTotal: () => 'Total filtered value',
          },
        },
      ];
      const testData = [{ name: 'A Test' }];

      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumnsWithMeta as any[]} .data=${testData} .filterable=${true}></dss-table>
      `);

      const filterInput = element.shadowRoot!.querySelector('dss-column-filter')!.shadowRoot!.querySelector('input')!;
      await user.type(filterInput, 'test');

      await waitFor(() => {
        expect(screen.queryByShadowText('Total unfiltered value')).toBeInTheDocument();
        expect(screen.queryByShadowText('Total filtered value')).toBeInTheDocument();
      });
    });

    test('when a filter column footer is applied, displays correct total and filtered values in column footer', async () => {
      const user = userEvent.setup();

      const testColumnsWithMeta: ColumnDef<TestColumnWithMeta>[] = [
        {
          id: 'captionColumn',
          accessorKey: 'captionColumn',
          footer: () => 'Unfiltered',
          meta: {
            filteredTotal: () => 'Filtered',
          },
        },
        {
          id: 'name',
          accessorKey: 'name',
          footer: () => 'Total unfiltered values',
          meta: {
            filteredTotal: () => 'Total filtered values 3',
          },
        },
      ];

      const testData = [
        { name: 'A Test' },
        { name: 'Something Else' },
      ];

      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumnsWithMeta as any[]} .data=${testData} .filterable=${true}></dss-table>
      `);

      const filterInput = element.shadowRoot!.querySelector('dss-column-filter')!.shadowRoot!.querySelector('input')!;
      await user.type(filterInput, 'Something');

      await waitFor(() => {
        expect(screen.queryByShadowText('Total unfiltered values')).toBeInTheDocument();
        expect(screen.queryByShadowText('Total filtered values 3')).toBeInTheDocument();
      });
    });


    test('when footer rows captions meta is provided and a filter footer is applied, displays footer captions', async () => {
      const user = userEvent.setup();

      const testColumnsWithMeta: ColumnDef<TestColumnWithMeta>[] = [
        {
          id: 'captionColumn',
          accessorKey: 'captionColumn',
          footer: () => 'Caption A',
          meta: {
            filteredTotal: () => 'Caption B',
          },
        },
        {
          id: 'name',
          accessorKey: 'name',
          footer: ({ table }) => table.getCoreRowModel().rows.length,
          meta: {
            filteredTotal: (table) => table.getFilteredRowModel().rows.length,
          },
        },
      ];

      const testData = [
        { name: 'A Test' },
        { name: 'Something Else' },
      ];

      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table
          .columns=${testColumnsWithMeta as any[]}
          .data=${testData}
          .filterable=${true}
        ></dss-table>
      `);

      const filterInput = element.shadowRoot!.querySelector('dss-column-filter')!.shadowRoot!.querySelector('input')!;
      await user.type(filterInput, 'else');

      await waitFor(() => {
        expect(screen.queryByShadowText('Caption A')).toBeInTheDocument();
        expect(screen.queryByShadowText('Caption B')).toBeInTheDocument();
      });
    });


  });

  describe('useRowGrouping', () => {
    const testColumns: ColumnDef<TestData>[] = [{ id: 'name', accessorKey: 'name' }];
    const testData = [
      { name: 'A Test', subRows: [{ name: 'AA Test', subRows: [{ name: 'AAA Test' }] }] },
      { name: 'B Test', subRows: [{ name: 'BA Test' }, { name: 'BB Test' }] },
      { name: 'C Test' },
    ];

    test('should be expanded and hide the expansion buttons', async () => {
      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .useRowGrouping="${true}"></dss-table>
      `);

      expect(screen.queryAllByShadowRole('row')).toHaveLength(8);
      expect(screen.queryByShadowRole('button')).toBeNull();
    });

    test('should not show selection button in header', async () => {
      await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .selectable="${true}"
          .useRowGrouping="${true}"
        ></dss-table>
      `);

      expect(screen.queryAllByShadowRole('checkbox')).toHaveLength(4);
    });
  });

  describe('context menu', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'name', accessorKey: 'name' },
    ];

    const testData = [{ name: 'A Test' }, { name: 'Another Test' }];

    const menuItems: ContextMenuItem<TestData>[] = [
      {
        text: 'Add',
        linkFn: (data) => data.name,
      },
      {
        text: 'Edit',
        selectHandler: () => {
        },
      },
    ];

    test('given menu items, it adds a column and renders menu options', async () => {
      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .menuItems=${menuItems}></dss-table>
      `);

      const menuInFirstRow = screen.getAllByShadowRole('menu')[0];

      expect(within(menuInFirstRow).getAllByShadowRole('menuitem')).toHaveLength(2);
      expect(within(menuInFirstRow).getByShadowRole('menuitem', { name: menuItems[0].text })).toBeInTheDocument();
      expect(within(menuInFirstRow).getByShadowRole('menuitem', { name: menuItems[1].text })).toBeInTheDocument();
      expect(within(menuInFirstRow).getByShadowRole('link')).toHaveAttribute('href', testData[0].name);

      const menuInSecondRow = screen.getAllByShadowRole('menu')[1];

      expect(within(menuInSecondRow).getAllByShadowRole('menuitem')).toHaveLength(2);
      expect(within(menuInSecondRow).getByShadowRole('menuitem', { name: menuItems[0].text })).toBeInTheDocument();
      expect(within(menuInSecondRow).getByShadowRole('menuitem', { name: menuItems[1].text })).toBeInTheDocument();
      expect(within(menuInSecondRow).getByShadowRole('link')).toHaveAttribute('href', testData[1].name);
    });

    test('menu items can be hidden using isHidden', async () => {
      const menuItems: ContextMenuItem<TestData>[] = [
        {
          text: 'Add',
          selectHandler: () => {
          },
        },
        {
          text: 'Go to details',
          isHidden: (data) => data.name === 'A Test',
          selectHandler: () => {
          },
        },
      ];
      await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .menuItems=${menuItems}></dss-table>
      `);

      const menuInFirstRow = screen.getAllByShadowRole('menu')[0];
      expect(within(menuInFirstRow).getAllByShadowRole('menuitem')).toHaveLength(1);
      expect(within(menuInFirstRow).getByShadowRole('menuitem', { name: 'Add' })).toBeInTheDocument();

      const menuInSecondRow = screen.getAllByShadowRole('menu')[1];
      expect(within(menuInSecondRow).getAllByShadowRole('menuitem')).toHaveLength(2);
      expect(within(menuInSecondRow).getByShadowRole('menuitem', { name: 'Add' })).toBeInTheDocument();
      expect(within(menuInSecondRow).getByShadowRole('menuitem', { name: 'Go to details' })).toBeInTheDocument();
    });

    test('clicking on menu items, emits event', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .menuItems=${menuItems}
          @dss-menu-selection="${spy}"
        ></dss-table>
      `);

      await user.click(within(screen.getAllByShadowRole('menu')[0]).getByShadowRole('menuitem', { name: menuItems[0].text }));

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value: {
            menuItem: { text: 'Add', linkFn: expect.any(Function) },
            row: expect.objectContaining({ original: testData[0] }),
          },
          text: 'Add',
        },
      }));

      await user.click(within(screen.getAllByShadowRole('menu')[1]).getByShadowRole('menuitem', { name: menuItems[0].text }));

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value: {
            menuItem: { text: 'Add', linkFn: expect.any(Function) },
            row: expect.objectContaining({ original: testData[1] }),
          },
          text: 'Add',
        },
      }));
    });

    test('clicking on an action menu item, calls callback', async () => {
      const callbackSpy = vi.fn();
      const menuItemsWithSpy: ContextMenuItem<TestData>[] = [
        {
          text: 'Menu Option',
          selectHandler: callbackSpy,
        },
      ];

      const user = userEvent.setup();
      await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .menuItems=${menuItemsWithSpy}
        ></dss-table>
      `);

      await user.click(within(screen.getAllByShadowRole('menu')[1]).getByShadowRole('menuitem', { name: menuItemsWithSpy[0].text }));

      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalledWith(expect.objectContaining(testData[1]));
    });
  });

  describe('when resizable set to true', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'name', accessorKey: 'name' },
      {
        id: 'company',
        accessorKey: 'company',
        enableResizing: false,
      },
    ];
    const testData = [{ name: 'A Test' }];

    test('shows resize button for columns without disabled resizing', async () => {
      const element: HTMLElementTagNameMap['dss-table'] = await fixture(html`
        <dss-table .columns=${testColumns as any[]} .data=${testData} .resizable=${true}></dss-table>
      `);

      expect(element.shadowRoot!.querySelectorAll('thead .resizer')).toHaveLength(1);
    });
  });

  describe('when setting translations', () => {
    const testColumns: ColumnDef<TestData>[] = [
      { id: 'name', accessorKey: 'name' },
    ];
    const testData = [{ name: 'A Test' }];

    test('shows set translations and fallback translations for undefined translations', async () => {
      const testTranslations: TableTranslations = {
        selectedElements: 'Test Translation',
      };
      await fixture(html`
        <dss-table
          .columns=${testColumns as any[]}
          .data=${testData}
          .selectable=${true}
          .translations=${testTranslations}
        ></dss-table>
      `);

      expect(screen.getByShadowText(DEFAULT_TABLE_TRANSLATIONS.totalElements + ': 1')).toBeInTheDocument();
      expect(screen.getByShadowText('Test Translation: 0')).toBeInTheDocument();
    });
  });
});
