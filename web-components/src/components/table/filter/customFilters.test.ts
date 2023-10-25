import { describe, expect, test } from 'vitest';
import { dateRange, multiSelect, numeric, NumericFilterMask, select } from './customFilters';
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';

describe('customFilters', () => {
  describe('numeric', () => {
    test.each([
      [-1, false],
      [0, true],
      [1, false],
    ])('when "=0" boundaries set, includes %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: 0,
          upper: 0,
          strictLower: false,
          strictUpper: false,
          not: Number.NaN,
          complex: false,
        }],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, true],
      [0, false],
      [1, true],
    ])('when "<>0" boundaries set, includes %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: undefined,
          upper: undefined,
          strictLower: false,
          strictUpper: false,
          not: 0,
          complex: false,
        }],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, true],
      [1, true],
      [999, true],
      [1000, true],
      [1001, false],
    ])('when strict boundaries not set, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: 0,
          upper: 1_000,
          strictLower: false,
          strictUpper: false,
          not: Number.NaN,
          complex: false,
        }],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [999, true],
      [1000, false],
      [1001, false],
    ])('when strict boundaries set, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: 0,
          upper: 1_000,
          strictLower: true,
          strictUpper: true,
          not: Number.NaN,
          complex: false,
        }],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [299, true],
      [300, true],
      [301, true],
      [499, true],
      [500, false],
      [501, false],
    ])('when strict boundaries not set and multiple bands defined, includes edge value %i correctly ', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [
          {
            lower: 0,
            upper: 300,
            strictLower: true,
            strictUpper: false,
            not: Number.NaN,
            complex: false,
          },
          {
            lower: 300,
            upper: 500,
            strictLower: false,
            strictUpper: true,
            not: Number.NaN,
            complex: false,
          },
        ],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [299, true],
      [300, false],
      [301, true],
      [499, true],
      [500, false],
      [501, false],
    ])('when strict boundaries set and multiple bands defined, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [
          {
            lower: 0,
            upper: 300,
            strictLower: true,
            strictUpper: true,
            not: Number.NaN,
            complex: true,
          },
          {
            lower: 300,
            upper: 500,
            strictLower: true,
            strictUpper: true,
            not: Number.NaN,
            complex: true,
          },
        ],
      };

      const passedFilter = numeric({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });
  });

  describe('dateRange', () => {
    test('when given invalid date, includes row in filter', () => {
      const actual = dateRange(
        { getValue: () => new Date('invalid') } as any,
        '',
        { from: new Date(), to: new Date() },
        () => {
        },
      );

      expect(actual).toEqual(true);
    });

    test('when date is inside range, includes row in filter', () => {
      const actual = dateRange(
        { getValue: () => new Date() } as any,
        '',
        { from: subDays(new Date(), 1), to: addDays(new Date(), 1) },
        () => {
        },
      );

      expect(actual).toEqual(true);
    });

    test('when date is outside range, excludes row in filter', () => {
      const actual = dateRange(
        { getValue: () => addDays(new Date(), 1) } as any,
        '',
        { from: startOfDay(new Date()), to: endOfDay(new Date()) },
        () => {
        },
      );

      expect(actual).toEqual(false);
    });

    test('when date is equal to start date, excludes row in filter', () => {
      const startDate = startOfDay(new Date());
      const actual = dateRange(
        { getValue: () => startDate } as any,
        '',
        { from: startDate, to: endOfDay(new Date()) },
        () => {
        },
      );

      expect(actual).toEqual(false);
    });

    test('when date is equal to end date, excludes row in filter', () => {
      const endDate = endOfDay(new Date());
      const actual = dateRange(
        { getValue: () => endDate } as any,
        '',
        { from: startOfDay(new Date()), to: endDate },
        () => {
        },
      );

      expect(actual).toEqual(false);
    });
  });

  describe('select', () => {
    test('when value is equal, includes row in filter', () => {
      const actual = select(
        { getValue: () => 'testString' } as any,
        '',
        'testString',
        () => {
        },
      );

      expect(actual).toBe(true);
    });

    test('when value is not equal, excludes row from filter', () => {
      const actual = select(
        { getValue: () => 'testString' } as any,
        '',
        'test',
        () => {
        },
      );

      expect(actual).toBe(false);
    });
  });
  describe('multiSelect', () => {
    test('when selected values includes cell value, includes row in filter', () => {
      const actual = multiSelect(
        { getValue: () => 'test' } as any,
        '',
        ['nomatch', 'test'],
        () => {
        },
      );

      expect(actual).toBe(true);
    });

    test('when no selected values, includes no row in filter', () => {
      const actual = multiSelect(
        { getValue: () => 'test' } as any,
        '',
        [],
        () => {
        },
      );

      expect(actual).toBe(false);
    });
  });
});
