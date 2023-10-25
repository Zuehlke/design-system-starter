import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import './menu.component';
import '../menuItem/menuItem.component';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';

describe('Menu', () => {

  describe('when menu has one item', () => {
    const value = 'value';
    const text = 'Edit';

    async function fixtureWithOneItemAndSpy() {
      const listenerSpy = vi.fn();
      await fixture(html`
        <dss-menu @dss-menu-selection=${(event: Event) => listenerSpy(event)}>
          <dss-menu-item value="${value}">${text}</dss-menu-item>
        </dss-menu>
      `);
      return listenerSpy;
    }

    test('when user clicks an item, selects action', async () => {
      const listenerSpy = await fixtureWithOneItemAndSpy();

      const action = screen.getByRole('menuitem');
      fireEvent.click(action, { detail: 1 });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value,
          text,
        },
      }));
    });

    test('when user presses "Enter", selects action', async () => {
      const listenerSpy = await fixtureWithOneItemAndSpy();

      const action = screen.getByRole('menuitem');
      fireEvent.keyDown(action, { key: 'Enter' });

      expect(listenerSpy).toHaveBeenCalledOnce();
      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value,
          text,
        },
      }));
    });

    test('when user presses space, selects action', async () => {
      const listenerSpy = await fixtureWithOneItemAndSpy();

      const action = screen.getByRole('menuitem');
      fireEvent.keyDown(action, { key: ' ' });

      expect(listenerSpy).toHaveBeenCalledOnce();
      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          value,
          text,
        },
      }));
    });
  });

  describe('when menu has multiple options', async () => {

    async function fixtureWithThreeItems() {
      return await fixture(html`
        <dss-menu>
          <dss-menu-item></dss-menu-item>
          <dss-menu-item></dss-menu-item>
          <dss-menu-item></dss-menu-item>
        </dss-menu>
      `);
    }

    test('when user presses "up", focuses on one option up', async () => {
      const menu = await fixtureWithThreeItems();
      const items = screen.getAllByRole('menuitem');

      items[0].focus();

      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      await elementUpdated(menu);

      expect(items[2]).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      await elementUpdated(menu);

      expect(items[1]).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      await elementUpdated(menu);

      expect(items[0]).toHaveFocus();
    });

    test('when user presses "down", focuses on one option down', async () => {
      const menu = await fixtureWithThreeItems();
      const items = screen.getAllByRole('menuitem');

      items[0].focus();

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      await elementUpdated(menu);

      expect(items[1]).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      await elementUpdated(menu);

      expect(items[2]).toHaveFocus();

      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      await elementUpdated(menu);

      expect(items[0]).toHaveFocus();
    });

    test('when user presses "Home", focuses on first option', async () => {
      const menu = await fixtureWithThreeItems();
      const items = screen.getAllByRole('menuitem');

      items[2].focus();

      fireEvent.keyDown(menu, { key: 'Home' });
      await elementUpdated(menu);

      expect(items[0]).toHaveFocus();
    });

    test('when user presses "End", focuses on last option', async () => {
      const menu = await fixtureWithThreeItems();
      const items = screen.getAllByRole('menuitem');

      items[0].focus();

      fireEvent.keyDown(menu, { key: 'End' });
      await elementUpdated(menu);

      expect(items[2]).toHaveFocus();
    });
  });
});
