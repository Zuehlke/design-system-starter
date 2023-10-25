import './icon.component';
import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';

describe('Icon', () => {
  test('should display nothing when no icon given', async () => {
    const element: HTMLElementTagNameMap['dss-icon'] = await fixture(html`
      <dss-icon></dss-icon>
    `);

    await elementUpdated(element);
    await vi.dynamicImportSettled();

    expect(element.shadowRoot!.querySelectorAll('svg')).toHaveLength(0);
  });

  test('should display given icon', async () => {
    const element: HTMLElementTagNameMap['dss-icon'] = await fixture(html`
      <dss-icon icon="ambulance"></dss-icon>
    `);

    await elementUpdated(element);
    await vi.dynamicImportSettled();

    expect(element.shadowRoot!.querySelectorAll('svg')).toHaveLength(1);
  });

  test('when properties relevant for styling are given, reflects them to attributes', async () => {
    const element: HTMLElementTagNameMap['dss-icon'] = await fixture(html`
      <dss-icon></dss-icon>
    `);

    element.icon = 'star';
    element.size = 'large';
    await elementUpdated(element);

    expect(element.getAttribute('icon')).toBe('star');
    expect(element.getAttribute('size')).toBe('large');
  });
});
