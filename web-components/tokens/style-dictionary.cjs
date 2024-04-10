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
  name: `custom/border`,
  ...require('./transformers/webBorder.cjs'),
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

StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: function(dictionary, config) {
    const rootTokens = [];
    const themeTokens = [];

    /* build structure of theme array */
    this.theme.themes.forEach(element => {themeTokens[element] = [];});

    /* import all not theming variables */
    dictionary.allProperties
      .filter((element) => !this.theme.themes.includes(element.attributes.type))
      .forEach((element) => {
        rootTokens.push(`--${element.name}: ${element.value};`);
    });
    /* import all basic theme variables */
    dictionary.allProperties
      .filter((element) => this.theme.basic == element.attributes.type)
      .forEach((element) => {
        rootTokens.push(`--${element.name.replace(this.theme.basic+"-","")}: ${element.value};`);  
    });
    /* import all themes and not basic theme variables */
    dictionary.allProperties
      .filter((element) => this.theme.themes.includes(element.attributes.type)
      ).forEach((element) => {        
        this.theme.themes
          .filter(theme => element.name.includes(theme))
          .forEach(theme => {
            themeTokens[element.attributes.type].push(`--${element.name.replace(theme+"-","")}: ${element.value};`);  
        });
    });

    return `
:root { 
  ${rootTokens.join('\n')}
}
${this.theme.themes.map(element => `.${element}{
  ${themeTokens[element].map(prop => prop).join('\n')}
}`).join('\n')}`;
  }
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
    'custom/border',
  ]),
});

StyleDictionary.registerFilter({
  name: 'validToken',
  matcher: require('./transformers/filterWeb.cjs'),
});

const StyleDictionaryExtended = StyleDictionary.extend(baseConfig);

StyleDictionaryExtended.buildAllPlatforms();
