import './table.component';
import { html } from 'lit-html';
import { format } from 'date-fns';
import { makeData, Person, valuationData, ValuationHeader, ValuationRow } from './makeData.story-utils';
import { classMap } from 'lit-html/directives/class-map.js';
import DssTable from './table.component';
import Table, { ColumnDef } from './table.component';
import { Meta, StoryFn } from '@storybook/web-components';
import docs from './table.md?raw';
import docsFilterable from './table.filterable.md?raw';
import docsRendering from './table.rendering.md?raw';
import docsMenu from './table.menu.md?raw';
import docsExport from './export/table.export.md?raw';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { withActions } from '@storybook/addon-actions/decorator';

const numberTypes: Intl.NumberFormatPartTypes[] = [
  'minusSign',
  'integer',
  'group',
  'decimal',
  'fraction',
];

const meta: Meta<Table> = {
  title: 'Components/Table',
  component: 'dss-table',
  parameters: {
    actions: {
      handles: ['dss-table-selection-change', 'dss-table-row-double-click', 'dss-menu-selection'],
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
  decorators: [withActions],
};
export default meta;

const Template: StoryFn<Table> = ({
  data,
  columns,
  menuItems,
  customStyles,
  selectable,
  sortable,
  paginate,
  filterable,
  resizable,
  draggableColumns,
  translations,
  useRowGrouping,
  loading,
}) => html`
  <dss-table
    .data=${data}
    .columns=${columns as any}
    .menuItems=${ifDefined(menuItems)}
    .customStyles=${customStyles}
    .selectable=${selectable}
    .sortable="${sortable}"
    .paginate="${paginate}"
    .filterable="${filterable}"
    .resizable="${resizable ?? false}"
    .draggableColumns="${draggableColumns}"
    .translations="${translations}"
    .useRowGrouping="${ifDefined(useRowGrouping)}"
    .loading="${loading}"
  ></dss-table>
`;

export const Default = Template.bind({});
Default.args = {
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (row) => format(row.createdAt as Date, 'dd.MM.yyyy hh:mm:ss'),
    },
  ] as ColumnDef<Person>[],
};

export const CustomRender = Template.bind({});
CustomRender.parameters = {
  docs: {
    description: {
      story: docsRendering,
    },
  },
};
CustomRender.args = {
  data: makeData(20),
  // language=CSS
  customStyles: `
    .wealth {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      background-color: #A4D1A2;
      margin: calc(var(--size-0-25) * -1) calc(var(--size-0-5) * -1);
      padding: var(--size-0-25) var(--size-0-5);
    }

    .wealth-negative {
      background-color: #ffb6b6;
    }

    .underage {
      font-weight: var(--typography-h4-font-weight);
      color: var(--color-universal-red-100);
    }
  `,
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
      meta: {
        styles: (person) => ({
          fontWeight: person.age < 18 ? 'var(--typography-h4-font-weight)' : undefined,
        }),
      },
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      meta: {
        classes: (person) => ({ underage: person.age < 18 }),
        alignRight: true,
      },
    },
    {
      accessorKey: 'wealth',
      id: 'wealth',
      accessorFn: ({ wealth }) => new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: wealth.currency,
        maximumFractionDigits: 2,

      }).format(wealth.amount),
      header: () => html`
        <marquee>Wealth</marquee>`,
      cell: ({ row: { original } }) => {
        const { amount, currency } = original.wealth;
        const formattedParts = new Intl.NumberFormat(navigator.language, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,

        }).formatToParts(amount);
        return html`
          <div
            class=${classMap({
              wealth: true,
              'wealth-negative': amount < 0,
            })}
          >
            <span>${formattedParts.find(part => part.type === 'currency')?.value}</span>
            <span>
              ${formattedParts
                .filter(part => numberTypes.includes(part.type))
                .map(part => part.value)
                .join('')}
            </span>
          </div>
        `;
      },
      filterFn: (row, columnId, filterValue: string) => {
        const separatedValues = filterValue.split(' ');
        const formattedPrice: string = row.getValue(columnId);
        return separatedValues.every(value => formattedPrice.includes(value));
      },
    },
  ] as ColumnDef<Person>[],
};

export const Resizable = Template.bind({});
Resizable.parameters = {
  docs: {
    description: {
      story: 'Resizing of specific columns can be turned off with setting `enableResizing` in the column config.',
    },
  },
};
Resizable.args = {
  resizable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'Resizable column',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Fixed column',
      enableResizing: false,
    },
  ] as ColumnDef<Person>[],
};

export const Selectable = Template.bind({});
Selectable.args = {
  selectable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const Sortable = Template.bind({});
Sortable.args = {
  sortable: true,
  data: makeData(20),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const DraggableColumns = Template.bind({});
DraggableColumns.args = {
  data: makeData(20),
  draggableColumns: true,
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (row) => format(row.createdAt as Date, 'dd.MM.yyyy hh:mm:ss'),
    },
  ] as ColumnDef<Person>[],
};


export const Expandable = Template.bind({});
Expandable.args = {
  sortable: true,
  data: makeData(20, 3, 2),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const RowGrouping = Template.bind({});
RowGrouping.args = {
  sortable: true,
  filterable: true,
  useRowGrouping: true,
  data: valuationData,
  columns: [
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      filterFn: 'numeric',
      meta: {
        alignRight: true,
      },
    },
    {
      id: 'description',
      accessorFn: (originalRow) => {
        return 'description' in originalRow ? originalRow.description : '';
      },
      header: 'Description',
    },
    {
      id: 'value',
      accessorKey: 'value',
      header: 'Value (CHF)',
      filterFn: 'numeric',
      meta: {
        alignRight: true,
      },
    },
  ] as ColumnDef<ValuationHeader | ValuationRow>[],
};

export const Pagination = Template.bind({});
Pagination.args = {
  paginate: true,
  data: makeData(200),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name',
    },
  ] as ColumnDef<Person>[],
};

export const Filterable = Template.bind({});
Filterable.parameters = {
  docs: {
    description: {
      story: docsFilterable,
    },
  },
};
Filterable.args = {
  filterable: true,
  data: makeData(100),
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name (Case-sensitive Filter)',
      filterFn: 'includesStringSensitive',
      footer: () => 'Gesamtvermögen',
      meta: {
        filteredTotal: () => 'Gefiltert',
      },
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name (Default Filter: case-insensitive)',
    },
    {
      accessorKey: 'wealth',
      id: 'wealth',
      header: 'Wealth',
      accessorFn: ({ wealth }) => wealth.amount,
      filterFn: 'numeric',
      footer: ({ table }) => {
        return table.getCoreRowModel().rows.reduce((acc, val) => acc + (val.getValue('wealth') as number), 0) ?? 0;
      },
      meta: {
        alignRight: true,
        filteredTotal: (table) => table.getFilteredRowModel().rows.reduce((acc, val) => acc + (val.getValue('wealth') as number), 0) ?? 0,
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row: { original } }) => format(original.createdAt, 'dd.MM.yyyy'),
      filterFn: 'dateRange',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      filterFn: 'select',
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      filterFn: 'multiSelect',
      footer: ({ table }) => table.getCoreRowModel().rows.length ?? 0,
      meta: {
        filteredTotal: (table) => table.getFilteredRowModel().rows.length ?? 0,
      },
    },
  ] as ColumnDef<Person>[],
  translations: {
    columnFilterTranslations: {
      datepickerTranslations: {
        dayOne: 'Tag',
        dayPlural: 'Tage',
      },
    },
  },
};

export const WithMenuItems = Template.bind({});
WithMenuItems.parameters = {
  docs: {
    description: {
      story: docsMenu,
    },
  },
};
WithMenuItems.args = {
  filterable: true,
  data: makeData(100),
  menuItems: [
    {
      text: 'Edit (action menu option)',
      selectHandler: () => {
        console.log('menu item click handler runs');
      },
    },
    {
      text: 'Go to details (link menu option)',
      linkFn: (person: Person) => '?details=' + person.id,
      isHidden: (person: Person) => person.wealth.amount < 0,
    },
  ],
  columns: [
    {
      id: 'firstName',
      accessorKey: 'firstName',
      header: 'First Name (Case-sensitive Filter)',
      filterFn: 'includesStringSensitive',
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: 'Last Name (Default Filter: case-insensitive)',
    },
    {
      accessorKey: 'wealth',
      id: 'wealth',
      header: 'Wealth',
      accessorFn: ({ wealth }) => wealth.amount,
      filterFn: 'numeric',
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row: { original } }) => format(original.createdAt, 'dd.MM.yyyy'),
      filterFn: 'dateRange',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      filterFn: 'select',
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      filterFn: 'multiSelect',
    },
  ] as ColumnDef<Person>[],
  translations: {
    columnFilterTranslations: {
      datepickerTranslations: {
        dayOne: 'Tag',
        dayPlural: 'Tage',
      },
    },
  },
};

export const Export: StoryFn<Table> = ({
  data,
  columns,
  menuItems,
  customStyles,
  selectable,
  sortable,
  paginate,
  filterable,
  resizable,
  translations,
  loading,
}: DssTable) => {
  const tableRef = createRef<Table>();
  return html`
    <dss-table
      ${ref(tableRef)}
      .data=${data}
      .columns=${columns as any}
      .menuItems=${ifDefined(menuItems)}
      .customStyles=${customStyles}
      .selectable=${selectable}
      .sortable="${sortable}"
      .paginate="${paginate}"
      .filterable="${filterable}"
      .resizable="${resizable ?? false}"
      .translations="${translations}"
      .loading="${loading}"
    ></dss-table>
    <dss-button @click=${() => tableRef.value?.exportTable()}>Export</dss-button>
  `;
};
Export.parameters = {
  docs: {
    description: {
      story: docsExport,
    },
  },
};
Export.args = { ...Filterable.args };