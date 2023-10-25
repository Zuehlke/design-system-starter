import { describe, expect, test } from 'vitest';
import { parseDSL } from './dslParser';
import { NumericFilterMask } from './customFilters';

describe('dslParser', () => {
  test('parses single expression with strict boundaries to numeric filter mask', () => {
    const numericFilterMask = parseDSL('<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        upper: 9,
        strictLower: true,
        strictUpper: true,
        not: Number.NaN,
        complex: false,
      }],
    });
  });

  test('parses single expression without strict boundaries to numeric filter mask', () => {
    const numericFilterMask = parseDSL('>=0');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        strictLower: false,
        strictUpper: true,
        not: Number.NaN,
        complex: false,
      }],
    });
  });

  test('parses equals expression to numeric filter mask', () => {
    const numericFilterMask = parseDSL('=0');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        upper: 0,
        strictLower: false,
        strictUpper: false,
        not: Number.NaN,
        complex: false,
      }],
    });
  });

  test('parses not equals expression to numeric filter mask', () => {
    const numericFilterMask = parseDSL('<>0');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: undefined,
        upper: undefined,
        strictLower: true,
        strictUpper: true,
        not: 0,
        complex: false,
      }],
    });
  });

  test('parses multiple expression with "and"', () => {
    const numericFilterMask = parseDSL('>=0,<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        upper: 9,
        strictLower: false,
        strictUpper: true,
        not: Number.NaN,
        complex: true,
      }],
    });
  });

  test('parses multiple expression with "<>" and "and"', () => {
    const numericFilterMask = parseDSL('<>10,>0');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        upper: undefined,
        strictLower: true,
        strictUpper: true,
        not: 10,
        complex: true,
      }],
    });
  });

  test('parses multiple expression with "or"', () => {
    const numericFilterMask = parseDSL('>=0;<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [
        {
          lower: 0,
          strictLower: false,
          strictUpper: true,
          not: Number.NaN,
          complex: false,
        },
        {
          upper: 9,
          strictLower: true,
          strictUpper: true,
          not: Number.NaN,
          complex: false,
        },
      ],
    });
  });

  test('parses multiple expression with "or" and "and"', () => {
    const numericFilterMask = parseDSL('>=0,<>5;<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [
        {
          lower: 0,
          strictLower: false,
          strictUpper: true,
          not: 5,
          complex: true,
        },
        {
          upper: 9,
          strictLower: true,
          strictUpper: true,
          not: Number.NaN,
          complex: false,
        },
      ],
    });
  });

  test('throws error when invalid syntax', () => {
    expect(() => parseDSL('<')).toThrowError('Invalid input');
  });
});
