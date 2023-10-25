import { describe, expect, test } from 'vitest';
import {
  ColumnDef,
  createTable as _createTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptionsResolved,
} from '@tanstack/table-core';
import { dateRange, multiSelect, numeric, select } from '../filter/customFilters';
import { exportData, exportHeaders } from './exportTable';
import { html } from 'lit';

describe('exportTable', () => {

  interface Person {
    firstName: string;
    lastName: string;
  }

  const data: Person[] = [
    { firstName: 'Philipp', lastName: 'Eugster' },
    { firstName: 'Josette', lastName: 'Bättig' },
    { firstName: 'Liselotte', lastName: 'Meyer' },
  ];

  function createTable(data: any[], columns: any[]) {
    const table = _createTable(createOptions(data, columns));
    table.setOptions((prev) => ({
      ...prev,
      state: {
        ...table!.initialState,
      },
    }));

    return table;
  }

  function createOptions(data: any[], columns: any[]): TableOptionsResolved<any> {
    return {
      data: data,
      columns: columns,
      state: {},
      filterFns: {
        numeric: numeric,
        dateRange: dateRange,
        select: select,
        multiSelect: multiSelect,
      },
      renderFallbackValue: undefined,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onStateChange(): void {
      },
    };
  }

  describe('exportHeaders', () => {
    test('plain headers, exports headers', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          accessorKey: 'firstName',
          header: 'First Name',
        },
      ];

      const table = createTable(data, columns);
      const headers = exportHeaders(table);

      expect(headers).toHaveLength(1);
      expect(headers[0]).toBe('First Name');
    });

    test('headers that return HTML elements, uses text content', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          header: () => html`
            <marquee>First Name</marquee>`,
        },
      ];

      const table = createTable(data, columns);
      const headers = exportHeaders(table);
      expect(headers).toHaveLength(1);
      expect(headers[0]).toBe('First Name');
    });
  });

  describe('exportData', () => {
    test('column with accessorKey, exports data', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          accessorKey: 'firstName',
          header: 'First Name',
        },
      ];

      const table = createTable(data, columns);
      const exportedData = exportData(table);

      expect(exportedData).toHaveLength(3);
      exportedData.forEach((exported, index) => expect(exported[0]).toBe(data[index].firstName));
    });

    test('column with accessorFn, exports data', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          accessorFn: person => person.firstName,
          header: 'First Name',
        },
      ];

      const table = createTable(data, columns);
      const exportedData = exportData(table);

      expect(exportedData).toHaveLength(3);
      exportedData.forEach((exported, index) => expect(exported[0]).toBe(data[index].firstName));
    });

    test('column with accessorFn and cell, exports data from cell\'s text content', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          accessorFn: person => person.firstName + person.lastName,
          cell: ({ row: { original } }) => html`<p>${original.firstName}</p>`,
          header: 'First Name',
        },
      ];

      const table = createTable(data, columns);
      const exportedData = exportData(table);

      expect(exportedData).toHaveLength(3);
      exportedData.forEach((exported, index) => expect(exported[0]).toBe(data[index].firstName));
    });

    test('column with only cell function, exports cell\'s text content', () => {
      const columns: ColumnDef<Person>[] = [
        {
          id: 'firstName',
          cell: ({ row: { original } }) => html`<p>${original.firstName}</p>`,
          header: 'First Name',
        },
      ];

      const table = createTable(data, columns);
      const exportedData = exportData(table);

      expect(exportedData).toHaveLength(3);
      exportedData.forEach((exported, index) => expect(exported[0]).toBe(data[index].firstName));
    });
  });
});