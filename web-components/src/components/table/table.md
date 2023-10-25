## Interaction

* Hovering a row highlights the whole row.
* Sorting
    * Sorted columns are marked by the bold header and a directional chevron.
    * Multiple columns can be sorted by holding down the "shift" key.
* When generateIconTypes or abbreviations are used, add a tooltip on hover.
* In the table footer, display number of rows and if rows are selectable, the number of selected elements. (can be
  integrated with pagination)
* Selectable tables
    * A selectable table displays a checkbox on the start of each row as well as in the header.
    * The checkbox in the header can be used to select all or none of the row.
* Actions
    * Eighter use actions per row or actions for selected elements
    * Row actions: add one or more generateIconTypes in the end of each row to enable actions with one rows object.
    * Selected elements actions:
        * Add actions (as buttons) in the table footer (if possible, sticky).
        * Actions are active depending on the selection (some action might not be available for some rows, some action
          can
          only handle a single selection!)
        * If the footer does not have enough space for all action add a 'more' button that displays these actions.
* Expandable tables (Sometimes called tree table) allow to group rows together. A group can then be expanded by clicking
  the <dss-icon icon="add-lg" size="xsmall"></dss-icon> icon.

## Usage

* Mind the alignment: numeric values to the right, text to the left — headers follow same rule as content. Possibly
  separate currency from other values.
* Emphasize certain cells by means of other font styles or background colors.
* Consider fixed headers and/or first columns (position:sticky)
* Either use borders **or** alternating colors.
* For large tables use pagination to prevent performance issues (from xx to xx, load previous and next page).

### Use the following options only when given a hard though to other solutions first!

* Reordered columns need to be saved, otherwise there is no use to it. Always think about the order of the columns as
  part of the specification process.
* Resized columns need to be saved. (resize horizontally with slider).
