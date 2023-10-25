import '../radio/radio.component';
import './radiogroup.component';
import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import { InputErrorState } from '../input/input.component';

describe('RadioGroup', async () => {

  test('shows label', async () => {
    await renderWithThreeRequiredRadios();

    expect(screen.getByShadowText('Please choose an option')).toBeInTheDocument();
  });

  test('radios do not render individual error messages', async () => {
    const errorState: InputErrorState = 'error';
    const message = 'Something is wrong';
    await fixture(html`
      <dss-radiogroup label="Please choose an option" required="true" message="${message}" errorState="${errorState}">
        <dss-radio message="${message}" errorState="${errorState}">
          <input type="radio">
        </dss-radio>
      </dss-radiogroup>
    `);

    expect(screen.getAllByShadowText(message)).toHaveLength(1);
  });

  test('when required, shows label as required', async () => {
    const element = await renderWithThreeRequiredRadios() as HTMLElementTagNameMap['dss-radiogroup'];
    await elementUpdated(element);

    expect(screen.getByShadowText('*')).toBeInTheDocument();
  });

  test('when not given an error state, shows no error state', async () => {
    await renderWithThreeRequiredRadios();

    assertNoErrorState(screen.queryByShadowText('Label 1'));
    assertNoErrorState(screen.queryByShadowText('Label 2'));
    assertNoErrorState(screen.queryByShadowText('Label 3'));
  });

  test('when given an error state "error", shows "error" state', async () => {
    const element = await renderWithThreeRequiredRadios() as HTMLElementTagNameMap['dss-radiogroup'];
    element.errorState = 'error';
    element.message = 'This is an error message';
    await elementUpdated(element);

    assertErrorState(screen.queryByShadowText('Label 1'), 'error');
    assertErrorState(screen.queryByShadowText('Label 2'), 'error');
    assertErrorState(screen.queryByShadowText('Label 3'), 'error');
    expect(screen.getByShadowText('This is an error message')).toBeInTheDocument();
  });

  test('when given an error state "warning", shows "warning" state', async () => {
    const element = await renderWithThreeRequiredRadios() as HTMLElementTagNameMap['dss-radiogroup'];
    element.errorState = 'warning';
    element.message = 'This is a warning message';
    await elementUpdated(element);

    assertErrorState(screen.queryByShadowText('Label 1'), 'warning');
    assertErrorState(screen.queryByShadowText('Label 2'), 'warning');
    assertErrorState(screen.queryByShadowText('Label 3'), 'warning');
    expect(screen.getByShadowText('This is a warning message')).toBeInTheDocument();
  });

  function assertNoErrorState(element: HTMLElement | null) {
    expect(element).not.toHaveClass('error');
    expect(element).not.toHaveClass('warning');
  }

  function assertErrorState(element: HTMLElement | null, errorState: InputErrorState) {
    expect(element).toHaveClass(errorState);
  }

  async function renderWithThreeRequiredRadios() {
    return await fixture(html`
      <dss-radiogroup label="Please choose an option" required="true">
        <dss-radio label='Label 1'>
          <input type="radio" name="option" value="option1">
        </dss-radio>
        <dss-radio label='Label 2'>
          <input type="radio" name="option" value="option2">
        </dss-radio>
        <dss-radio label='Label 3'>
          <input type="radio" name="option" value="option3">
        </dss-radio>
      </dss-radiogroup>
    `);
  }
});
