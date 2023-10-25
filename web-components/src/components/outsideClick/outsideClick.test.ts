import './outsideClick.component';
import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { fireEvent } from '@testing-library/dom';

describe('OutsideClick', () => {
  test('applies handler on click outside (but not inside) itself event', async () => {

    const listenerSpy = vi.fn();
    const element: HTMLElementTagNameMap['dss-outside-click'] = await fixture(html`
      <div>
        <dss-outside-click .onOutsideClick=${listenerSpy}>
          <div>Content</div>
        </dss-outside-click>
      </div>
    `);

    const inside = element.querySelector('div');
    fireEvent.click(inside!);
    expect(listenerSpy).not.toHaveBeenCalled();

    fireEvent.click(element);
    expect(listenerSpy).toHaveBeenCalledOnce();

    fireEvent.click(window);
    expect(listenerSpy).toHaveBeenCalledTimes(2);
  });

  test('registers / unregisters listeners on connect / disconnect', async () => {

    const addMetaSpy = vi.spyOn(window, 'addEventListener');
    const removeMetaSpy = vi.spyOn(window, 'removeEventListener');

    const element: HTMLElementTagNameMap['dss-outside-click'] = await fixture(html`
      <dss-outside-click .onOutsideClick=${() => console.log('Outside click handle')}>
        <div>Content</div>
      </dss-outside-click>
    `);

    expect(addMetaSpy).toHaveBeenCalledOnce();
    element.remove();
    expect(removeMetaSpy).toHaveBeenCalledOnce();
  });
});
