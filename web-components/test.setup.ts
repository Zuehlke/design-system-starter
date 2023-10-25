import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { fixtureCleanup } from '@open-wc/testing-helpers';
import 'element-internals-polyfill';

afterEach(() => {
  fixtureCleanup();
});


class ResizeObserver {
  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
}

window.ResizeObserver = ResizeObserver;

const intersectionObserver = vi.fn();
intersectionObserver.mockReturnValue({
  observe() {
  },
  unobserve() {
  },
  disconnect() {
  },
});

window.IntersectionObserver = intersectionObserver;