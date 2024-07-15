const PATHS = {
  themes: 'semantic-tokens',
  viewPorts: 'constraints',
};

// TODO: extract the break points from figma
const MEDIA_QUERIES = {
  desktop: '@media (min-width: 481px)',
  mobile: '@media (max-width: 480px)',
};

function extractThemesFrom(dictionary) {
  const themesObject = dictionary.properties[PATHS.themes];

  return Object.keys(themesObject);
}

function extractViewPortsFrom(dictionary) {
  const viewPortsObject = dictionary.properties[PATHS.viewPorts];

  return Object.keys(viewPortsObject);
}

function toCssVariable(property, { availableCategories = [] } = {}) {
  const category =
    availableCategories.find(
      (category) => category === property.attributes.type
    ) ?? 'default';

  let name = property.name;
  if (category !== 'default') {
    name = property.name.replace(`${category}-`, '');
    Object.values(PATHS).forEach(
      (path) => (name = name.replace(`${path}-`, ''))
    );
  }

  const value = property.value;

  return { name, value, category };
}

class CssVariables {
  #variables = { default: [] };

  constructor(categories) {
    categories.forEach((category) => (this.#variables[category] = []));
  }

  add({ category, name, value }) {
    this.#variables[category]?.push(`--${name}: ${value};`);
  }

  getFormatted(
    category,
    { cssSelector = `.${category}`, mediaQuery = null } = {}
  ) {
    const categoryVariables = this.#variables[category].join('\n');

    let result = `${cssSelector} {\n${categoryVariables}\n}`;
    if (mediaQuery) result = `${mediaQuery} {\n${result}\n}`;

    return result;
  }
}

module.exports = {
  formatter: function ({ dictionary }) {
    const themes = extractThemesFrom(dictionary);
    const viewPorts = extractViewPortsFrom(dictionary);
    const categories = [...themes, ...viewPorts];

    const cssVariables = new CssVariables(categories);

    dictionary.allProperties
      .map((property) =>
        toCssVariable(property, { availableCategories: categories })
      )
      .forEach((cssVariable) => cssVariables.add(cssVariable));

    return [
      cssVariables.getFormatted('default', { cssSelector: ':root' }),
      ...themes.map((theme) =>
        cssVariables.getFormatted(theme, { cssSelector: `.${theme}` }),
      ),
      ...viewPorts.map((viewport) =>
        cssVariables.getFormatted(viewport, {
          mediaQuery: MEDIA_QUERIES[viewport],
          cssSelector: ':root',
        }),
      ),
    ].join('\n');
  },
};
