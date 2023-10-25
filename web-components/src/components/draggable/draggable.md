## Interaction

* Clicking and dragging on the wrapped element moves it across the screen.
* Dropping the element will:
    * leave it at the current position if `snap` is `none` or not specified
    * snap to the nearest boundary (distance between element border and bounds) of the axis which are defined
      with `snap`
* The element can be dragged with a click anywhere inside it, unless drag handlers are defined (see "Usage")

## Usage

* Wrap any element to make them draggable
* Use the `data-dss-draggable-handle` attribute on one or more elements inside the draggable element to specify areas
  where clicking will start the dragging. If specified, anywhere else won't work.
* The `position` property is useful to either programmatically move the element or to reset it to its original position
  with `{x: 0, y: 0}`. It is not updated by the draggable component to reflect the current position.

## Technical notes

* Implemented using the [Neodrag](https://www.neodrag.dev/docs/vanilla) vanilla package
* The position of the slotted element is changed with the `translate` CSS property and not `transform: translate()`
  allowing combinations and separate transitions
