import './spinner.component';
import '../icon/icon.component';
import '../tooltip/tooltip.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, test } from 'vitest';
import { screen } from 'shadow-dom-testing-library';
import Spinner from './spinner.component';

describe('Spinner', () => {
  test('when rendered, can be found by role', async () => {
    await fixture(html`
      <dss-spinner></dss-spinner>
    `);

    expect(screen.getByShadowRole('status')).toBeInTheDocument();
  });

  test('when rendered, reflects default properties as attributes', async () => {
    const element: Spinner = await fixture(html`
      <dss-spinner></dss-spinner>
    `);

    expect(element).toHaveAttribute('type', 'primary');
    expect(element).toHaveAttribute('size', 'medium');
    expect(element).toHaveAttribute('thickness', 'thin');
  });

  test('when updating properties, reflects change on attributes', async () => {
    const element: Spinner = await fixture(html`
      <dss-spinner size="small" thickness="thick"></dss-spinner>
    `);
    element.type = 'secondary';
    await elementUpdated(element);

    expect(element).toHaveAttribute('type', 'secondary');
    expect(element).toHaveAttribute('size', 'small');
    expect(element).toHaveAttribute('thickness', 'thick');
  });
});
