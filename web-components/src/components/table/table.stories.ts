import './table.component';
import { html } from 'lit-html';
import { format } from 'date-fns';
import { classMap } from 'lit-html/directives/class-map.js';
import DssTable from './table.component';
import Table, { ColumnDef } from './table.component';
import { Meta, StoryFn, StoryObj, WebComponentsRenderer } from '@storybook/web-components';
import docs from './table.md?raw';
import docsFilterable from './table.filterable.md?raw';
import docsRendering from './table.rendering.md?raw';
import docsMenu from './table.menu.md?raw';
import docsExport from './export/table.export.md?raw';
import { createRef, ref } from 'lit/directives/ref.js';
import { withActions } from '@storybook/addon-actions/decorator';
import { expandablePersonData, Person, simplePersonData } from '../../mockdata.story-utils';

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
  decorators: [withActions<WebComponentsRenderer>],
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
    .menuItems=${menuItems ?? []}
    .customStyles=${customStyles}
    .selectable=${selectable}
    .sortable="${sortable}"
    .paginate="${paginate}"
    .filterable="${filterable}"
    .resizable="${resizable ?? false}"
    .draggableColumns="${draggableColumns}"
    .translations="${translations}"
    ?useRowGrouping="${useRowGrouping}"
    .loading="${loading}"
  ></dss-table>
`;

export const Default: StoryObj<Table> = {
  render: Template,
  args: {
    data: simplePersonData.slice(0, 20),
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
  },
};

export const CustomRender: StoryObj<Table> = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: docsRendering,
      },
    },
  },
  args: {
    data: simplePersonData.slice(0, 20),
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
            fontWeight: person.age !== null && person.age < 18 ? 'var(--typography-h4-font-weight)' : undefined,
          }),
        },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: 'Age',
        meta: {
          classes: (person) => ({ underage: person.age !== null && person.age < 18 }),
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
          <span style="text-transform: uppercase">Wealth</span>
        `,
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
  },
};

export const Resizable: StoryObj<Table> = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Resizing of specific columns can be turned off with setting `enableResizing` in the column config.',
      },
    },
  },
  args: {
    resizable: true,
    data: simplePersonData.slice(0, 20),
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
  },
};

export const Selectable: StoryObj<Table> = {
  render: Template,
  args: {
    selectable: true,
    data: simplePersonData.slice(0, 20),
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
  },
};

export const Sortable: StoryObj<Table> = {
  render: Template,
  args: {
    sortable: true,
    data: simplePersonData.slice(0, 20),
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
  },
};

export const DraggableColumns: StoryObj<Table> = {
  render: Template,
  args: {
    data: simplePersonData.slice(0, 20),
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
  },
};


export const Expandable: StoryObj<Table> = {
  render: Template,
  args: {
    sortable: true,
    data: simplePersonData.slice(0, 20),
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
  },
};

export const RowGrouping: StoryObj<Table> = {
  render: Template,
  args: {
    sortable: true,
    filterable: true,
    useRowGrouping: true,
    data: expandablePersonData.slice(0, 3),
    columns: [
      {
        id: 'name',
        accessorFn: (originalRow) =>
          originalRow.subRows
            ? originalRow.company
            : originalRow.firstName + ' ' + originalRow.lastName,
        header: 'Name',
        filterFn: 'auto',
      },
      {
        id: 'status',
        accessorFn: originalRow => originalRow.subRows ? '' : originalRow.status,
        header: 'Status',
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: 'Age',
        filterFn: 'numeric',
        meta: {
          alignRight: true,
        },
      },
    ] as ColumnDef<Person>[],
  },
};

export const Pagination: StoryObj<Table> = {
  render: Template,
  args: {
    paginate: true,
    data: simplePersonData.slice(0, 200),
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
  },
};

export const Filterable: StoryObj<Table> = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: docsFilterable,
      },
    },
  },
  args: {
    filterable: true,
    data: simplePersonData.slice(0, 100),
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
  },
};

export const WithMenuItems: StoryObj<Table> = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: docsMenu,
      },
    },
  },
  args: {
    filterable: true,
    data: simplePersonData.slice(0, 100),
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
  },
};

export const Export: StoryObj<Table> = {
  render: ({
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
        .menuItems=${menuItems ?? []}
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
  },
  parameters: {
    docs: {
      description: {
        story: docsExport,
      },
    },
  },
  args: { ...Filterable.args },
};
