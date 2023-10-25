## Usage
* Each column header is extended by a search field.
* The search field allows for a syntax (see below) but usually the text is just used a simple text search. 
* The default placeholder 'Search...' can be exchanged to a more meaningful text to hint what type of data could make sense to filter.

## Technical note
If you need specific filter functions check out the `filterFn` property in the column configuration.

In addition to the
[provided filters by TanStack](https://tanstack.com/table/v8/docs/api/features/filters#filter-functions)
you can use the following custom provided ones:

* **multipleBand**: Allow numeric fields to be searched by defining one or multiple boundaries. Allowed operators
  are: `<`, `>`, `<=`, `>=` which can be connected with `,` (AND) or `;` (OR). E.g. `>0,<100000`, try it out below in
  the "Wealth" column!
