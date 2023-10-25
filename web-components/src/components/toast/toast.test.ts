import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import './toast.component';

describe('toast', () => {
  test('when no state given, defaults to info', async () => {
    await fixture(html`
      <dss-toast></dss-toast>
    `);

    expect(screen.getByShadowRole('alert')).toHaveClass('info');
  });

  test('when state error given, maps to error', async () => {
    await fixture(html`
      <dss-toast type="error"></dss-toast>
    `);

    expect(screen.getByShadowRole('alert')).toHaveClass('error');
  });

  test('when state warning given, maps to warning', async () => {
    await fixture(html`
      <dss-toast type="warning"></dss-toast>
    `);

    expect(screen.getByShadowRole('alert')).toHaveClass('warning');
  });

  test('when heading given, shows in element', async () => {
    await fixture(html`
      <dss-toast heading="Test Header"></dss-toast>
    `);

    expect(screen.queryByShadowText('Test Header')).toBeInTheDocument();
  });

  test('when message given, shows in element', async () => {
    await fixture(html`
      <dss-toast message="Test Message"></dss-toast>
    `);

    expect(screen.queryByShadowText('Test Message')).toBeInTheDocument();
  });

  test('when closable, throws event on click', async () => {
    const spy = vi.fn();
    await fixture(html`
      <dss-toast .closable=${true} @dss-toast-closed=${spy}></dss-toast>
    `);

    screen.getByShadowRole('button').click();

    expect(spy).toHaveBeenCalledOnce();
  });
});
