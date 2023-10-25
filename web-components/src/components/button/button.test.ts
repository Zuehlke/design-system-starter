import './button.component';
import '../icon/icon.component';
import '../tooltip/tooltip.component';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, test, vi } from 'vitest';
import { screen } from 'shadow-dom-testing-library';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('Button', () => {
  test('renders slotted nodes', async () => {
    await fixture(html`
      <dss-button>Button Text</dss-button>`);

    const button = screen.getByShadowRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByShadowText('Button Text')).toBeInTheDocument();
  });

  test('renders complex slotted nodes', async () => {
    await fixture(html`
      <dss-button type="primary">
        <dss-icon icon="add-sm"></dss-icon>
      </dss-button>`);

    const button = screen.getByShadowRole('button');
    expect(button).toBeInTheDocument();

    const slottedNodes = button.querySelector('slot')!.assignedElements();
    expect(slottedNodes).toHaveLength(1);
    expect(slottedNodes[0].tagName).toBe('DSS-ICON');
  });

  test('when icon-only and user hovers, renders tooltip', async () => {
    const element = await fixture(html`
      <dss-button type="icon-only" tooltip="Go to start">
        <dss-icon icon="chevron-left"></dss-icon>
      </dss-button>`);

    const button = screen.getByShadowRole('button');

    expect(button).not.toHaveAttribute('aria-expanded');
    fireEvent.mouseEnter(button);
    await elementUpdated(element);
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'));

    fireEvent.mouseLeave(button);
    await elementUpdated(element);
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
  });

  test('when button is of type "icon-only", renders with correct spacing and type', async () => {
    await fixture(
      html`
        <dss-button type="icon-only">
          <dss-icon icon="add-sm"></dss-icon>
        </dss-button>`,
    );
    expect(screen.getByShadowRole('button')).toHaveClass('spacing-icon-only');
  });

  test('when button is disabled and user clicks slotted content, does not emit events', async () => {
    const spy = vi.fn();
    await fixture(html`
      <dss-button type="icon-only" tooltip="Go to start" @click="${spy}" disabled>
        <dss-icon icon="chevron-left" data-testid="icon"></dss-icon>
      </dss-button>`);

    const icon = screen.getByTestId('icon');

    fireEvent.click(icon);

    expect(spy).not.toHaveBeenCalled();
  });
});
