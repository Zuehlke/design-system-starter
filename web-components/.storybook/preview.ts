import 'element-internals-polyfill';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../dist/custom-elements.json';
import '../src/rootStyles/style.css';

customElements?.modules?.forEach((module) => {
  module?.declarations?.forEach(declaration => {
    Object.entries(declaration).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // @ts-ignore
        declaration[key] = value.filter((member) => !member.privacy?.includes('private'));
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
