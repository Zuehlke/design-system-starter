# Design System Starter

## Installation
To use this package install it via:
```bash
npm install design-systems-showcase
```

Additionally to set up the proper CSS variables, you need to import the provided `style.css` file in your project.
```css
@import "@zuhlke/design-system-components/style.css";
```

## Usage
To use all components, you can import the `index.js` file in your project:
```js
import '@zuhlke/design-system-components';
```

If you want to lazy load the components where you need them, you can import the individual components:
```js
import '@zuhlke/design-system-components/src/components/button/button.component';
```

## Development

### Initial setup
Check out the Git repository and run the following commands in the root directory to get started:
* `npm install`
* `npm run build --workspace web-components`
* `npm run storybook --workspace web-components`
