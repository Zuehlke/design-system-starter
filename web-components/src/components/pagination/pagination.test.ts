import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import './pagination.component';
import { PAGINATION_COUNT } from './pagination.component';

describe('Pagination', () => {

  test('when has only one page, displays page and disabled controls', async () => {
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination .pageCount=${1}></dss-pagination>
    `);

    const buttons = getArrowControls(element);
    expect(buttons).toHaveLength(4);
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
    expect(screen.getByShadowText('1')).toBeInTheDocument();
    expect(buttons[2].disabled).toBe(true);
    expect(buttons[3].disabled).toBe(true);
  });

  test('handles clicks on next/previous correctly per default', async () => {
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination .pageCount=${PAGINATION_COUNT}></dss-pagination>
    `);

    const buttons = getArrowControls(element);
    expect(screen.getByShadowText('1')).toHaveClass('active-page');
    buttons[2].click();
    await elementUpdated(element);

    expect(screen.getByShadowText('2')).toHaveClass('active-page');
    expect(screen.getByShadowText('1')).not.toHaveClass('active-page');
    buttons[1].click();
    await elementUpdated(element);

    expect(screen.getByShadowText('1')).toHaveClass('active-page');
    expect(screen.getByShadowText('2')).not.toHaveClass('active-page');
  });

  test('handles clicks on first/last correctly per default', async () => {
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination .pageCount=${PAGINATION_COUNT + 2}></dss-pagination>
    `);

    const buttons = getArrowControls(element);
    expect(screen.getByShadowText('1')).toHaveClass('active-page');
    buttons[3].click();
    await elementUpdated(element);

    expect(screen.getByShadowText('7')).toHaveClass('active-page');
    expect(screen.queryByShadowText('1')).not.toBeInTheDocument();
    buttons[0].click();
    await elementUpdated(element);

    expect(screen.getByShadowText('1')).toHaveClass('active-page');
    expect(screen.queryByShadowText('7')).not.toBeInTheDocument();
  });

  test('when selecting page directly, shifts page view correctly', async () => {
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination .pageCount=${PAGINATION_COUNT + 4}></dss-pagination>
    `);

    screen.getAllByShadowRole('button')[3].click();
    await elementUpdated(element);

    expect(screen.queryByShadowText('1')).not.toBeInTheDocument();
    expect(screen.queryByShadowText('2')).toBeInTheDocument();
    expect(screen.queryByShadowText('3')).toBeInTheDocument();
    expect(screen.queryByShadowText('4')).toHaveClass('active-page');
    expect(screen.queryByShadowText('5')).toBeInTheDocument();
    expect(screen.queryByShadowText('6')).toBeInTheDocument();
    expect(screen.queryByShadowText('7')).not.toBeInTheDocument();
  });

  test('when overwriting default functions, new functions are called correctly', async () => {
    const firstPageSpy = vi.fn();
    const previousPageSpy = vi.fn();
    const nextPageSpy = vi.fn();
    const lastPageSpy = vi.fn();
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination
        .pageCount=${PAGINATION_COUNT}
        .firstPage=${firstPageSpy}
        .previousPage=${previousPageSpy}
        .nextPage=${nextPageSpy}
        .lastPage=${lastPageSpy}
      ></dss-pagination>
    `);

    screen.getAllByShadowRole('button')[2].click();
    await elementUpdated(element);

    const buttons = getArrowControls(element);
    buttons[0].click();
    expect(firstPageSpy).toHaveBeenCalledOnce();
    buttons[1].click();
    expect(previousPageSpy).toHaveBeenCalledOnce();
    buttons[2].click();
    expect(nextPageSpy).toHaveBeenCalledOnce();
    buttons[3].click();
    expect(lastPageSpy).toHaveBeenCalledOnce();
  });

  test('when overwriting default check, new functions are evaluated correctly', async () => {
    const canGetPreviousPageSpy = vi.fn().mockImplementation(() => false);
    const canGetNextPageSpy = vi.fn().mockImplementation(() => false);
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination
        .pageCount=${PAGINATION_COUNT}
        .canGetPreviousPage=${canGetPreviousPageSpy}
        .canGetNextPage=${canGetNextPageSpy}
      ></dss-pagination>
    `);

    screen.getAllByShadowRole('button')[2].click();
    await elementUpdated(element);

    const buttons = getArrowControls(element);
    expect(buttons[1].disabled).toBe(true);
    expect(buttons[2].disabled).toBe(true);
  });

  test('when selecting page, fires page-index-selected event', async () => {
    const pageIndexSelectedSpy = vi.fn();
    await fixture(html`
      <dss-pagination
        .pageCount=${2}
        @dss-pagination-page-index-selected=${pageIndexSelectedSpy as any}
      ></dss-pagination>
    `);

    screen.getAllByShadowRole('button')[1].click();

    expect(pageIndexSelectedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 1 }));
  });

  test('when navigation through pages, fires page-index-selected event', async () => {
    const pageIndexSelectedSpy = vi.fn();
    const element: HTMLElementTagNameMap['dss-pagination'] = await fixture(html`
      <dss-pagination
        .pageCount=${PAGINATION_COUNT}
        @dss-pagination-page-index-selected=${pageIndexSelectedSpy as any}
      ></dss-pagination>
    `);

    const buttons = getArrowControls(element);

    buttons[2].click();
    expect(pageIndexSelectedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 1 }));

    buttons[3].click();
    expect(pageIndexSelectedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 4 }));

    buttons[1].click();
    expect(pageIndexSelectedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 3 }));

    buttons[0].click();
    expect(pageIndexSelectedSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 0 }));
  });

  const getArrowControls = (element: HTMLElementTagNameMap['dss-pagination']) => {
    return element.shadowRoot!.querySelectorAll('dss-button') as NodeListOf<HTMLElementTagNameMap['dss-button']>;
  };
});
