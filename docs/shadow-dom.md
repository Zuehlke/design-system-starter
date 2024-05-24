# Shadow DOM

The shadow DOM allows us to have styles that are not changed by and do not change the surrounding application. A strong
boundary like that also comes with a few hurdles.

### Don't turn Shadow DOM off

When you search for shadow DOM related issues you'll often find people arguing just turning it off. Most of the time
there are proper solutions which you can also find in this repository. The isolation that shadow DOM is providing is
crucial for a design system and should be used.

As with everything though, there are probably reasonable exceptions to this. But as a general rule shadow DOM should not
be turned off.

### Inheriting Styles

While the shadow DOM generally prevents styles from piercing through, there are specific exceptions mentioned in the
[spec](https://www.w3.org/TR/css-scoping-1/#inheritance). Most notably:
- CSS custom properties
- color
- font-*
- and many others

Check out this [list](https://gist.github.com/dcneiner/1137601) with inherited CSS.

### Use `<slot>`

Slotting elements is a very powerful concept which will help you down the line creating reusable components able to
be used in various situations.

Especially elements like `<input>` allow for so many attributes and event handlers that, over time, have to all be
passed through your component. Those are much better kept outside and passed into a slot.

### Form elements in Shadow DOM

When you wrap form elements inside the Shadow DOM, outside forms cannot see them anymore. So either you have to make
sure you pass them via a slot, which will keep the actual form element outside the Shadow DOM, or you have to use
`ElementInternals` for the form to recognize your custom element as a form element. You can learn more about this in
this [blog post](https://software-engineering-corner.zuehlke.com/finally-custom-form-elements-that-dont-suck).

### `::slotted` selector

The `::slotted` selector is very limited for performance reasons. If you need more complex selectors inside your slot we
recommend using helping CSS that gets loaded into the 
[global.css](../web-components/src/internals/baseElement/global.css). You can see a good example with the
[input.lightDOM.css](../web-components/src/components/input/input.lightDOM.css). This way those styles are available in 
all components and can target the so-called `Light DOM` where slotted elements live in.

### Work with Custom Events

Use custom events to allow communication between components and application. This way, your components are clear,
concise and typesafe. Preventing implicit and unclear behaviour.

### 