import './chooser.component';
import '../dropdown/dropdown.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import '../button/button.component';
import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';


describe('Chooser', () => {
  describe('when there is an option', () => {
    const option = {
      description: 'Sed aliquid ducimus dolores consectetur.',
      firstName: 'Santina',
      lastName: 'Harris',
    };

    const mapOptionToDisplay = (element: typeof option) => `${element.lastName + ', ' + element.firstName}`;

    const fixtureWithOneOption = async () => {
      return await fixture(html`
        <dss-chooser
          .data=${[option]}
          .mapToDisplay=${mapOptionToDisplay}
        ></dss-chooser>
      `);
    };

    test('renders option', async () => {
      await fixtureWithOneOption();

      expect(screen.getByShadowText(`${option.lastName}, ${option.firstName}`));

      const entriesDropdownList = screen.getAllByShadowRole('option');
      expect(entriesDropdownList).toHaveLength(1);
    });

    test('when user clicks option, emits event', async () => {
      const element = await fixtureWithOneOption();

      const listenerSpy = vi.fn();
      element.addEventListener('dss-menu-selection', listenerSpy);

      const dropdownOptionsList = screen.getAllByShadowRole('option');
      dropdownOptionsList[0].click();
      fireEvent.click(dropdownOptionsList[0], { detail: 1 });
      await elementUpdated(element);

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value: option,
          text: mapOptionToDisplay(option),
        },
      }));
    });

    test('selects list element on enter keypress', async () => {
      const listenerSpy = vi.fn();

      const element = await fixtureWithOneOption();
      element.addEventListener('dss-menu-selection', listenerSpy);

      const entriesDropdownList = screen.getAllByShadowRole('option');
      const optionElement = entriesDropdownList[0];
      fireEvent.keyDown(optionElement, { key: 'Enter' });
      await elementUpdated(element);
      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value: option,
          text: mapOptionToDisplay(option),
        },
      }));
    });
  });

  describe('when there is a filter category', () => {
    const filterCategory = {
      fieldName: 'Partner Nr.',
      fieldVal: 'partnerNumber',
    };

    const fixtureWithOneFilterCategory = async () => {
      return await fixture(html`
        <dss-chooser .filterCategories=${[filterCategory]}></dss-chooser>
      `) as HTMLElementTagNameMap['dss-chooser'];
    };

    test('renders filter categories according to given config', async () => {
      await fixtureWithOneFilterCategory();
      expect(screen.getAllByShadowRole('option')).toHaveLength(1);
    });

    test('updates when the passed filter categories prop changes', async () => {
      const element = await fixtureWithOneFilterCategory();

      let categoriesDropdownList = screen.getAllByShadowRole('option');
      expect(categoriesDropdownList).toHaveLength(1);

      const updatedCategories = [filterCategory, filterCategory];
      element.filterCategories = updatedCategories;
      await elementUpdated(element);

      //TODO: the aria roles on filterCategories property change will be wrong, issue here:  https://dev.azure.com/zuehlke-dreyfus/2ndStack/_boards/board/t/2ndStack%20Team/Stories/?workitem=239
      // categoriesDropdownList = screen.getAllByShadowRole('option');
      categoriesDropdownList = screen.getAllByShadowRole('checkbox');

      expect(categoriesDropdownList).toHaveLength(updatedCategories.length);
    });

  });

  describe('when there are multiple filter categories', () => {
    const filterCategories = [
      {
        fieldName: 'Partner Nr.',
        fieldVal: 'partnerNumber',
      },
      {
        fieldName: 'Kurzbeschreibung',
        fieldVal: 'kurzBeschreibung',
      },
      {
        fieldName: 'Währung',
        fieldVal: 'waehrung',
      },
      {
        fieldName: 'Kontoart',
        fieldVal: 'kontoart',
      },
    ];

    const fixtureWithMultipleFilterCategories = async () => {
      return await fixture(html`
        <dss-chooser .filterCategories=${filterCategories}></dss-chooser>
      `);
    };

    // reactive props
    test('registers clicks on search categories correctly', async () => {
      const element = await fixtureWithMultipleFilterCategories();

      const categoriesDropdownList = screen.getAllByShadowRole('option');
      fireEvent.click(categoriesDropdownList[0], { detail: 1 });
      fireEvent.click(categoriesDropdownList[2], { detail: 1 });
      await elementUpdated(element);

      const checkboxes = element.shadowRoot!.querySelectorAll('dss-checkbox');

      expect(checkboxes[0].shadowRoot!.querySelector('input')).toBeChecked();
      expect(checkboxes[1].shadowRoot!.querySelector('input')).not.toBeChecked();
      expect(checkboxes[2].shadowRoot!.querySelector('input')).toBeChecked();
    });

    test('selects category on enter keypress', async () => {
      const element = await fixtureWithMultipleFilterCategories();

      const categoriesDropdownList = screen.getAllByShadowRole('option');
      const option = categoriesDropdownList[0];

      fireEvent.keyDown(option, { key: 'Enter' });
      await elementUpdated(element);

      const checkbox = option.querySelector('dss-checkbox')!.shadowRoot!.querySelector('input');
      expect(checkbox).toBeChecked();
    });
  });
});
