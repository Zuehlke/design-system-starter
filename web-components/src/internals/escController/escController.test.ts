import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Closable } from './closable';
import { deregisterOpenComponent, registerOpenComponent } from './escController';
import { fireEvent } from '@testing-library/dom';

describe('escController', () => {
  let closable: Closable;

  beforeEach(() => {
    closable = {
      close: vi.fn(),
    };
  });

  afterEach(() => {
    deregisterOpenComponent(closable);
  });

  test('when registered and Escape pressed, calls close', () => {
    registerOpenComponent(closable);

    fireEvent.keyUp(document.body, { key: 'Escape' });

    expect(closable.close).toHaveBeenCalledOnce();
  });

  test('when deregistered and Escape pressed, does not call close anymore', () => {
    registerOpenComponent(closable);

    fireEvent.keyUp(document.body, { key: 'Escape' });
    expect(closable.close).toHaveBeenCalledOnce();
    deregisterOpenComponent(closable);

    fireEvent.keyUp(document.body, { key: 'Escape' });
    expect(closable.close).toHaveBeenCalledOnce();
  });
});
