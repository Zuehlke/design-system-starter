import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import userEvent from '@testing-library/user-event';
import './switch.component';

describe('switch', () => {
  test('when in a form, reports value to FormData', async () => {
    const formElement: HTMLFormElement = await fixture(html`
      <form name="test-form">
        <dss-switch name="off-switch"></dss-switch>
        <dss-switch name="on-switch" checked></dss-switch>
      </form>
    `);

    const formData = new FormData(formElement);
    expect(formData.get('off-switch')).toBeNull();
    expect(formData.get('on-switch')).toBe('on');
  });

  test('when disabled set, passes it to underlying input', async () => {
    await fixture(html`
      <dss-switch disabled></dss-switch>
    `);

    expect(screen.getByShadowRole('checkbox')).toBeDisabled();
  });

  test('when state changes, throws change event and updates value', async () => {
    const spy = vi.fn();
    await fixture(html`
      <dss-switch @change="${spy}"></dss-switch>
    `);

    const user = userEvent.setup();
    await user.click(screen.getByShadowRole('checkbox'));

    expect(spy).toHaveBeenCalled();
    const customElement = spy.mock.calls[0][0].target;
    expect(customElement).toHaveProperty('checked');
    expect(customElement).toHaveProperty('value', 'on');
  });

  test('when loading set, shows status element', async () => {
    await fixture(html`
      <dss-switch loading></dss-switch>
    `);

    expect(screen.getByShadowRole('status')).toBeInTheDocument();
  });
});
