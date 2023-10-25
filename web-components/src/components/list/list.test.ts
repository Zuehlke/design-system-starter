import { describe, expect, test } from 'vitest';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit-html';
import { screen } from 'shadow-dom-testing-library';
import './list.component';
import { fireEvent } from '@testing-library/dom';

describe('Sortable List', () => {
  test('when div "Datum" is dragged over div "Eingang", order of divs changes', async () => {
    await fixture(html`
      <dss-list data-testId="list" class="list">
        <div draggable="true">
          Datum
        </div>
        <div draggable="true">
          Geschäftsart
        </div>
        <div draggable="true">
          Eingang
        </div>
        <div draggable="true">
          Ausgang
        </div>
      </dss-list>
    `);

    const list = screen.getByShadowTestId('list');
    let children = Array.from(list.children);
    const item1 = screen.getByText('Datum');
    const item3 = screen.getByText('Eingang');

    expect(children[0]).toBe(item1);

    fireEvent.dragStart(item1);
    fireEvent.dragEnter(item3);

    children = Array.from(list.children);
    expect(children[2]).toBe(item1);
  });
});
