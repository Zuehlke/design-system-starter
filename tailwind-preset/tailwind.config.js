const tokens = require('@zuhlke/design-system-components/design-tokens.cjs');

function transformTokenToKeyValuePair(token, removeFromName) {
  const name = removeFromName
    ? token.name.replace(removeFromName, '')
    : token.name;
  return {[name]: `var(--${token.name})`};
}

function transformLeafsToKeyValuePairs(object, removeFromName) {
  if (object.value) {
    return transformTokenToKeyValuePair(object, removeFromName);
  }
  return Object.values(object).reduce((acc, token) => {
    const tokens = transformLeafsToKeyValuePairs(token, removeFromName);
    return {
      ...acc,
      ...tokens,
    };
  }, {});
}

function transformToKeyValuePairsByType(object, type, removeFromName) {
  return Object.values(object)
    .filter(token => token.type === type)
    .reduce((acc, token) => {
      return {
        ...acc,
        ...transformTokenToKeyValuePair(token, removeFromName),
      };
    }, {});
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    spacing: {
      ...transformLeafsToKeyValuePairs(tokens.size, 'size-'),
    },
    colors: {
      ...transformLeafsToKeyValuePairs(tokens.color, 'color-'),
    },
    backgroundImage: {
      ...transformLeafsToKeyValuePairs(tokens.gradient, 'gradient-'),
    },
    boxShadow: {
      ...transformToKeyValuePairsByType(tokens.effect, 'custom-shadow', 'effect-shadow-'),
    },
    borderRadius: {
      ...transformLeafsToKeyValuePairs(tokens.radius, 'radius-'),
    },
    borderWidth: {
      ...transformLeafsToKeyValuePairs(tokens.border, 'border-'),
    },
    zIndex: {
      ...transformLeafsToKeyValuePairs(tokens['z-index'], 'z-index-'),
    },
    extend: {},
  },
  plugins: [],
};
