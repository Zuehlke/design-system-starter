import './datepicker.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { afterEach, beforeEach, describe, expect, SpyInstance, test, vi } from 'vitest';
import DatePicker from './datepicker.component';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';
import userEvent from '@testing-library/user-event';

describe('Datepicker', () => {
  describe('rendering', () => {
    test('when initial date given, renders datepicker accordingly', async () => {
      const initialValue = '2020-06-06';
      await fixture(html`
        <dss-datepicker label="date-input" value=${initialValue}></dss-datepicker>
      `);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue(initialValue);
    });

    test('when value changed, re-renders the datepicker', async () => {
      const initialValue = '2020-06-06';
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input" value=${initialValue}></dss-datepicker>
      `);

      const newValue = '2022-11-11';
      element.value = newValue;
      await elementUpdated(element);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue(newValue);
      expect(screen.getByShadowText('11')).toHaveClass('selected');
    });

    test('when value cleared, clears the datepicker', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input" value=${'2020-06-06'}></dss-datepicker>
      `);

      const newValue = '';
      element.value = newValue;
      await elementUpdated(element);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue(newValue);
      expect(element.shadowRoot!.querySelector('.selected')).not.toBeInTheDocument();
    });

    test('when input value cleared, clears the datepicker', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input" value=${'2020-06-06'}></dss-datepicker>
      `);

      const newValue = '';
      (screen.getByShadowLabelText('date-input') as HTMLInputElement).value = newValue;
      fireEvent.change(screen.getByShadowLabelText('date-input'));
      await elementUpdated(element);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue(newValue);
      expect(element.shadowRoot!.querySelector('.selected')).not.toBeInTheDocument();
    });

    test('when required flag set, passes it to native input', async () => {
      await fixture(html`
        <dss-datepicker label="date-input" required="${true}"></dss-datepicker>
      `);

      expect(screen.getByShadowLabelText('date-input')).toBeRequired();
    });
  });

  describe('date selection', () => {
    test('when selecting date, emits change event', async () => {
      const wrapperListenerSpy = vi.fn();
      const datepickerListenerSpy = vi.fn();

      const element: DatePicker = await fixture(html`
        <div @change=${wrapperListenerSpy}>
          <dss-datepicker @change=${datepickerListenerSpy}></dss-datepicker>
        </div>
      `);

      const datePickerWrapper = element.querySelector('dss-datepicker')!;

      const datePicker = datePickerWrapper.shadowRoot!.querySelector('.easepick-wrapper')!;
      const firstDate = datePicker.shadowRoot!.querySelector('.day.unit:not(.selected)')! as HTMLElement;
      expect(firstDate).not.toBeNull();

      const userEvents = userEvent.setup();
      await userEvents.click(firstDate);

      expect(datepickerListenerSpy).toHaveBeenCalledOnce();
      expect(wrapperListenerSpy).toHaveBeenCalledOnce();
    });

    test('when selecting date, sets the value', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input" value="2022-11-11"></dss-datepicker>
      `);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const firstDate = datePickerWrapper.shadowRoot!.querySelector('.day.unit:not(.selected)')! as HTMLElement;
      expect(firstDate).not.toBeNull();

      firstDate.click();

      expect(element).toHaveValue('2022-11-01');
    });

    test('when typing date via keyboard, should update value', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input"></dss-datepicker>
      `);

      const userEvents = userEvent.setup();
      await userEvents.type(screen.getByShadowLabelText('date-input'), '2022-11-25');
      await userEvents.tab();

      expect(element).toHaveValue('2022-11-25');
    });

    test('returns the selected date to FormData', async () => {
      const element: HTMLFormElement = await fixture(html`
        <form>
          <dss-datepicker name="date" value="2022-11-02"></dss-datepicker>
        </form>
      `);

      const data = new FormData(element);
      expect(data.get('date')).toBe('2022-11-02');
    });
  });

  describe('locale', () => {
    let navigatorSpy: SpyInstance;

    beforeEach(() => {
      navigatorSpy = vi.spyOn(window.navigator, 'language', 'get');
      navigatorSpy.mockReturnValue('en-US');
    });

    afterEach(() => {
      navigatorSpy.mockRestore();
    });

    const englishDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const germanDayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    function assertDayNames(actual: NodeListOf<Element>, expected: string[]) {
      expected.forEach((expectedDayName, index) => expect(actual[index].textContent).toBe(expectedDayName));
    }

    test('sets the default locale on the date picker to german', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>
      `);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const dayNames: NodeListOf<Element> = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNames, germanDayNames);
    });

    test('sets the locale on the date picker to english US', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker locale="en-US"></dss-datepicker>
      `);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const dayNames = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNames, englishDayNames);
    });

    test('updates the locale on the date picker', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker></dss-datepicker>
      `);

      const datePickerWrapper = element.shadowRoot!.querySelector('.easepick-wrapper')!;
      const dayNamesBeforeUpdate = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNamesBeforeUpdate, germanDayNames);

      element.locale = 'en-US';
      await elementUpdated(element);

      const dayNamesAfterUpdate = datePickerWrapper.shadowRoot!.querySelectorAll('.dayname');

      assertDayNames(dayNamesAfterUpdate, englishDayNames);
    });
  });

  describe('when range set', () => {
    test('parses initial date as range', async () => {
      await fixture(html`
        <dss-datepicker label="date-input" .range="${true}" value="01.01.2023 - 10.01.2023"></dss-datepicker>
      `);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue('01.01.2023 - 10.01.2023');
    });

    test('adapts to value change after initialisation', async () => {
      const element: DatePicker = await fixture(html`
        <dss-datepicker label="date-input" .range="${true}"></dss-datepicker>
      `);

      element.value = '03.04.2023 - 05.04.2023';
      await elementUpdated(element);

      expect(screen.getByShadowLabelText('date-input')).toHaveValue('03.04.2023 - 05.04.2023');
    });
  });
});
