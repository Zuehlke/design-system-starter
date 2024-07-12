# Font Handling

Providing fonts is often a necessary feature for a component library but tricky to achieve in an optimal way.

In here we are using a publicly available font from fontsource. If you have a local font make sure to do the following:
- Place the font in the [public](../web-components/public) directory
  - This will lead to the font being published in the root of the npm package
- Reference the font without any path information in the [style.css](../web-components/src/rootStyles/style.css)
  - e.g. `src: url(my-custom-font.woff2) format('woff2-variations');`
  - This will prevent `vite` from resolving and inlining the font into your css

This way the bundler of the using application of the component library will have control over how the font gets 
loaded/bundled. Which should lead to the most efficient way of loading the font.
