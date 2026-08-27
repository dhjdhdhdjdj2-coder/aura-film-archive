import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';

expect.extend({ toHaveNoViolations });

afterEach(cleanup);

const storage = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return storage.size;
  },
  clear: () => storage.clear(),
  getItem: (key) => storage.get(key) ?? null,
  key: (index) => [...storage.keys()][index] ?? null,
  removeItem: (key) => storage.delete(key),
  setItem: (key, value) => storage.set(key, String(value)),
};

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  }),
});
