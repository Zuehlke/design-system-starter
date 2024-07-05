const SHORTEN_NAMES = ["semantic-tokens", "constraints"];

function extractThemesFrom(dictionary) {
  const semanticTokens = dictionary.properties["semantic-tokens"];

  return Object.keys(semanticTokens);
}

function toCssVariable(property, { availableThemes = [] } = {}) {
  const theme =
    availableThemes.find((theme) => theme === property.attributes.type) ??
    "default";

  let name = property.name;
  if (theme !== "default") name = name.replace(`${theme}-`, "");
  SHORTEN_NAMES.forEach(
    (nameToShorten) => (name = name.replace(`${nameToShorten}-`, ""))
  );

  return { name, value: property.value, theme };
}

class CssVariables {
  #variables = { default: [] };

  constructor(themes) {
    themes.forEach((theme) => (this.#variables[theme] = []));
  }

  add({ theme, name, value }) {
    this.#variables[theme]?.push(`--${name}: ${value};`);
  }

  getFormatted(theme, { cssSelector = `.${theme}` } = {}) {
    const formattedVariables = this.#variables[theme].join("\n");

    return `${cssSelector} {\n${formattedVariables}\n}`;
  }
}

module.exports = {
  formatter: function ({ dictionary }) {
    const themes = extractThemesFrom(dictionary);
    const cssVariables = new CssVariables(themes);

    dictionary.allProperties
      .map((property) => toCssVariable(property, { availableThemes: themes }))
      .forEach((cssVariable) => cssVariables.add(cssVariable));

    return (
      cssVariables.getFormatted("default", { cssSelector: ":root" }) +
      themes.map((theme) => cssVariables.getFormatted(theme)).join("\n")
    );
  },
};
