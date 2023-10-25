## Usage

The contents of the table can be exported as a CSV file.
First obtain a reference to the table, then call the `exportTable` method on it to trigger the download.

```ts
const tableRef = createRef<Table>();
return html`
    <dss-table ${ref(tableRef)} .data=${data} .columns=${columns as any} ></dss-table>
    <dss-button @click=${() => tableRef.value?.exportTable()}>Export</dss-button>
  `;
```