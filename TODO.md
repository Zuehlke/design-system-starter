# TODOs

## web-components
* CSS vars that are not covered by Figma: [tokens-todo.css](web-components/src/rootStyles/tokens-todo.css)
* gradients get generated with `gradient-gradient`
* grid tokens. What should we do with that?
* [style.css](web-components/src/rootStyles/style.css) currently imports [global.css](web-components/src/internals/baseElement/global.css). This means global.css is duplicated. Once as a Constructed Stylesheet for all components and once by the outer application using our library.
  * Before, we had a style-component but this is trickier when trying to do server side rendering. Therefore, we switched to the stylesheet only, which means some duplication.
* Testing: message "multiple versions of lit loaded"

## tailwind-preset
* font settings (font-weight, font-size, line-height) are not handled yet
* border-width is not handled yet
* should gradients be a color in tailwind?

## web-components-react
* vite config
  * `TS2322: Type  Plugin_2  is not assignable to type  PluginOption`