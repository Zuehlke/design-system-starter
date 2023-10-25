import './tab.component';
import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';

describe('Tab', () => {

  describe('when the tab is not explicitly active', () => {
    const listenerSpy = vi.fn();
    const tabFixture = async () => await fixture(html`
      <dss-tab
        .title=${'Example'}
        @dss-tab-close=${(event: CustomEvent) => listenerSpy(event)}
      ></dss-tab>
    `);

    test('click on close button triggers tab close event with correct payload', async () => {
      await tabFixture();

      const closeButton = screen.getByShadowRole('button');
      closeButton.click();

      expect(listenerSpy).toHaveBeenCalledWith(expect.objectContaining({
        detail: 'Example',
      }));
    });

    test('does not display active CSS class', async () => {
      await tabFixture();

      const tab = screen.getByShadowRole('tab');

      expect(tab).toHaveClass('basic-tab');
      expect(tab).not.toHaveClass('active');
    });


  });

  describe('when the tab is explicitly active', () => {
    const listenerSpy = vi.fn();
    const tabFixture = async () => await fixture(html`
      <dss-tab
        .title=${'Example'}
        .isActive=${true}
        @dss-tab-close=${(event: CustomEvent) => listenerSpy(event)}
      ></dss-tab>
    `);

    test('displays active CSS class', async () => {
      await tabFixture();

      const tab = screen.getByShadowRole('tab');

      expect(tab).toHaveClass('active');
    });
  });

});