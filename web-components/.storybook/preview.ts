import 'element-internals-polyfill';
import { setCustomElementsManifest } from '@storybook/web-components';
import { withThemeByClassName } from '@storybook/addon-themes';
import customElements from '../dist/custom-elements.json';
import designTokens from '../src/rootStyles/design-tokens.json';
import '../src/rootStyles/style.css';

customElements?.modules?.forEach((module) => {
  module?.declarations?.forEach((declaration) => {
    Object.keys(declaration).forEach((key) => {
      if (Array.isArray(declaration[key])) {
        declaration[key] = declaration[key].filter(
          (member) => !member.privacy?.includes('private'),
        );
      }
    });
  });
});

setCustomElementsManifest(customElements);

export const parameters = {
  backgrounds: {
    disable: true,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Intro', 'Design Guidelines', 'Design Tokens', '*'],
    },
  },
};

const themes = Object.keys(designTokens['semantic-tokens']);
const themesObject = Object.fromEntries(themes.map((theme) => [theme, theme]));

export const decorators = [
  withThemeByClassName({
    themes: themesObject,
    defaultTheme: themes[0],
  }),
];

export const tags = ['autodocs'];
