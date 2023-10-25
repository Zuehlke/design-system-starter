import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import userEvent from '@testing-library/user-event';
import './overlay.component';
import Overlay from './overlay.component';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('overlay', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation((): MediaQueryList => {
      return {
        'matches': false,
      } as MediaQueryList;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('when passed header, displays it', async () => {
    await fixture(html`
      <dss-overlay header="Test Header"></dss-overlay>
    `);

    expect(screen.getByShadowText('Test Header')).toBeInTheDocument();
  });

  test('when not passed a header, does not display close button', async () => {
    await fixture(html`
      <dss-overlay></dss-overlay>
    `);

    expect(screen.queryByShadowRole('button')).not.toBeInTheDocument();
  });

  test('when button clicked, emits overlay closed event', async () => {
    const closeSpy = vi.fn();
    await fixture(html`
      <dss-overlay header="Test Header" .show="${true}" @dss-overlay-closed=${closeSpy}></dss-overlay>
    `);

    const user = userEvent.setup();
    await user.click(screen.getByShadowRole('button'));

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  test('when overlay opens, it emits overlay opened event', async () => {
    const openSpy = vi.fn();
    const overlay: Overlay = await fixture(html`
      <dss-overlay header="Test Header" @dss-overlay-opened=${openSpy}></dss-overlay>
    `);

    overlay.show = true;
    await elementUpdated(overlay);

    /*JSDOM doesn't support TransitionEvent
    * https://github.com/jsdom/jsdom/issues/1781
    * */
    const customEvent = new Event('transitionend');
    Object.defineProperty(customEvent, 'propertyName', { value: 'visibility' });
    fireEvent(screen.getByShadowRole('dialog'), customEvent);

    expect(openSpy).toHaveBeenCalledOnce();
  });

  test('when browser `prefers-reduced-motion:reduce` is applied, emits custom event on open', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((): MediaQueryList => {
      return {
        'matches': true,
      } as MediaQueryList;
    });

    const openSpy = vi.fn();
    const overlay: Overlay = await fixture(html`
      <dss-overlay header="Test Header" @dss-overlay-opened=${openSpy}></dss-overlay>
    `);

    overlay.show = true;
    await elementUpdated(overlay);

    await waitFor(() => expect(openSpy).toHaveBeenCalledOnce());
  });
});
