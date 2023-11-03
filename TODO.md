# TODOs

## general
* link [Figma Plugin](https://github.com/lukasoppermann/design-tokens) in documentation

## web-components
* CSS vars that are not covered by Figma: [tokens-todo.css](web-components/src/rootStyles/tokens-todo.css)
* ~~grid tokens. What should we do with that?~~
* [style.css](web-components/src/rootStyles/style.css) currently imports [global.css](web-components/src/internals/baseElement/global.css). This means global.css is duplicated. Once as a Constructed Stylesheet for all components and once by the outer application using our library.
  * Before, we had a style-component but this is trickier when trying to do server side rendering. Therefore, we switched to the stylesheet only, which means some duplication.
* Testing: message "multiple versions of lit loaded"
* Check if we could use StyleDictionary actions to handle images/logos in a streamlined way
* Figma Variables (constraints) to css variables

## tailwind-preset
* font settings (font-weight, font-size, line-height) are not handled yet
  * Ensure tailwind shorthands like `text-sm` are working with our respective names like `text-main`
* border-width is not handled yet
* should gradients be a color in tailwind?
  * Maybe extend `backgroundImage`

## web-components-react
* vite config
  * `TS2322: Type  Plugin_2  is not assignable to type  PluginOption`

## next steps
* Setup Github action and deployment/publish
* Documentation for potential users of the library