import './flyout.component';
import '../icon/icon.component';
import '../input/input.component';
import '../menu/menu.component';
import '../menuItem/menuItem.component';
import '../button/button.component';
import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import Flyout from './flyout.component';
import { fireEvent } from '@testing-library/dom';
import { ActionKeystrokes } from '../../internals/baseElement/baseElement';

describe('Flyout', () => {
  describe('with a menu item', () => {
    const text = 'MenuItem';

    async function fixtureWithOneMenuItem() {
      return await fixture(html`
        <dss-flyout>
          <dss-button slot="trigger">
            flyout
          </dss-button>
          <dss-menu>
            <dss-menu-item value=${text}>${text}</dss-menu-item>
          </dss-menu>
        </dss-flyout>
      `) as HTMLElementTagNameMap['dss-flyout'];
    }

    test('renders menu item', async () => {
      const element = await fixtureWithOneMenuItem() as Flyout;
      await elementUpdated(element);

      expect(screen.getByShadowText(text, { exact: false })).toBeInTheDocument();
    });

    test('aria-expanded tracks floating element "active"', async () => {
      const element = await fixtureWithOneMenuItem();
      expect(element).not.toHaveAttribute('aria-expanded');

      screen.getByShadowRole('button').click();
      await elementUpdated(element);

      expect(element).toHaveAttribute('aria-expanded');

      screen.getByShadowRole('button').click();
      await elementUpdated(element);

      expect(element).not.toHaveAttribute('aria-expanded');
    });

    test('when pressing Escape, floating element gets hidden', async () => {
      const element = await fixtureWithOneMenuItem();

      screen.getByShadowRole('button').click();
      await elementUpdated(element);
      expect(element).toHaveAttribute('aria-expanded');

      fireEvent.keyUp(element, { key: 'Escape' });
      await elementUpdated(element);

      expect(element).not.toHaveAttribute('aria-expanded');
    });

    test.each(ActionKeystrokes)('when user presses key "%s" on dropdown trigger, toggles flyout', async (key) => {
      const element = await fixtureWithOneMenuItem();

      const trigger = screen.getByShadowRole('button');
      expect(element).not.toHaveAttribute('aria-expanded');

      fireEvent.keyDown(trigger, { key });
      await elementUpdated(element);

      expect(element).toHaveAttribute('aria-expanded');

      fireEvent.keyDown(trigger, { key });
      await elementUpdated(element);

      expect(element).not.toHaveAttribute('aria-expanded');
    });
  });
});
