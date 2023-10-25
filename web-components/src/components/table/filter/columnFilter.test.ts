import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { FilterFns, Header } from '@tanstack/table-core';
import { screen, within } from 'shadow-dom-testing-library';
import './columnFilter';
import '../../flyout/flyout.component';
import { DateRangeFilterMask, NumericFilterBand } from './customFilters';
import userEvent from '@testing-library/user-event';
import { endOfDay, format, isEqual, startOfDay } from 'date-fns';
import { RANGE_DATE_FORMAT, RANGE_DELIMITER } from '../../datepicker/datepicker.component';
import { DssMenuItem } from '../../../index';
import Flyout from '../../flyout/flyout.component';
import { waitFor } from '@testing-library/dom';
import { numericBandsToFlyoutFormState } from './columnFilter';
import { DEFAULT_DEBOUNCE } from '../../input/input.component';

describe('columnFilter', function () {
  function createMockHeader(filterFn: keyof FilterFns, uniqueValues?: Map<any, number>): Header<any, unknown> {
    let filterValue: unknown;
    return {
      column: {
        columnDef: {
          filterFn: filterFn,
        },
        getCanFilter() {
          return true;
        },
        getFilterValue(): unknown {
          return filterValue;
        },
        setFilterValue(newFilterValue: unknown): void {
          filterValue = newFilterValue;
        },
        getFacetedUniqueValues: () => uniqueValues,
      },
    } as Header<any, unknown>;
  }

  test('when column cannot be filtered, hides input', async () => {
    const mockHeader = {
      column: {
        columnDef: {},
        getCanFilter() {
          return false;
        },
      },
    } as Header<any, unknown>;
    await fixture(html`
      <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
    `);

    expect(screen.queryByShadowRole('textbox')).not.toBeInTheDocument();
  });

  test('when column can be filtered, shows input', async () => {
    const mockHeader = {
      column: {
        columnDef: {},
        getCanFilter() {
          return true;
        },
      },
    } as Header<any, unknown>;
    await fixture(html`
      <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
    `);

    expect(screen.queryByShadowRole('textbox')).toBeInTheDocument();
  });

  describe('numeric', () => {

    async function renderNumericFilter() {
      const mockHeader = createMockHeader('numeric');
      return await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `) as HTMLElementTagNameMap['dss-column-filter'];
    }

    test('when dsl parsing failed, shows error input', async () => {
      const element = await renderNumericFilter();

      expect(element.shadowRoot?.querySelector('dss-input')).not.toHaveClass('error');
      element.shadowRoot?.querySelector('dss-input')?.dispatchEvent(new CustomEvent('dss-input-debounced', { detail: 'wrong syntax' }));
      await elementUpdated(element);

      expect(element.shadowRoot?.querySelector('dss-input')).toHaveAttribute('errorState', 'error');
    });

    test('when user focuses on textbox, opens flyout to edit filter', async () => {
      const user = userEvent.setup();
      const element = await renderNumericFilter();
      const mainNumericFilterInput = screen.getAllByShadowRole('textbox')[0];

      await user.click(mainNumericFilterInput);
      await elementUpdated(element);

      const flyout = element.shadowRoot!.querySelector('dss-flyout')! as Flyout;
      expect(flyout).toHaveAttribute('aria-expanded');
      expect(screen.getAllByShadowRole('option')).toHaveLength(7);
      expect(within(screen.getByShadowRole('form')).getAllByShadowRole('textbox')).toHaveLength(2);
    });

    test('when disabled and user focuses on textbox, flyout is not opened', async () => {
      const user = userEvent.setup();
      const mockHeader = createMockHeader('numeric');
      const element = await fixture(html`
        <dss-column-filter .header=${mockHeader as any} .disabled=${true}></dss-column-filter>
      `) as HTMLElementTagNameMap['dss-column-filter'];
      const mainNumericFilterInput = screen.getAllByShadowRole('textbox')[0];

      await user.click(mainNumericFilterInput);
      await elementUpdated(element);

      const flyout = element.shadowRoot!.querySelector('dss-flyout')! as Flyout;
      expect(flyout).not.toHaveAttribute('aria-expanded');
    });

    test('when user sets a filter in the textbox, filters in the flyout update to reflect filter', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup();
      const element = await renderNumericFilter();
      const mainNumericFilterInput = screen.getAllByShadowRole('textbox')[0];

      await user.click(mainNumericFilterInput);
      await user.type(mainNumericFilterInput, '<10');
      await elementUpdated(element);
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE + 1000);

      const form = screen.getByShadowRole('form');
      await waitFor(() => expect(form.querySelector('dss-dropdown')!.value).toBe('lessThan'));
      await waitFor(() => expect(form.querySelectorAll('input')[1]).toHaveValue('10'));
      vi.useRealTimers();
    });

    test('when user sets a filter in the flyout, filter outside flyout reflects user selection', async () => {
      const element = await renderNumericFilter();

      // having elements within a form is not supported by shadow-dom-testing-library, triggers
      // SyntaxError: unknown pseudo-class selector ':is(:is(button, input)[type=submit]'
      // so we just trigger the handler manually to test that it reflects the form values to the main input
      // const user = userEvent.setup();
      // await user.type(screen.getByShadowRole('textbox', { name: 'Value' }), '15');
      // await user.click(screen.getByShadowRole('option', { name: DEFAULT_COLUMN_FILTER_TRANSLATIONS.numericTranslations!.greaterThan }));
      // await user.click(screen.getByShadowRole('button', { name: 'Ok' }));

      element.handleFormSubmit({ condition: 'greaterThan', value: '15' });
      await elementUpdated(element);

      await waitFor(() => expect(screen.getAllByShadowRole('textbox')[0]).toHaveValue('>15'));
    });

    describe('numericBandsToFlyoutState', () => {

      const lowerBound: NumericFilterBand = {
        lower: 0,
        not: Number.NaN,
        strictUpper: false,
        strictLower: false,
        complex: false,
      };

      const upperBound: NumericFilterBand = {
        upper: 0,
        not: Number.NaN,
        strictUpper: false,
        strictLower: false,
        complex: false,
      };

      const strictUpperBound: NumericFilterBand = {
        ...upperBound,
        strictUpper: true,
      };

      const strictLowerBound: NumericFilterBand = {
        ...lowerBound,
        strictLower: true,
      };

      const equals: NumericFilterBand = {
        lower: 0,
        upper: 0,
        strictLower: false,
        strictUpper: false,
        not: Number.NaN,
        complex: false,
      };

      const notEquals0: NumericFilterBand = {
        lower: undefined,
        upper: undefined,
        strictLower: false,
        strictUpper: false,
        not: 0,
        complex: false,
      };

      test.each([
        ['lower-bound', lowerBound, ['greaterThanOrEqualTo', 0]],
        ['strict lower-bound', strictLowerBound, ['greaterThan', 0]],
        ['upper-bound', upperBound, ['lessThanOrEqualTo', 0]],
        ['strict upper-bound', strictUpperBound, ['lessThan', 0]],
        ['equals', equals, ['equals', 0]],
        ['not equals', notEquals0, ['not', 0]],
      ])('when single %s non-complex band %o, returns %j', (_, band, expected) => {
        const flyoutState = numericBandsToFlyoutFormState([band as NumericFilterBand]);
        expect(flyoutState).toEqual(expected);
      });

      test('when multiple bands, returns userDefined state', () => {
        const flyoutState = numericBandsToFlyoutFormState([lowerBound, upperBound]);
        expect(flyoutState).toEqual(['complex', undefined]);
      });
    });
  });

  describe('dateRange', () => {
    test('when date filter, renders datepicker', async () => {
      const mockHeader = createMockHeader('dateRange');
      const element = await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      expect(element.shadowRoot?.querySelector('dss-datepicker')).toBeInTheDocument();
    });

    test('when changing date range, sets filter mask with correct dates', async () => {
      const startDate = new Date(2020, 0, 1);
      const endDate = new Date(2020, 7, 1);
      const mockHeader = createMockHeader('dateRange');
      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      const user = userEvent.setup();
      await user.type(screen.getByShadowRole('textbox'), format(startDate, RANGE_DATE_FORMAT) + RANGE_DELIMITER + format(endDate, RANGE_DATE_FORMAT));
      await user.tab();

      const filterMask = mockHeader.column.getFilterValue() as DateRangeFilterMask;
      expect(isEqual(filterMask.from, startOfDay(startDate))).toBe(true);
      expect(isEqual(filterMask.to, endOfDay(endDate))).toBe(true);
    });
  });

  describe('select', () => {
    test('when select, renders sorted unique values with empty option', async () => {
      const mockHeader = createMockHeader('select', new Map([['item', 1], ['anotherItem', 2]]));

      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      const options = screen.getAllByShadowRole('option').map((option) => (option as DssMenuItem).value);
      expect(options).toEqual([
        undefined,
        'anotherItem',
        'item',
      ]);
    });
  });

  describe('multiSelect', () => {
    test('when multiSelect, renders sorted unique values as selected options with additional "select all" option', async () => {
      const mockHeader = createMockHeader('multiSelect', new Map([['item', 1], ['anotherItem', 2]]));

      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      const options = screen
        .getAllByShadowRole('option', { selected: true })
        .map((option) => (option as DssMenuItem).value);
      expect(options).toEqual([
        'all',
        'anotherItem',
        'item',
      ]);
    });

    test('when unselecting "select all" option, unselects all elements', async () => {
      const mockHeader = createMockHeader('multiSelect', new Map([['item', 1], ['anotherItem', 2], ['yetAnotherItem', 3]]));

      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      await userEvent.setup().click(screen.getAllByShadowRole('option')[0]);

      expect(screen.queryAllByShadowRole('option', { selected: false })).toHaveLength(4);
    });

    test('when unselecting another option, shows "select all" as indeterminate', async () => {
      const mockHeader = createMockHeader('multiSelect', new Map([['first', 1], ['second', 2]]));

      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      await userEvent.setup().click(screen.getAllByShadowRole('option')[1]);

      expect(screen.getAllByShadowRole('checkbox')[0]).toHaveProperty('indeterminate', true);
    });

    test('when item without visible value given, renders given translation for empty', async () => {
      const mockHeader = createMockHeader('multiSelect', new Map([[' ', 1]]));

      await fixture(html`
        <dss-column-filter .header=${mockHeader as any}></dss-column-filter>
      `);

      expect(screen.queryByShadowLabelText('(Empty)')).toBeInTheDocument();
    });
  });
});
