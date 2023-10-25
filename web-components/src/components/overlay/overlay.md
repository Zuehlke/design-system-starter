### Scroll behaviour

The content part of the overlay grows and shrinks according to the size of the whole viewport. By default, it does not
add any scrolling behaviour, so it does not interfere with inner overflowing content like dropdowns or tooltips. If you
want your content to be scrolled, just add `overflow-y: auto` to the container that should be scrollable.

### Drag and drop

By dragging on the header the entire overlay can be dropped on either side of the screen, allowing it to be moved to the
left hand side. When opened, it will always be displayed on the right. If no header is defined the overlay cannot be
dragged.
