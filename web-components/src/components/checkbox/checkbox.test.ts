import './checkbox.component';
import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';

describe('Checkbox', () => {
  test('when label given, is selectable by its text', async () => {
    await fixture(html`
      <dss-checkbox .label=${'label'}></dss-checkbox>
    `);

    expect(screen.getByShadowLabelText('label')).toBeInTheDocument();
  });

  test('maps required state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label= ${'test label'} .required=${true}></dss-checkbox>
    `);

    expect(screen.getByShadowRole('checkbox')).toHaveProperty('required');
  });

  test('displays unchecked state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label=${'Label'}></dss-checkbox>
    `);

    expect(screen.getByShadowTestId('label')).not.toHaveClass('filled');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('warning');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('error');
    expect(screen.queryByShadowRole('figure')).not.toBeInTheDocument();
  });

  test('displays checked state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label=${'Label'} .checked=${true}></dss-checkbox>
    `);

    expect(screen.getByShadowTestId('label')).toHaveClass('filled');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('warning');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('error');
    expect(screen.queryByShadowRole('figure')).toHaveAttribute('icon', 'navigate_check');
  });

  test('displays indeterminate state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label=${'Label'} .indeterminate=${true}></dss-checkbox>
    `);

    expect(screen.getByShadowTestId('label')).toHaveClass('filled');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('warning');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('error');
    expect(screen.queryByShadowRole('figure')).toHaveAttribute('icon', 'navigate_minus');
  });

  test('displays error state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label=${'Label'} .errorState=${'error'}></dss-checkbox>
    `);

    expect(screen.getByShadowTestId('label')).not.toHaveClass('filled');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('warning');
    expect(screen.getByShadowTestId('label')).toHaveClass('error');
  });

  test('displays warning state correctly', async () => {
    await fixture(html`
      <dss-checkbox .label=${'Label'} .errorState=${'warning'}></dss-checkbox>
    `);

    expect(screen.getByShadowTestId('label')).not.toHaveClass('filled');
    expect(screen.getByShadowTestId('label')).toHaveClass('warning');
    expect(screen.getByShadowTestId('label')).not.toHaveClass('error');
  });

  test('displays compact size correctly', async () => {
    await fixture(html`
      <dss-checkbox .size=${'compact'} .checked=${true}></dss-checkbox>
    `);

    expect(screen.queryByShadowRole('figure')).toHaveAttribute('size', 'xsmall');
  });

  test('displays comfortable size correctly', async () => {
    await fixture(html`
      <dss-checkbox .size=${'comfortable'} .checked=${true}></dss-checkbox>
    `);

    expect(screen.queryByShadowRole('figure')).toHaveAttribute('size', 'small');
  });

  test('when state change, redispatches change event and updates value', async () => {
    const changeSpy = vi.fn();
    await fixture(html`
      <dss-checkbox .size=${'comfortable'} @change=${changeSpy}></dss-checkbox>
    `);

    screen.queryByShadowRole('checkbox')?.click();

    expect(changeSpy).toHaveBeenCalled();
    const customElement = changeSpy.mock.calls[0][0].target;
    expect(customElement).toHaveProperty('checked');
    expect(customElement).toHaveProperty('value', 'on');
  });

});
