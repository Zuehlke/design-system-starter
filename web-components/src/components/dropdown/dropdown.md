## Interaction
* Dropdowns expose a menu that can be collapsed or expanded on user interaction.
* A clickable button with a right aligned arrow, showing which way of interaction is possible
* By clicking on a dropdown a list of contents or navigation points are showed. As soon as one option is selected, the
  chosen one is displayed in the main field and the options panel disappears.
  The exception to this is, if a list of multiple selectable options ->
* The width of the button and the options panel can differ, per default they should be the same.

## Usage

* Dropdowns help to save space
* Try to avoid dropdowns with fewer than 5 options, if there are more than 15 options consider using a search field or
  another pattern to make finding and selecting easy.
* The list of the content can include generateIconTypes if needed and dividers to enable grouping of options.
* In forms, dropdowns prevent users from entering erroneous data, since they only show available, correct choices.

## Validation

* It is recommended to validate the dropdown `onChange` and not `onBlur`. The dropdown emits a `onBlur` event when the
  focus changes from the input field to the list of options containing the previously selected value leading to
  incorrect validations.

## Multiselect

### Hide menu item from automatic selection handling

When used as a multiselect, the dropdown will keep the selected property on all `menuItem`s in sync with its state. If
you have `menuItem`s that should be excluded from any selection handling by the dropdown you can use the data attribue:
`data-dss-dropdown-ignore`.

Setting this to anything `falsy` will prevent the dropdown logic from reading or setting the selected property on it.
