import { describe, expect, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import './chart.component';
import Chart from './chart.component';

describe('Chart', () => {
  test('renders labels, when series given', async () => {
    const series: Chart['series'] = [{
      type: 'bar',
      data: [
        ['Stocks', 17],
        ['Funds', 11],
        ['Accounts', 7],
      ],
    }];
    await fixture(html`
      <dss-chart .series="${series}"></dss-chart>
    `);
    await vi.dynamicImportSettled();

    expect(screen.getByShadowText('Stocks')).toBeInTheDocument();
    expect(screen.getByShadowText('Funds')).toBeInTheDocument();
    expect(screen.getByShadowText('Accounts')).toBeInTheDocument();
  });

  test('renders chart, when given after initial render', async () => {
    const element: Chart = await fixture(html`
      <dss-chart></dss-chart>
    `);
    element.series = [{
      type: 'bar',
      data: [
        ['Precious metals', 15],
        ['High Yield', 1],
      ],
    }];
    await elementUpdated(element);
    await vi.dynamicImportSettled();

    expect(screen.getByShadowText('Precious metals')).toBeInTheDocument();
    expect(screen.getByShadowText('High Yield')).toBeInTheDocument;
  });

  test('updates chart, when changing property', async () => {
    const series: Chart['series'] = [{
      type: 'pie',
      data: [
        ['a 33.0%', 33],
        ['b 33.0%', 33],
        ['c 34.0%', 34],
      ],
    }];
    const element: Chart = await fixture(html`
      <dss-chart .series="${series}"></dss-chart>
    `);
    await vi.dynamicImportSettled();

    expect(screen.getByShadowText('a 33.0%')).toBeInTheDocument();
    expect(screen.getByShadowText('b 33.0%')).toBeInTheDocument();
    expect(screen.getByShadowText('c 34.0%')).toBeInTheDocument();

    element.series = [{
      type: 'pie',
      data: [
        ['test 100.0%', 100],
      ],
    }];
    await elementUpdated(element);


    expect(screen.getByShadowText('test 100.0%')).toBeInTheDocument();
  });
});