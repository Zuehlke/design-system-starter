import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import './menuItem.component';
import '../checkbox/checkbox.component';
import MenuItem from './menuItem.component';
import { screen } from 'shadow-dom-testing-library';

describe('MenuItem', () => {

  test('when connected, sets role attribute', async () => {
    const element: MenuItem = await fixture(html`
      <dss-menu-item></dss-menu-item>
    `);

    expect(element).toHaveAttribute('role', 'menuitem');
  });

  test('when checkbox slotted, adds correct attributes', async () => {
    const element: MenuItem = await fixture(html`
      <dss-menu-item>
        <dss-checkbox>Test</dss-checkbox>
      </dss-menu-item>
    `);

    const checkboxElement = document.querySelector('dss-checkbox');

    expect(element).toHaveAttribute('role', 'menuitem');
    expect(checkboxElement).toHaveAttribute('tabindex', '-1');
  });

  test('when checkbox slotted, synchronizes selected property to checked state', async () => {
    const element: MenuItem = await fixture(html`
      <dss-menu-item .selected="${true}">
      </dss-menu-item>
    `);
    const checkboxElement = document.createElement('dss-checkbox');
    element.appendChild(checkboxElement);
    await elementUpdated(element);

    expect(checkboxElement).toHaveProperty('checked', true);

    element.selected = false;
    await elementUpdated(element);

    expect(checkboxElement).toHaveProperty('checked', false);
  });

  test('when selected set to true, element is accessible as selected', async () => {
    const element: MenuItem = await fixture(html`
      <dss-menu-item>
        <dss-checkbox>Test</dss-checkbox>
      </dss-menu-item>
    `);
    element.setAttribute('role', 'option');

    expect(screen.getByRole('option', { selected: false })).toBeInTheDocument();

    element.selected = true;
    await elementUpdated(element);

    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
  });
});
