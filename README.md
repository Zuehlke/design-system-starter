# Design System Starter
![verify and publish workflow](https://github.com/Zuehlke/design-system-starter/actions/workflows/verify-and-publish.yml/badge.svg)

The **Design System Starter** provides a solid foundation for creating your own custom design system. This starter kit 
aims to streamline the process of building consistent and visually appealing web components for your design system.

## Key Features

### 🚀 Design Token Integration
Use design tokens as basis of all components. Provided in this repository you can see our design tokens that have been
exported from Figma with [this plugin](https://www.figma.com/community/plugin/888356646278934516/design-tokens).
Keep your design system consistent across your tools, devices and frameworks.

### ♻️ Web Components
All components in this starter kit are built as reusable web components. Build them once, use them everywhere in any 
framework. With the use of Shadow DOM these components look the same wherever you use them without any side effects on 
your surrounding application.

### 📖 Storybook Integration
We use Storybook to showcase all components in isolation. This is a great starting point for new users of your design
system to discover and play around with the existing components and their API.

## Getting started

1. Installation:
   * Clone this repository: `git clone https://github.com/Zuehlke/design-system-starter.git`
   * Install dependencies: `npm install --workspaces`
   * Build the project: `npm run build --workspace web-components`

2. Usage:
   * Run: `npm run storybook --workspace web-components` to boot up a local storybook dev server
   * Explore the design tokens in the `web-components/tokens` directory

3. Contributing:
   * Contributions are welcome! Fork the repo and submit pull requests.

## Further Documentation

If you're interested in more detailed aspects of the project, head over to our `docs` directory:

* [Design Tokens](docs/design-tokens.md)
* [Font Handling](docs/font-handling.md)
* [Shadow DOM](docs/shadow-dom.md)

