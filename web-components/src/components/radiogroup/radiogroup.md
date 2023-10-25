## Interaction

The radiogroup groups together a set of radio buttons.

## Usage

This component is cosmetic, in that it does not add any functionality to the radio buttons.

### Required

If a required radio set is needed, use the `required` attribute on the radio buttons directly.
Setting `required` on the radio group will simply mark the label as required using a `*`.

### Error States

The radio group ensures that the `InputErrorState` passed to it, is forwarded to the radios.