import { describe, expect, test, vi } from 'vitest';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import userEvent from '@testing-library/user-event';
import { screen } from 'shadow-dom-testing-library';
import './draggable.component';

describe('Draggable', () => {
  test('when element slotted, makes it draggable', async () => {
    await fixture(html`
      <dss-draggable>
        <div>Moving Div</div>
      </dss-draggable>
    `);
    await vi.dynamicImportSettled();

    const div = screen.getByShadowText('Moving Div');
    await userEvent.click(div);

    expect(div).toHaveClass('neodrag', 'neodrag-dragged');
  });
});