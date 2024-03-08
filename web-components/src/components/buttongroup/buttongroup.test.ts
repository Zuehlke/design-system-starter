import './buttongroup.component';
import '../toggleButton/toggleButton.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ButtonGroup from './buttongroup.component';
import { screen, within } from 'shadow-dom-testing-library';
import userEvent from '@testing-library/user-event';
import ToggleButton from '../toggleButton/toggleButton.component';

describe('Buttongroup', () => {
  test('when given a label, is selectable by it', async () => {
    await fixture(html`
      <dss-button-group label="Select">
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>
    `);

    expect(screen.getByShadowLabelText('Select')).toBeInTheDocument();
  });

  test('when setting required, shows asterisk', async () => {
    await fixture(html`
      <dss-button-group label="Required" ?required="${true}">
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>
    `);
    expect(screen.queryByShadowText('*')).toBeInTheDocument();
    expect(screen.queryByShadowText('Required')).toBeInTheDocument();
  });

  test('when specifying values, emits pressed button value into FormData', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" value="two">
          <dss-toggle-button value="one">One</dss-toggle-button>
          <dss-toggle-button value="two">Two</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    const formData = new FormData(formElement);
    expect(formData.get('selection')).toBe('two');
  });

  test('when pressing button, emits change event and sets value', async () => {
    const changeSpy = vi.fn();
    await fixture(html`
      <dss-button-group @change=${changeSpy}>
        <dss-toggle-button value="one">One</dss-toggle-button>
        <dss-toggle-button value="two">Two</dss-toggle-button>
      </dss-button-group>
    `);

    const userEvents = userEvent.setup();
    await userEvents.click(screen.getByShadowText('One'));

    expect(changeSpy).toHaveBeenCalledOnce();
    expect(changeSpy.mock.calls[0][0].target).toHaveProperty('value', 'one');
  });

  test('when required, sets validity to false when no button pressed', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" ?required="${true}">
          <dss-toggle-button value="one">One</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    expect(formElement).not.toBeValid();
  });

  test('when required, sets validity to true when button pressed', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-button-group name="selection" ?required="${true}" value="one">
          <dss-toggle-button value="one">One</dss-toggle-button>
        </dss-button-group>
      </form>
    `);

    expect(formElement).toBeValid();
  });

  test('when given a single button, does not set any attributes', async () => {
    await fixture(html`
      <dss-button-group>
        <dss-toggle-button>One</dss-toggle-button>
      </dss-button-group>`);

    const button = await screen.findByShadowRole('menuitemradio') as ToggleButton;
    expect(button.removeRadius).toBe('none');
  });

  test('when given two buttons, sets attributes', async () => {
    await fixture(html`
      <dss-button-group>
        <dss-toggle-button>One</dss-toggle-button>
        <dss-toggle-button>Two</dss-toggle-button>
      </dss-button-group>`);

    const buttons = await screen.findAllByShadowRole('menuitemradio') as ToggleButton[];

    expect(buttons[0].removeRadius).toBe('right');
    expect(buttons[1].removeRadius).toBe('left');
  });

  describe('focus/blur events', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('when focussing buttons, emits focus/blur events', async () => {
      const focusSpy = vi.fn();
      const blurSpy = vi.fn();
      await fixture(html`
        <dss-button-group @focus="${focusSpy}" @blur="${blurSpy}">
          <dss-toggle-button>One</dss-toggle-button>
          <dss-toggle-button>Two</dss-toggle-button>
        </dss-button-group>
      `);

      screen.getAllByShadowRole('button')[0].dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      vi.advanceTimersByTime(0);
      expect(focusSpy).toHaveBeenCalledOnce();
      expect(blurSpy).not.toHaveBeenCalled();

      screen.getAllByShadowRole('button')[0].dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      screen.getAllByShadowRole('button')[1].dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      vi.advanceTimersByTime(0);

      expect(focusSpy).toHaveBeenCalledOnce();
      expect(blurSpy).not.toHaveBeenCalled();

      screen.getAllByShadowRole('button')[1].dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      vi.advanceTimersByTime(0);

      expect(focusSpy).toHaveBeenCalledOnce();
      expect(blurSpy).toHaveBeenCalledOnce();
    });
  });

  describe('when there are three buttons with a value, but none is pressed', function () {
    const fixtureWithThreeButtonsWithoutValue = async () => await fixture(html`
      <dss-button-group>
        <dss-toggle-button value="1">One</dss-toggle-button>
        <dss-toggle-button value="2">Two</dss-toggle-button>
        <dss-toggle-button value="3">Three</dss-toggle-button>
      </dss-button-group>
    `) as HTMLElementTagNameMap['dss-button-group'];

    test('has no option pressed', async () => {
      await fixtureWithThreeButtonsWithoutValue();

      expect(screen.queryAllByRole('button', { pressed: true })).toHaveLength(0);
    });

    test('given a group of buttons, renders a group of buttons', async () => {
      await fixtureWithThreeButtonsWithoutValue();

      expect(screen.queryAllByShadowRole('button')).toHaveLength(3);
      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.getByText('Three')).toBeInTheDocument();
    });

    test('given three buttons, sets attributes', async () => {
      await fixtureWithThreeButtonsWithoutValue();

      const buttons = screen.queryAllByShadowRole('menuitemradio') as ToggleButton[];

      expect(buttons[0].removeRadius).toBe('right');
      expect(buttons[1].removeRadius).toBe('all');
      expect(buttons[2].removeRadius).toBe('left');
    });
  });

  describe('when there are two buttons with a value and the second button is pressed', function () {
    const fixtureWithTwoButtonsWithValueAndSecondButtonPressed = async () => {
      return await fixture(html`
        <dss-button-group value="2">
          <dss-toggle-button value="1">One</dss-toggle-button>
          <dss-toggle-button value="2">Two</dss-toggle-button>
        </dss-button-group>`) as HTMLElementTagNameMap['dss-button-group'];
    };

    test('pre-presses a button', async () => {
      await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      expect(screen.queryByShadowRole('button', { pressed: true })).toBeInTheDocument();
    });

    test('when button clicked, attribute pressed is set on button', async () => {
      const element: ButtonGroup = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();
      await elementUpdated(element);

      expect(within(screen.getByText('One')).queryByShadowRole('button', { pressed: true })).not.toBeInTheDocument();
      expect(within(screen.getByText('Two')).queryByShadowRole('button', { pressed: true })).toBeInTheDocument();

      const toggleButtons = await screen.findAllByShadowRole('button');
      toggleButtons[0].click();

      await elementUpdated(element);

      expect(within(screen.getByText('One')).getByShadowRole('button', { pressed: true })).toBeInTheDocument();
      expect(within(screen.getByText('Two')).getByShadowRole('button', { pressed: false })).toBeInTheDocument();
    });

    test('when user clicks on something inside a button, presses the button', async () => {
      const element: ButtonGroup = await fixture(html`
        <dss-button-group>
          <dss-toggle-button value="text-option">One</dss-toggle-button>
          <dss-toggle-button value="icon-option">
            <dss-icon icon="add-sm" role="img">Two</dss-icon>
          </dss-toggle-button>
        </dss-button-group>`);

      screen.getByRole('img').click();
      await elementUpdated(element);

      expect(element.value).toBe('icon-option');
    });

    test('when changing the value, presses button and returns new button\'s value', async () => {
      const element = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      element.value = '1';
      await elementUpdated(element);

      expect(within(screen.getByText('One')).queryByShadowRole('button', { pressed: true })).toBeInTheDocument();
      expect(within(screen.getByText('Two')).queryByShadowRole('button', { pressed: false })).toBeInTheDocument();

      expect(element.value).toBe('1');
    });

    test('when changing the value twice, has only one pressed option', async () => {
      const element = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      element.value = '1';
      await elementUpdated(element);

      expect(within(screen.getByText('One')).getByShadowRole('button', { pressed: true })).toBeInTheDocument();
      expect(within(screen.getByText('Two')).getByShadowRole('button', { pressed: false })).toBeInTheDocument();

      element.value = '2';
      await elementUpdated(element);
      expect(within(screen.getByText('Two')).getByShadowRole('button', { pressed: true })).toBeInTheDocument();
      expect(within(screen.getByText('One')).getByShadowRole('button', { pressed: false })).toBeInTheDocument();
    });

    test('when changing to unknown value, presses no button and returns unknown string', async () => {
      const element = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      element.value = 'unknown';
      await elementUpdated(element);

      expect(screen.queryAllByShadowRole('button', { pressed: undefined })).toHaveLength(2);
      expect(screen.queryAllByShadowRole('button', { pressed: true })).toHaveLength(0);

      expect(element.value).toBe('unknown');
    });

    test('when setting the value undefined, presses no button and returns undefined', async () => {
      const element = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      element.value = undefined;
      await elementUpdated(element);

      expect(screen.queryAllByShadowRole('button', { pressed: undefined })).toHaveLength(2);
      expect(screen.queryAllByShadowRole('button', { pressed: true })).toHaveLength(0);
      expect(element.value).toBe(undefined);
    });

    test('when setting empty string as value, presses no button and returns empty string', async () => {
      const element = await fixtureWithTwoButtonsWithValueAndSecondButtonPressed();

      element.value = '';
      await elementUpdated(element);

      expect(screen.queryAllByShadowRole('button', { pressed: undefined })).toHaveLength(2);
      expect(screen.queryAllByShadowRole('button', { pressed: true })).toHaveLength(0);
      expect(element.value).toBe('');
    });

    describe('message', () => {
      test('when passing message, shows message', async () => {
        await fixture(html`
          <dss-button-group message='Test Message'></dss-button-group>`);

        expect(screen.getByShadowText('Test Message')).toBeInTheDocument();
      });

      test('when setting hideMessage, hides message', async () => {
        await fixture(html`
          <dss-button-group message='Test Message' hideMessage></dss-button-group>`);

        expect(screen.queryByShadowText('Test Message')).not.toBeInTheDocument();
      });
    });
  });
});
