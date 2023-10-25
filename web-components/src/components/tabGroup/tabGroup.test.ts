import './tabGroup.component';
import '../tab/tab.component';
import { afterEach, beforeEach, describe, expect, SpyInstance, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen, within } from 'shadow-dom-testing-library';
import { fireEvent } from '@testing-library/dom';
import TabGroup, { TabGroupTranslations } from './tabGroup.component';

describe('TabGroup', () => {
  let mockGetBoundingClientRect: SpyInstance;

  beforeEach(() => {
    mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when there are five tabs', () => {
    const activatedSpy = vi.fn();
    const closedSpy = vi.fn();

    async function renderFixtureWithFiveTabs(): Promise<HTMLElementTagNameMap['dss-tab-group']> {
      return fixture(html`
        <div data-testid="tabGroupWrapper">
          <dss-tab-group
            data-testid="testTabGroup"
            .activeTabTitle=${'Tab_5'}
            .tabs=${getTabs(5)}
            @dss-tab-group-tab-select=${activatedSpy}
            @dss-tab-group-tab-close=${closedSpy}
          ></dss-tab-group>
        </div>
      `);
    }

    test('active tab is correctly displayed', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1000 } as DOMRect
      ));

      await renderFixtureWithFiveTabs();

      const tabs = screen.getAllByShadowRole('tab');

      expect(tabs[4]).toHaveClass('active');
    });

    test('when tab selected, fires event with selected tab', async () => {
      await renderFixtureWithFiveTabs();
      const firstTab = screen.getByShadowText('Tab_1');

      firstTab.click();

      expect(activatedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { title: 'Tab_1' } }));
    });

    test('when tab closed, fires event with closed tab', async () => {
      await renderFixtureWithFiveTabs();

      const tabs = screen.getAllByShadowRole('tab');
      within(tabs[0]).getByShadowRole('button').click();

      expect(closedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { title: 'Tab_5' } }));
    });
  });

  describe('when there are folded tabs', () => {
    const listenerSpy = vi.fn();

    async function fixtureWithFoldedTabs(): Promise<HTMLElementTagNameMap['dss-tab-group']> {
      return fixture(html`
        <div data-testid="tabGroupWrapper">
          <dss-tab-group
            data-testid="testTabGroup"
            .activeTabTitle=${'Tab_5'}
            .tabs=${getTabs(10)}
            @dss-tab-group-tab-select=${listenerSpy}
          ></dss-tab-group>
        </div>
      `);
    }

    test('element correctly calculates the number of visible tabs', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1800 } as DOMRect
      ));

      await fixtureWithFoldedTabs();
      const tabGroup = screen.getByTestId('testTabGroup') as TabGroup;

      expect(tabGroup).toHaveProperty('numberOfTabsToShow', 9);
    });

    test('element displays the "More" pseudo-tab', async () => {
      await fixtureWithFoldedTabs();
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1000 } as DOMRect
      ));

      expect(screen.getByShadowText('More', { exact: false })).toBeInTheDocument();
    });

    test('tabs can be navigated-to and selected via keyboard', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1400 } as DOMRect
      ));

      const tabGroup = await fixtureWithFoldedTabs();
      const tabs = screen.getAllByShadowRole('tab');

      const enterKey = 'Enter';

      fireEvent.keyDown(tabs[2], { key: enterKey });
      await elementUpdated(tabGroup);

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { title: 'Tab_3' } }));

      const spaceKey = ' ';

      fireEvent.keyDown(tabs[5], { key: spaceKey });
      await elementUpdated(tabGroup);

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { title: 'Tab_6' } }));
    });

    test('clicking folded tabs makes them visible ', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 800 } as DOMRect
      ));

      const wrappedTabGroup = await fixtureWithFoldedTabs();
      const actualTabGroup = screen.getByTestId('testTabGroup');

      const dropdown = actualTabGroup.shadowRoot!.querySelector('dss-flyout');
      const dropdownTrigger = dropdown!.querySelector('dss-button');
      fireEvent.click(dropdownTrigger!, { detail: 1 });

      await elementUpdated(wrappedTabGroup);

      const menu = dropdown!.querySelector('dss-menu');
      const menuItems = Array.from(menu!.querySelectorAll('dss-menu-item'));
      const sixthTab = menuItems[2].querySelector('dss-tab');
      expect(sixthTab!.shadowRoot!.textContent).toMatch(/Tab_6/);

      fireEvent.click(sixthTab!, { detail: 1 });
      await elementUpdated(wrappedTabGroup);

      const tabList = screen.getByShadowRole('tablist');
      const visibleTabs = Array.from(tabList.querySelectorAll('dss-tab'));

      expect(visibleTabs[0].shadowRoot!.textContent).toMatch(/Tab_6/);
    });

    test('clicked folded tab reports value to its parent', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 800 } as DOMRect
      ));

      await fixtureWithFoldedTabs();
      const targetMenuItem = screen.getByShadowText('Tab_6');
      fireEvent.click(targetMenuItem, { detail: 1 });

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { title: 'Tab_6' } }));
    });
  });

  describe('when setting translations', () => {
    test('shows the translated "More" pseudo-tab', async () => {
      const testTranslations: TabGroupTranslations = {
        more: 'Weitere',
      };
      await fixture(html`
        <div>
          <dss-tab-group
            .tabs=${getTabs(2)}
            .translations=${testTranslations}
          ></dss-tab-group>
        </div>`);

      expect(screen.getByShadowText('Weitere', { exact: false })).toBeInTheDocument();
    });
  });
});

function getTabs(numberOfTabs: number) {
  return [...Array(numberOfTabs).keys()].map(i => {
    return { title: `Tab_${i + 1}` };
  });
}
