const StyleDictionary = require('style-dictionary');
const baseConfig = require('./config.json');
const pxToRem = require('./transformers/pxToRem.cjs');

StyleDictionary.registerTransform({
  type: `value`,
  transitive: true,
  name: `custom/pxToRem`,
  matcher: (token) => {
    return (token.unit === 'pixel' || token.type === 'dimension') && token.value !== 0;
  },
  transformer: (token, options) => {
    if (token.name.includes('px')) {
      return token.value.replace('rem', 'px');
    }
    return pxToRem(token.value, options);
  },
});

StyleDictionary.registerTransform({
  name: `custom/radius`,
  ...require('./transformers/webRadius.cjs'),
});

StyleDictionary.registerTransform({
  name: `custom/shadow`,
  ...require('./transformers/webShadows.cjs'),
});

StyleDictionary.registerTransform({
  name: `custom/font`,
  ...require('./transformers/webFont.cjs'),
});

StyleDictionary.registerTransform({
  name: `custom/gradient`,
  ...require('./transformers/webGradient.cjs'),
});

StyleDictionary.registerTransform({
  name: `custom/padding`,
  ...require('./transformers/webPadding.cjs'),
});

StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  matcher: token => {
    return token.unit === 'percent' && token.value !== 0;
  },
  transformer: token => {
    return `${token.value}%`;
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.transformGroup['css'].concat([
    'custom/pxToRem',
    'size/percent',
    'custom/radius',
    'custom/shadow',
    'custom/font',
    'custom/gradient',
    'custom/padding',
  ]),
});

StyleDictionary.registerFilter({
  name: 'validToken',
  matcher: require('./transformers/filterWeb.cjs'),
});

const StyleDictionaryExtended = StyleDictionary.extend(baseConfig);

StyleDictionaryExtended.buildAllPlatforms();
