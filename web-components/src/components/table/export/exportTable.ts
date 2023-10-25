import { Cell, Header, Table } from '@tanstack/table-core';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { render } from 'lit-html';
import { TemplateResult } from 'lit';
import { flexRender } from '../flexRender';

/**
 * Exports the contents of the table to csv format and downloads the file.
 *
 * Note: the export function uses what is rendered, i.e. what the user sees, which is not necessarily the same as what
 * was set in the accessorKey or accessorFn of the ColumnDef.
 */
export function exportTable(table: Table<any>, fileName?: string) {
  const headers = exportHeaders(table);
  const data = exportData(table);
  triggerCsvDownload(data, headers, fileName);
}

export function exportHeaders(table: Table<any>) {
  return table.getFlatHeaders().map(header => renderHeaderOrCell(header, 'header'));
}

export function exportData(table: Table<any>): Array<Array<any>> {
  return table.getGlobalFacetedRowModel().flatRows.map(row => {
    return row.getAllCells().map(cell => renderHeaderOrCell(cell, 'cell'));
  });
}

function renderHeaderOrCell(headerOrCell: Cell<any, any> | Header<any, any>, field: 'header' | 'cell'): string {
  const element = headerOrCell.column.columnDef[field];
  const rendered = flexRender(element, headerOrCell.getContext());
  if (typeof rendered === 'string') {
    return rendered;
  }

  const cellText = toText(rendered);
  if (cellText !== null) {
    return cellText;
  }

  throw new Error('Cannot export header or cell values without accessorKey or accessorFn from column: ' + headerOrCell.getContext().column.columnDef.id);
}

function toText(content: TemplateResult): string {
  const div = document.createElement('div');
  render(content, div);
  if (!div.textContent) {
    return '';
  }
  return div.textContent.trim().replace(/\s+/g, ' ');
}

function triggerCsvDownload(data: any[][], columns: string[], fileName = 'export') {
  const csvFormattedData = stringify(data, { header: true, delimiter: ';', bom: true, columns });
  const csvMimeType = 'text/csv;charset=utf-8;';
  const blob = new Blob([csvFormattedData], { type: csvMimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.download = `${fileName}.csv`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}