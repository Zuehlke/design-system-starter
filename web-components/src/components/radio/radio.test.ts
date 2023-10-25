import './radio.component';
import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';

describe('Radio', async () => {

  test('unchecked slotted element corresponds to unchecked internal state', async () => {
    await fixture(html`
      <dss-radio label='Label'>
        <input type="radio">
      </dss-radio>
    `);

    expect(screen.queryByShadowText('Label')).not.toHaveClass('disabled');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('error');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('warning');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('checked');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('focused');
  });

  test('checked attribute on slotted element corresponds to checked internal state', async () => {
    await fixture(html`
      <dss-radio label='Label'>
        <input type="radio" checked>
      </dss-radio>
    `);

    expect(screen.queryByShadowText('Label')).not.toHaveClass('disabled');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('error');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('warning');
    expect(screen.queryByShadowText('Label')).toHaveClass('checked');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('focused');
  });

  test('displays error state correctly', async () => {
    await fixture(html`
      <dss-radio label='Label' .errorState=${'error'}>
        <input type="radio">
      </dss-radio>
    `);

    expect(screen.queryByShadowText('Label')).not.toHaveClass('disabled');
    expect(screen.queryByShadowText('Label')).toHaveClass('error');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('warning');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('checked');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('focused');
  });

  test('displays warning state correctly', async () => {
    await fixture(html`
      <dss-radio label='Label' .errorState=${'warning'}>
        <input type="radio">
      </dss-radio>
    `);

    expect(screen.queryByShadowText('Label')).not.toHaveClass('disabled');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('error');
    expect(screen.queryByShadowText('Label')).toHaveClass('warning');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('checked');
    expect(screen.queryByShadowText('Label')).not.toHaveClass('focused');
  });

  describe('when there is a label', () => {
    const fixtureWithLabel = async () => await fixture(html`
      <dss-radio label='Label'>
        <input type="radio">
      </dss-radio>
    `);

    test('displays the label', async () => {
      await fixtureWithLabel();
      const label = screen.getByShadowText('Label');

      expect(label).toBeInTheDocument();
    });

    test('changes state to checked on click label', async () => {
      const fixture = await fixtureWithLabel();
      const labelElement = screen.getByShadowText('Label');
      labelElement.click();

      await elementUpdated(fixture);
      expect(labelElement).toHaveClass('checked');
    });

    test('input is selectable by its text', async () => {
      await fixtureWithLabel();

      expect(screen.getByShadowLabelText('Label')).toBeInTheDocument();
    });
  });

  describe('when there are several radio buttons', () => {
    test('deselects previously selected radio button on click other radio button in group', async () => {
      const singleGroupFixture = await fixture(
        html`
          <div>
            <dss-radio label='Label_1_1'>
              <input type="radio" name="sameGroup" checked>
            </dss-radio>

            <dss-radio label='Label_1_2'>
              <input type="radio" name="sameGroup">
            </dss-radio>
          </div>
        `);

      const firstLabel = screen.getByShadowText('Label_1_1');
      const secondLabel = screen.getByShadowText('Label_1_2');

      expect(firstLabel).not.toHaveClass('disabled');
      expect(firstLabel).not.toHaveClass('error');
      expect(firstLabel).not.toHaveClass('warning');
      expect(firstLabel).toHaveClass('checked');
      expect(firstLabel).not.toHaveClass('focused');

      expect(secondLabel).not.toHaveClass('disabled');
      expect(secondLabel).not.toHaveClass('error');
      expect(secondLabel).not.toHaveClass('warning');
      expect(secondLabel).not.toHaveClass('checked');
      expect(secondLabel).not.toHaveClass('focused');

      secondLabel.click();
      await elementUpdated(singleGroupFixture);

      expect(firstLabel).not.toHaveClass('disabled');
      expect(firstLabel).not.toHaveClass('error');
      expect(firstLabel).not.toHaveClass('warning');
      expect(firstLabel).not.toHaveClass('checked');
      expect(firstLabel).not.toHaveClass('focused');

      expect(secondLabel).not.toHaveClass('disabled');
      expect(secondLabel).not.toHaveClass('error');
      expect(secondLabel).not.toHaveClass('warning');
      expect(secondLabel).toHaveClass('checked');
      expect(secondLabel).not.toHaveClass('focused');
    });

    test('selecting a button in one radio button group does not deselect radio from a different button group', async () => {
      const doubleGroupFixture = await fixture(
        html`
          <div>
            <dss-radio label='Label_1_1'>
              <input id="choice1" type="radio" name="sameGroup" checked>
            </dss-radio>

            <dss-radio label='Label_1_2'>
              <input id="choice2" type="radio" name="sameGroup">
            </dss-radio>

            <dss-radio label='Label_2_1'>
              <input id="choice1" type="radio" name="otherGroup">
            </dss-radio>

            <dss-radio label='Label_2_2'>
              <input id="choice2" type="radio" name="otherGroup">
            </dss-radio>
          </div>
        `);

      const label1 = screen.queryByShadowText('Label_1_1');
      const label2 = screen.queryByShadowText('Label_1_2');
      const label3 = screen.queryByShadowText('Label_2_1');
      const label4 = screen.queryByShadowText('Label_2_2');

      expect(label1).not.toHaveClass('disabled');
      expect(label1).not.toHaveClass('error');
      expect(label1).not.toHaveClass('warning');
      expect(label1).toHaveClass('checked');
      expect(label1).not.toHaveClass('focused');

      expect(label2).not.toHaveClass('disabled');
      expect(label2).not.toHaveClass('error');
      expect(label2).not.toHaveClass('warning');
      expect(label2).not.toHaveClass('checked');
      expect(label2).not.toHaveClass('focused');

      expect(label3).not.toHaveClass('disabled');
      expect(label3).not.toHaveClass('error');
      expect(label3).not.toHaveClass('warning');
      expect(label3).not.toHaveClass('checked');
      expect(label3).not.toHaveClass('focused');

      expect(label4).not.toHaveClass('disabled');
      expect(label4).not.toHaveClass('error');
      expect(label4).not.toHaveClass('warning');
      expect(label4).not.toHaveClass('checked');
      expect(label4).not.toHaveClass('focused');

      label3!.click();
      await elementUpdated(doubleGroupFixture);

      expect(label1).not.toHaveClass('disabled');
      expect(label1).not.toHaveClass('error');
      expect(label1).not.toHaveClass('warning');
      expect(label1).toHaveClass('checked');
      expect(label1).not.toHaveClass('focused');

      expect(label2).not.toHaveClass('disabled');
      expect(label2).not.toHaveClass('error');
      expect(label2).not.toHaveClass('warning');
      expect(label2).not.toHaveClass('checked');
      expect(label2).not.toHaveClass('focused');

      expect(label3).not.toHaveClass('disabled');
      expect(label3).not.toHaveClass('error');
      expect(label3).not.toHaveClass('warning');
      expect(label3).toHaveClass('checked');
      expect(label3).not.toHaveClass('focused');

      expect(label4).not.toHaveClass('disabled');
      expect(label4).not.toHaveClass('error');
      expect(label4).not.toHaveClass('warning');
      expect(label4).not.toHaveClass('checked');
      expect(label4).not.toHaveClass('focused');
    });

    test('inside a form, the value selected for the group of radio buttons is that of the selected button', async () => {

      let fieldValue = undefined;

      const submitHandler = async (event: Event) => {
        fieldValue = ((event.target as HTMLFormElement).elements.namedItem('sameGroup')! as HTMLInputElement).value;
        event.preventDefault();
        event.stopImmediatePropagation();
      };

      await fixture(
        html`
          <form data-testid="myTestForm" @submit=${submitHandler}>
            <dss-radio label='Label_1_1'>
              <input type="radio" name="sameGroup" value="element1" checked>
            </dss-radio>

            <dss-radio label='Label_1_2'>
              <input type="radio" name="sameGroup" value="element2">
            </dss-radio>

            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        `);

      const secondLabel = screen.getByShadowText('Label_1_2');
      secondLabel.click();
      const submitButton = await screen.getByRole('button');
      submitButton.click();

      expect(fieldValue).toEqual((screen.getAllByShadowRole('radio')[1] as HTMLInputElement).value);
    });
  });
});
