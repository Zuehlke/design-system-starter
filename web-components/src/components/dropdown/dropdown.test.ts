import './dropdown.component';
import '../icon/icon.component';
import '../input/input.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import { describe, expect, SpyInstance, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import Dropdown from './dropdown.component';
import { fireEvent } from '@testing-library/dom';
import { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import userEvent from '@testing-library/user-event';

describe('Dropdown', () => {
  test('when setting required, passes required flag to native input', async () => {
    await fixture(html`
      <dss-dropdown ?required="${true}"></dss-dropdown>`);

    expect(screen.getByShadowRole('textbox')).toHaveAttribute('required');
  });

  test('when passing message, shows message', async () => {
    await fixture(html`
      <dss-dropdown message="Test Message"></dss-dropdown>`);

    expect(screen.getByShadowText('Test Message')).toBeInTheDocument();
  });

  test('when setting hideMessage, hides message', async () => {
    await fixture(html`
      <dss-dropdown .hideMessage="${true}" message="Test Message"></dss-dropdown>`);

    expect(screen.queryByShadowText('Test Message')).not.toBeInTheDocument();
  });

  describe('with a menu item', () => {
    const text = 'MenuItem';
    let changeSpy: SpyInstance;

    async function fixtureWithOneMenuItem() {
      changeSpy = vi.fn();
      return await fixture(html`
        <dss-dropdown @change="${changeSpy}">
          <dss-menu>
            <dss-menu-item value=${text}>${text}</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `) as HTMLElementTagNameMap['dss-dropdown'];
    }

    test('renders menu item', async () => {
      const element = await fixtureWithOneMenuItem() as Dropdown;
      await elementUpdated(element);

      expect(screen.getByShadowText(text, { exact: false })).toBeInTheDocument();
    });

    test('has no option selected', async () => {
      const element = await fixtureWithOneMenuItem() as Dropdown;
      await elementUpdated(element);

      expect(screen.queryByRole('option', { selected: false })).toBeInTheDocument();
      expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    });

    test('"aria-expanded" tracks floating element "active"', async () => {
      const element = await fixtureWithOneMenuItem();
      const floatingElement = element.shadowRoot!.querySelector('dss-floating')!;

      expect(screen.queryByShadowRole('listbox', { expanded: true })).not.toBeInTheDocument();
      expect(floatingElement.active).toBe(false);

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();
      expect(floatingElement.active).toBe(true);

      fireEvent.focusOut(screen.getByShadowRole('listbox'));
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
      expect(floatingElement.active).toBe(false);
    });

    test('when user clicks on dropdown trigger, toggles dropdown', async () => {
      const element = await fixtureWithOneMenuItem();
      expect(screen.queryByShadowRole('listbox', { expanded: true })).not.toBeInTheDocument();

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);
      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);
      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
    });

    test('when user clicks on disabled dropdown trigger, does not toggle dropdown', async () => {
      const element = await fixtureWithOneMenuItem();
      element.disabled = true;
      await elementUpdated(element);

      expect(screen.queryByShadowRole('listbox', { expanded: true })).not.toBeInTheDocument();

      screen.getByShadowRole('textbox').click();
      await elementUpdated(element);

      expect(screen.queryByShadowRole('listbox', { expanded: true })).not.toBeInTheDocument();
    });

    test.each(ActionKeystrokes)('when user presses key "%s" on dropdown trigger, toggles dropdown', async (key) => {
      const element = await fixtureWithOneMenuItem();

      expect(screen.queryByRole('listbox', { expanded: true })).not.toBeInTheDocument();

      fireEvent.keyDown(screen.getByShadowRole('listbox'), { key });
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      fireEvent.keyDown(screen.getByShadowRole('listbox'), { key });
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
    });

    test('when options lose focus, close menu', async () => {
      const element = await fixtureWithOneMenuItem();

      const options = screen.getAllByRole('option');

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);
      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      options[0].focus();
      await elementUpdated(element);
      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();
      expect(options[0]).toHaveFocus();

      fireEvent.focusOut(options[0]);
      await elementUpdated(element);
      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
    });

    test('when user presses "Escape" with the trigger in focus, closes dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      fireEvent.keyUp(screen.getByShadowRole('listbox'), { key: 'Escape' });
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
    });

    test('when user selects option, displays option in input element, closes dropdown', async () => {
      const element = await fixtureWithOneMenuItem();

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      const optionSelected = screen.getByShadowRole('option');
      await userEvent.setup().click(optionSelected);
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLElementTagNameMap['dss-dropdown'];

      expect(inputElement.value).toBe(text);
      expect(screen.getByShadowRole('listbox', { expanded: false })).toBeInTheDocument();
      expect(changeSpy).toHaveBeenCalledOnce();
      expect(changeSpy.mock.calls[0][0].target).toHaveProperty('value', 'MenuItem');
    });

    test('when value changes, shows selected menu item text and returns selected menu item text', async () => {
      const element = await fixtureWithOneMenuItem();
      await elementUpdated(element);

      element.value = text;
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe(text);
      expect(element.value).toBe(text);
    });
  });

  describe('when there are multiple menu items', () => {
    const fixtureWithThreeMenuItems = async () => {
      return await fixture(html`
        <dss-dropdown>
          <dss-menu>
            <dss-menu-item></dss-menu-item>
            <dss-menu-item></dss-menu-item>
            <dss-menu-item></dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);
    };

    test('when user presses "Down" with the menu in focus, focuses on the first option', async () => {
      const element = await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByRole('option');

      expect(options[0]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      await elementUpdated(element);
      expect(options[0]).toHaveFocus();
    });

    test('when user presses "Home" with the menu in focus, focuses on the first option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByRole('option');

      expect(options[0]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'Home' });

      expect(options[0]).toHaveFocus();
    });

    test('when user presses "Up" with the menu in focus, focuses on the last option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByRole('option');

      expect(options[2]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'ArrowUp' });

      expect(options[2]).toHaveFocus();
    });

    test('when user presses "End" with the menu in focus, focuses on the first option', async () => {
      await fixtureWithThreeMenuItems();

      const trigger = screen.getByShadowRole('listbox');
      const options = screen.getAllByRole('option');

      expect(options[2]).not.toHaveFocus();

      fireEvent.keyDown(trigger, { key: 'End' });

      expect(options[2]).toHaveFocus();
    });
  });

  describe('when used as form element', async () => {
    test('emits value to FormData', async () => {
      const form: HTMLFormElement = await fixture(html`
        <form>
          <dss-dropdown name="dropdown" value="test"></dss-dropdown>
        </form>
      `);

      const data = new FormData(form);
      expect(data.get('dropdown')).toBe('test');
    });

    test('when changed programmatically, emits value to FormData', async () => {
      const form: HTMLFormElement = await fixture(html`
        <form>
          <dss-dropdown name="dropdown" required></dss-dropdown>
        </form>
      `);

      expect(form.reportValidity()).toBe(false);

      form.querySelector('dss-dropdown')!.value = 'test';
      await elementUpdated(form);

      expect(form.reportValidity()).toBe(true);
      expect(new FormData(form).get('dropdown')).toBe('test');
    });

    test('when passing toFormValue function, emits transformed value to FormData', async () => {
      const complexValue = {
        id: 123,
        name: 'test',
      };
      const form: HTMLFormElement = await fixture(html`
        <form>
          <dss-dropdown
            name="dropdown"
            .value="${complexValue}"
            .toFormValue="${(value: typeof complexValue) => value.id.toString()}"
          ></dss-dropdown>
        </form>
      `);

      const data = new FormData(form);
      expect(data.get('dropdown')).toBe('123');
    });

    test('when passing label, is selectable by its text', async () => {
      await fixture(html`
        <dss-dropdown name="dropdown" label="test"></dss-dropdown>
      `);

      expect(screen.getByShadowLabelText('test')).toBeInTheDocument();
    });

    test('when interacting with dropdown selecting a value, does dispatch blur event after actual leaving of the component', async () => {
      const focusSpy = vi.fn();
      const blurSpy = vi.fn();
      await fixture(html`
        <dss-dropdown @blur="${blurSpy}" @focus="${focusSpy}" label="dropdown">
          <dss-menu>
            <dss-menu-item value="test">Test</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);

      const user = userEvent.setup();
      await user.click(screen.getByShadowLabelText('dropdown'));
      expect(focusSpy).toHaveBeenCalledOnce();
      expect(blurSpy).not.toHaveBeenCalled();

      await user.click(screen.getByShadowRole('option'));

      expect(focusSpy).toHaveBeenCalledTimes(2);
      expect(blurSpy).not.toHaveBeenCalled();

      await user.tab();
      expect(focusSpy).toHaveBeenCalledTimes(2);
      expect(blurSpy).toHaveBeenCalledOnce();
    });
  });

  describe('with a two menu items with value and one selected', () => {
    async function fixtureWithTwoMenuItemsWithValueAndOneSelected() {
      return await fixture(html`
        <dss-dropdown value="0">
          <dss-menu>
            <dss-menu-item value="0">Selected</dss-menu-item>
            <dss-menu-item value="1">Not selected</dss-menu-item>
          </dss-menu>
        </dss-dropdown>`) as HTMLElementTagNameMap['dss-dropdown'];
    }

    test('shows selected menu item text and returns selected menu item value', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('Selected');
      expect(element.value).toBe('0');
      expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
    });

    test('when changing the value, shows new menu item text and returns new menu item value', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      element.value = '1';
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('Not selected');
      expect(element.value).toBe('1');
      expect(screen.getByRole('option', { selected: true })).toHaveValue('1');
    });

    test('when changing the value twice, has only one selected option', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      element.value = '1';
      await elementUpdated(element);
      expect(screen.queryAllByRole('option', { selected: true })).toHaveLength(1);

      element.value = '0';
      await elementUpdated(element);
      expect(screen.queryAllByRole('option', { selected: true })).toHaveLength(1);
    });

    test('when changing to unknown value, shows no text and returns unknown string', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      element.value = 'unknown';
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('');
      expect(element.value).toBe('unknown'); // Note: the observed behavior of the HTML select element is, that in this case it returns empty string
      expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    });

    test('when resetting the value with undefined, shows no menu item text and returns undefined value', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      element.value = undefined;
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('');
      expect(element.value).toBe(undefined); // Note: the observed behavior of the HTML select element is, that in this case it returns empty string
      expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    });

    test('when resetting the value with empty string, shows no menu item text and returns undefined value', async () => {
      const element = await fixtureWithTwoMenuItemsWithValueAndOneSelected();

      element.value = '';
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('');
      expect(element.value).toBe('');
      expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    });
  });

  describe('with a two menu items without value and one selected', () => {
    async function fixtureWithTwoMenuItemsWithoutValueAndOneSelected() {
      return await fixture(html`
        <dss-dropdown value="Selected">
          <dss-menu>
            <dss-menu-item>Selected</dss-menu-item>
            <dss-menu-item>Not selected</dss-menu-item>
          </dss-menu>
        </dss-dropdown>`) as HTMLElementTagNameMap['dss-dropdown'];
    }

    test('shows selected menu item text and returns selected menu item text', async () => {
      const element = await fixtureWithTwoMenuItemsWithoutValueAndOneSelected();

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('Selected');
      expect(element.value).toBe('Selected');
    });

    test('when changing the value, shows new menu item text and returns new menu item text', async () => {
      const element = await fixtureWithTwoMenuItemsWithoutValueAndOneSelected();

      element.value = 'Not selected';
      await elementUpdated(element);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement;
      expect(inputElement.value).toBe('Not selected');
      expect(element.value).toBe('Not selected');
    });
  });

  describe('when multi select', () => {
    async function fixtureWithMultipleMenuItemsAndMultiSelect() {
      return await fixture(html`
        <dss-dropdown .multiSelect="${true}">
          <dss-menu>
            <dss-menu-item value="valueA">Value A</dss-menu-item>
            <dss-menu-item value="valueB">Value B</dss-menu-item>
            <dss-menu-item value="valueC">Value C</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `) as HTMLElementTagNameMap['dss-dropdown'];
    }

    test('when open, does not close on select', async () => {
      const element = await fixtureWithMultipleMenuItemsAndMultiSelect();
      expect(screen.queryByShadowRole('listbox', { expanded: true })).not.toBeInTheDocument();

      screen.getByShadowRole('listbox').click();
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();

      screen.getAllByShadowRole('option')[0].click();
      await elementUpdated(element);

      expect(screen.getByShadowRole('listbox', { expanded: true })).toBeInTheDocument();
    });

    test('adds selected values to values property', async () => {
      const dropdownElement = await fixtureWithMultipleMenuItemsAndMultiSelect();

      const options = screen.getAllByShadowRole('option');
      await userEvent.setup().click(options[0]);

      expect(dropdownElement.values).toEqual(['valueA']);

      await userEvent.setup().click(options[1]);

      expect(dropdownElement.values).toEqual(['valueA', 'valueB']);
    });

    test('removes selected value when previously selected', async () => {
      const dropdownElement = await fixtureWithMultipleMenuItemsAndMultiSelect();

      const options = screen.getAllByShadowRole('option');
      await userEvent.setup().click(options[0]);

      expect(dropdownElement.values).toEqual(['valueA']);

      await userEvent.setup().click(options[0]);

      expect(dropdownElement.values).toEqual([]);
    });

    test('reflects selected values in text box', async () => {
      await fixtureWithMultipleMenuItemsAndMultiSelect();

      const options = screen.getAllByShadowRole('option');
      await userEvent.setup().click(options[0]);

      expect(screen.getByShadowRole('textbox')).toHaveValue('Value A');

      await userEvent.setup().click(options[1]);
      expect(screen.getByShadowRole('textbox')).toHaveValue('Value A, Value B');
    });

    test('ignores selected property with "dropdownIgnore" set', async () => {
      await fixture(html`
        <dss-dropdown .multiSelect="${true}">
          <dss-menu>
            <dss-menu-item value="valueA" data-dss-dropdown-ignore="true" .selected="${true}">Value A</dss-menu-item>
            <dss-menu-item value="valueB">Value B</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);

      const selectedOptions = screen.getAllByShadowRole('option', { selected: true });
      expect(selectedOptions).toHaveLength(1);
      expect(screen.getByShadowRole('textbox')).toHaveValue('');
    });

    test('when hideAllSelected is set, does not show selected values in text box when all selected', async () => {
      await fixture(html`
        <dss-dropdown .multiSelect="${true}" .values="${['valueA', 'valueB']}" .hideAllSelected="${true}">
          <dss-menu>
            <dss-menu-item value="valueA">Value A</dss-menu-item>
            <dss-menu-item value="valueB">Value B</dss-menu-item>
          </dss-menu>
        </dss-dropdown>
      `);

      expect(screen.getByShadowRole('textbox')).toHaveValue('');
    });
  });
});
