## Usage

In order to customize the appearance of cells in a table there are two possible approaches:

1. passing a rendering function to `ColumnDef.cell`
2. setting either `ColumnDef.meta.styles` or `ColumnDef.meta.classes`

## Render function

See [Tanstack table documentation](https://tanstack.com/table/v8/docs/guide/column-defs#column-formatting--rendering)

To simplify templating it is possible to use the `lit-html` directive, even when using other web frameworks and
libraries such as React.
For example:

```ts

const columnDefs: ColumnDef<InstrumentEntryFragment>[] = [
  {
    id: 'example',
    cell: html`
    <p>This is an example</p>
    `
  }
]
```

## Meta Styles and Classes

It is possible to set inline styles or CSS classes on the cells by setting the `meta` property on `ColumnDef`.
Both properties need to be functions on the row data.
This allows it to apply conditional styling based on the data displayed.
Additionally, the `alignRight` boolean flag allows to easily align the entire column to the right, including header.

```ts
import { StyleInfo } from 'lit/directives/style-map.js';
import { ClassInfo } from 'lit/directives/class-map.js';

interface ColumnMeta<TData extends RowData, TValue> {
  styles?: (data: TData) => StyleInfo;
  classes?: (data: TData) => ClassInfo;
  alignRight?: boolean;
}
```

In this example, for every underage person:

* their last name is set to semi-bold using inline styles
* the age is marked in semi-bold and red using the `underage` css class which was defined in `customStyles`
* the age column is right aligned

```ts
const customStyles = `
    .underage {
      font-weight: var(--typography-h4-font-weight);
      color: var(--color-universal-red-100);
    }
`;

const columns = [
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
      alignRight: true
    },
  }
];
```
