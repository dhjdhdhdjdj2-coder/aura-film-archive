import { useCallback, useEffect, useRef, useState } from 'react';

export type MotionMode = 'full' | 'reduced';

const STORAGE_KEY = 'aura-motion';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function readStoredMode(): MotionMode | null {
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    return stored === 'full' || stored === 'reduced' ? stored : null;
  } catch {
    return null;
  }
}

function readSystemMode(): MotionMode {
  try {
    return window.matchMedia?.(REDUCED_QUERY).matches ? 'reduced' : 'full';
  } catch {
    return 'full';
  }
}

function saveMode(mode: MotionMode) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage is optional; the current session still receives the preference.
  }
}

function readBrowserMode(): MotionMode {
  return readStoredMode() ?? readSystemMode();
}

export function useMotionPreference() {
  // `full` is deterministic on the server and during the hydration pass.
  const [mode, updateMode] = useState<MotionMode>('full');
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) return;
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const browserMode = readBrowserMode();
      hydrated.current = true;
      document.documentElement.dataset.motion = browserMode;
      updateMode(browserMode);
    });

    let query: MediaQueryList | undefined;
    try {
      query = window.matchMedia?.(REDUCED_QUERY);
    } catch {
      return () => {
        cancelled = true;
      };
    }
    if (!query) return;

    const syncWithSystem = () => {
      if (readStoredMode()) return;
      updateMode(query.matches ? 'reduced' : 'full');
    };

    query.addEventListener('change', syncWithSystem);
    return () => {
      cancelled = true;
      query.removeEventListener('change', syncWithSystem);
    };
  }, []);

  const setMode = useCallback((next: MotionMode) => {
    hydrated.current = true;
    saveMode(next);
    document.documentElement.dataset.motion = next;
    updateMode(next);
  }, []);

  return { mode, setMode };
}
