import { describe, expect, test } from 'vitest';
import './multiselect.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';

describe('Multiselect', () => {

  describe('selection', () => {
    test('when given selected options, displays them as pills', async () => {

      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${basicOptions} .value=${[basicOptions[1]]}></dss-multiselect>
      `);

      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement
      inputElement.focus();
      await elementUpdated(element);

      const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
      expect(selectedPills).toHaveLength(1);
      expect(selectedPills[0]).toHaveTextContent('Other Test');
    });

    test('when options are selected, adds them to pills', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${basicOptions} .value=${[basicOptions[1]]}></dss-multiselect>
      `);
      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement
      inputElement.focus();
      await elementUpdated(element);

      (element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement).click();
      await elementUpdated(element);

      const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
      expect(selectedPills).toHaveLength(2);
    });

    test('when remove button is clicked, removes pill', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${basicOptions} .value=${[basicOptions[1]]}></dss-multiselect>
      `);

      const inputElement = element.shadowRoot!.querySelector('.pill dss-button') as HTMLElementTagNameMap['dss-button'];
      inputElement.click();
      await elementUpdated(element);

      const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
      expect(selectedPills).toHaveLength(0);
    });

    test('when user presses enter key, selects focused option', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption}></dss-multiselect>
      `);
      const inputElement = screen.getByShadowRole('textbox') as HTMLInputElement
      inputElement.focus();
      await elementUpdated(element);

      fireEvent.keyDown(element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement, { key: 'Enter' });
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelectorAll('.pill')).toHaveLength(1);
    });

    test('when user presses space bar, selects focused option', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption}></dss-multiselect>
      `);
      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();
      await elementUpdated(element);

      fireEvent.keyDown(element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement, { key: ' ' });
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelectorAll('.pill')).toHaveLength(1);
    });

    test('when selectable options limit is set to 1, clicking an option replaces existing selection, if any', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .limit=${1} .options=${basicOptions} .value=${[basicOptions[0]]}></dss-multiselect>
      `);
      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();
      await elementUpdated(element);

      (element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement).click();
      await elementUpdated(element);

      const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
      expect(selectedPills).toHaveLength(1);
      expect(selectedPills[0]).toHaveTextContent(basicOptions[1]);
    });
  });

  test('when selectable options limit is set and limit is already reached, clicking an option shifts pill array left and displaces first element in existing selection', async () => {
    const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
      <dss-multiselect .limit=${2} .options=${moreOptions} .value=${moreOptions.slice(0, 2)}></dss-multiselect>
    `);
    const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
    inputElement.focus();
    await elementUpdated(element);

    (element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement).click();
    await elementUpdated(element);

    const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
    expect(selectedPills).toHaveLength(2);
    expect(selectedPills[0]).toHaveTextContent(moreOptions[1]);
    expect(selectedPills[1]).toHaveTextContent(moreOptions[2]);

    const listElement = element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement;

    expect(listElement).toHaveTextContent(moreOptions[0]);
  });

  describe('filtering', () => {
    test('when user types into input, filters options as string', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${moreOptions}></dss-multiselect>
      `);

      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();
      inputElement.value = 'Other';
      fireEvent.input(inputElement);
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelectorAll('dss-menu-item')).toHaveLength(2);
    });

    test('when user input does not match any options, shows no options', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption}></dss-multiselect>
      `);

      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();
      inputElement.value = 'Not';
      fireEvent.input(inputElement);
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelectorAll('dss-menu-item')).toHaveLength(1);
      expect(element.shadowRoot!.querySelector('dss-menu-item')).not.toHaveTextContent('Test');
    });

    test('when user types, filters options using given function', async () => {
      const options = [
        { name: 'TestPerson', age: 19 },
        { name: 'TestPerson2', age: 28 },
        { name: 'TestPerson3', age: 45 },
      ];
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect
          .mapToListItem=${(option: any) => option.name}
          .filter=${(option: any, inputValue?: string) => option.age > Number(inputValue)}
          .options=${options}
        ></dss-multiselect>
      `);

      const inputElement = await screen.getByShadowRole('textbox') as HTMLInputElement
      inputElement.focus();
      inputElement.value = '28';
      fireEvent.input(inputElement);
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelectorAll('dss-menu-item')).toHaveLength(1);
    });

    test('when user presses Esc key, clears filter', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption}></dss-multiselect>
      `);

      const inputElement = await screen.getByShadowRole('textbox') as HTMLInputElement
      inputElement.focus();
      inputElement.value = '28';
      fireEvent.keyDown(inputElement, { key: 'Escape' });
      await elementUpdated(element);

      expect(element.shadowRoot!.querySelector('input')).toHaveValue('');
    });

    test('when user presses Esc key, closes dropdown', async () => {
      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption}></dss-multiselect>
      `);

      const inputElement = await screen.getByShadowRole('textbox')
      inputElement.click();
      await elementUpdated(element);

      const byShadowTestId = screen.getByShadowTestId('custom-element');
      expect(byShadowTestId).toBeInTheDocument()
      expect(byShadowTestId).toHaveAttribute('aria-expanded', 'true')

      fireEvent.keyUp(inputElement, { key: 'Escape' });
      await elementUpdated(element);

      expect(byShadowTestId).toBeInTheDocument()
      expect(byShadowTestId).toHaveAttribute('aria-expanded', 'false')
    });
  });



  describe('Object mapping', () => {
    test('when mapping to list item function provided, it is used to display list items content', async () => {

      const fakeOptionValue = 'Fake Option Value';

      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${singleOption} .mapToListItem=${() => fakeOptionValue}></dss-multiselect>
      `);

      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();

      expect(element.shadowRoot!.querySelector('dss-menu-item')).toHaveTextContent(fakeOptionValue);
    });

    test('when mapping to pill function provided, it is used to display pill content', async () => {
      const fakePillValue = 'Fake Pill Value';

      const element: HTMLElementTagNameMap['dss-multiselect'] = await fixture(html`
        <dss-multiselect .options=${basicOptions} .mapToPill=${() => fakePillValue}></dss-multiselect>
      `);

      const inputElement = element.shadowRoot!.querySelector('input') as HTMLInputElement;
      inputElement.focus();

      (element.shadowRoot!.querySelector('dss-menu-item:first-child') as HTMLLIElement).click();
      await elementUpdated(element);

      const selectedPills = element.shadowRoot!.querySelectorAll('.pill');
      expect(selectedPills).toHaveLength(1);

      expect(selectedPills[0]).toHaveTextContent(fakePillValue);
    });
  });

  describe('Form interactions', () => {
    // TODO: currently not possible to test that when value is selected, it is saved to the associated form,
    //  because of CSS selector error. Same issue as TODO #204 in customer-overview
    test('when value is pre-selected, it is pushed to the associated form', async () => {
      const element = await fixture(html`
        <form>
          <dss-multiselect
            name="multiselect"
            .options=${basicOptions}
            .value=${[basicOptions[0]]}
          ></dss-multiselect>
        </form>
      `) as HTMLFormElement;

      const data = new FormData(element);
      expect(data.get('multiselect')).toBe(basicOptions[0]);
    });
  });

});

const singleOption = ['Test'];

const basicOptions = [
  'Test',
  'Other Test',
];

const moreOptions = [
  'Test',
  'Other Test',
  'Other Test 2',
];