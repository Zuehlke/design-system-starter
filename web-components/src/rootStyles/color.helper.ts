import tokens from './design-tokens.json';

type ColorTokens =
  & typeof tokens['color']['brand']
  & typeof tokens['color']['universal'];
type Token = ColorTokens[keyof ColorTokens];

export interface TokenAttributes {
  item: string;
  subitem?: string;
}

function parseLastPartAsNumber(nameParts: string[]): number {
  return Number(nameParts[nameParts.length - 1]);
}

function getIntensity(name: string): number {
  const splitName = name.split('-');
  const parsedGradient = parseLastPartAsNumber(splitName);
  if (!isNaN(parsedGradient)) {
    return parsedGradient;
  }
  return 100;
}

function getNameWithoutIntensity(name: string): string {
  const splitName = name.split('-');
  if (!isNaN(parseLastPartAsNumber(splitName))) {
    return splitName.slice(0, -1).join('-');
  }
  return name;
}

function getItemName(attributes: TokenAttributes): string {
  return attributes.subitem ?? attributes.item;
}

function sortByDescendingIntensity(token1: Token, token2: Token): number {
  return getIntensity(token2.name) - getIntensity(token1.name);
}

export function groupColors(tokenItems: ColorTokens): Record<string, Record<string, string>> {
  return Object.entries(tokenItems)
    .map(([, token]) => token as Token)
    .sort(sortByDescendingIntensity)
    .reduce((acc, token) => {
      const nameWithoutIntensity = getNameWithoutIntensity(token.name);
      if (acc[nameWithoutIntensity] === undefined) {
        acc[nameWithoutIntensity] = {};
      }
      acc[nameWithoutIntensity][getItemName(token.attributes)] = token.value;
      return acc;
    }, {} as any);
}