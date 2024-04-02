const {
  dirname,
  join,
} = require('path');
const {
  mergeConfig,
} = require('vite');
const svg = require('vite-plugin-svgo');
const turbosnap = require('vite-plugin-turbosnap');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-links'), getAbsolutePath('@storybook/addon-essentials')],
  framework: {
    name: getAbsolutePath('@storybook/web-components-vite'),
    options: {},
  },
  async viteFinal(config, {configType}) {
    return mergeConfig(config, {
      plugins: [
        ...(configType === 'PRODUCTION' ? [turbosnap({rootDir: config.root ?? process.cwd()})] : []),
        svg({
          plugins: [{
            name: 'preset-default',
            params: {
              overrides: {
                convertColors: {
                  currentColor: true,
                },
                removeViewBox: false,
              },
            },
          }, {
            name: 'removeDimensions',
          }],
        }),
      ],
    });
  },
  docs: {
    autodocs: true,
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
