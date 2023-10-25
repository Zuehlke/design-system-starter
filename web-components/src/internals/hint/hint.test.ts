import { describe, expect, test } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import './hint';

describe('hint', () => {
  test('shows given message', async () => {
    await fixture(html`
      <dss-hint message="Test message"></dss-hint>
    `);

    expect(screen.getByShadowText('Test message')).toBeInTheDocument();
  });

  test('shows icon when state error', async () => {
    await fixture(html`
      <dss-hint state="error" message="message"></dss-hint>
    `);

    expect(screen.getByShadowTestId('error-icon')).toHaveAttribute('icon', 'sign_stop');
  });

  test('shows icon when state warning', async () => {
    await fixture(html`
      <dss-hint state="warning" message="message"></dss-hint>
    `);

    expect(screen.getByShadowTestId('error-icon')).toHaveAttribute('icon', 'sign_warning');
  });
});
