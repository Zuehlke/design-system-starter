import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import './tooltip.component';
import { fireEvent } from '@testing-library/dom';
import { screen } from 'shadow-dom-testing-library';

describe('Tooltip', () => {

  const triggerTestId = 'trigger';

  const simpleFixture = async () => await fixture(html`
    <dss-tooltip>
      <div slot="trigger" data-testid="${triggerTestId}">Test Hover</div>
    </dss-tooltip>
  `) as HTMLElementTagNameMap['dss-tooltip'];

  test('when hovering, toggles active property on slotted element', async () => {
    const element = await simpleFixture();

    const trigger = screen.getByTestId(triggerTestId);
    const floatingElement = element.shadowRoot!.querySelector('dss-floating')!;

    fireEvent.mouseEnter(trigger);
    await elementUpdated(element);

    expect(floatingElement).toHaveAttribute('active');

    fireEvent.mouseLeave(trigger);
    await elementUpdated(element);

    expect(floatingElement).not.toHaveAttribute('active');
  });

  test('when trigger slot changes, moves handlers to new slot element', async () => {
    const element = await simpleFixture();

    const oldTrigger = screen.getByShadowTestId(triggerTestId);
    const newTrigger = document.createElement('span');
    newTrigger.slot = 'trigger';
    oldTrigger.replaceWith(newTrigger);
    await elementUpdated(element);

    fireEvent.focus(oldTrigger);
    await elementUpdated(element);

    const floatingElement = element.shadowRoot!.querySelector('dss-floating')!;
    expect(floatingElement).not.toHaveAttribute('active');

    fireEvent.focus(newTrigger);
    await elementUpdated(element);
    expect(floatingElement).toHaveAttribute('active');
  });

  test('when given content, renders it', async () => {
    const element: HTMLElementTagNameMap['dss-tooltip'] = await fixture(html`
      <dss-tooltip>
        <div slot="trigger">Test Hover</div>
        <h1>Tooltip Title</h1>
      </dss-tooltip>
    `);

    expect(element).toHaveTextContent('Tooltip Title');
  });
});
