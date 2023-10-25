## Usage

Menus are passed to the table as a prop:

```html

<dss-table .data=${data} .columns=${columns} .menuItems=${menuItems}></dss-table>
```

Interface of menu items:

```ts
export interface ContextMenuItem<TData extends RowData = any> {
  text: string;
  linkFn?: (rowData: TData) => string;
  isHidden?: (rowData: TData) => boolean;
}
```

## Events

The menu will emit a `dss-menu-selection` when the user selects an option. The event details will contain the data bound
to the table row and the option that was clicked:

```json
{
  "value": {
    "firstName": "Liliane",
    "lastName": "Eichenberger",
    "age": 25,
    "visits": 265,
    "progress": 24,
    "createdAt": "2019-03-27T20:12:03.941Z",
    "status": "relationship",
    "company": "Schwarz-Mettler",
    "wealth": {
      "currency": "USD",
      "amount": 131150
    }
  },
  "text": "Copy"
}
```

### Example:

Here we hide the third menu option if the person's wealth is negative.

```ts
const menuItems: ContextMenuItem<Person>[] = [
  {
    text: 'Copy',
  },
  {
    text: 'Edit',
  },
  {
    text: 'Go to details',
    linkFn: (person: Person) => '?details=' + person.id,
    isHidden: (person: Person) => person.wealth.amount < 0,
  },
];

return html`
<dss-table.data=${data}.columns=${columns as any}.menuItems=${ifDefined(menuItems)} />
`;
```