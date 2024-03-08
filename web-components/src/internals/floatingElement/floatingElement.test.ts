import { describe, expect, test } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import './floatingElement';

describe('FloatingElement', () => {
  const fixtureWithDivAnchor = async () => {
    return await fixture(html`
      <dss-floating placement="right">
        <div slot="anchor">Test Hover</div>
      </dss-floating>
    `) as HTMLElementTagNameMap['dss-floating'];
  };

  test('when active, should set show attribute on slotted element accordingly', async () => {
    const element = await fixtureWithDivAnchor();

    const content = element.shadowRoot!.querySelector('.floating')!;
    expect(content).not.toHaveAttribute('data-show');

    element.active = true;
    await elementUpdated(element);

    expect(content).toHaveAttribute('data-show');

    element.active = false;
    await elementUpdated(element);

    expect(content).not.toHaveAttribute('data-show');
  });

  test('should render content given in the unnamed slot', async () => {
    const element: HTMLElementTagNameMap['dss-floating'] = await fixture(html`
      <dss-floating>
        <div slot="anchor">Test Hover</div>
        <h1>Tooltip Title</h1>
      </dss-floating>
    `);

    expect(element.querySelector('h1')).toHaveTextContent('Tooltip Title');
  });

  test('when using arrow attribute, attribute is reactive', async () => {
    const element = await fixtureWithDivAnchor();

    element.arrow = false;
    await elementUpdated(element);
    expect(element.shadowRoot!.querySelector('.arrow')).toBeNull();

    element.arrow = true;
    await elementUpdated(element);
    expect(element.shadowRoot!.querySelector('.arrow')).not.toBeNull();

    element.arrow = false;
    await elementUpdated(element);
    expect(element.shadowRoot!.querySelector('.arrow')).toBeNull();
  });
});
