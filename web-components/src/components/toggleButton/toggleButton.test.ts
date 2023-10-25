import './toggleButton.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { within } from 'shadow-dom-testing-library';

describe('ToggleButton', () => {

  test('when user clicks, toggles button', async () => {
    const user = userEvent.setup();

    const element = await fixture(
      html`
        <dss-toggle-button>
          <dss-icon icon="add-lg"></dss-icon>
        </dss-toggle-button>`,
    ) as HTMLElementTagNameMap['dss-toggle-button'];

    const dssButton = element.shadowRoot!.querySelector('dss-button')! as HTMLElementTagNameMap['dss-button'];
    const button = within(dssButton).getByShadowRole('button');

    expect(element.pressed).toBe(false);
    expect(dssButton.type).toBe('ghost');

    await user.click(button);
    await elementUpdated(element);

    expect(element.pressed).toBe(true);
    expect(dssButton.type).toBe('secondary');

    await user.click(button);
    await elementUpdated(element);

    expect(element.pressed).toBe(false);
    expect(dssButton.type).toBe('ghost');
  });
});
