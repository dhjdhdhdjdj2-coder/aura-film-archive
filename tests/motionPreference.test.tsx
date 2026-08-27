import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { MOTION, getMotionProfile } from '../lib/motion';
import { MOTION_BOOTSTRAP_SCRIPT } from '../lib/motionBootstrap';

describe('motion profiles', () => {
  it('uses one canonical duration scale', () => {
    expect(MOTION).toEqual({
      micro: 0.14,
      control: 0.22,
      poster: 0.32,
      dialog: 0.72,
      chapter: 1.1,
      ambient: 18,
    });
  });

  it('removes camera and parallax motion in reduced mode', () => {
    expect(getMotionProfile('reduced')).toEqual({
      chapterDuration: 0.16,
      cameraTravel: 0,
      pointerParallax: 0,
      ambient: false,
    });
  });
});

describe('useMotionPreference', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.motion;
  });

  it('persists an explicit reduced-motion choice', () => {
    const { result } = renderHook(() => useMotionPreference());

    act(() => result.current.setMode('reduced'));

    expect(result.current.mode).toBe('reduced');
    expect(localStorage.getItem('aura-motion')).toBe('reduced');
    expect(document.documentElement.dataset.motion).toBe('reduced');
  });

  it('hydrates browser preference after the SSR-safe full initial state', async () => {
    localStorage.setItem('aura-motion', 'reduced');
    document.documentElement.dataset.motion = 'reduced';
    const { result } = renderHook(() => useMotionPreference());

    expect(document.documentElement.dataset.motion).toBe('reduced');
    await waitFor(() => expect(result.current.mode).toBe('reduced'));
  });

  it('uses the system preference before paint when storage access is denied', () => {
    const read = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    new Function(MOTION_BOOTSTRAP_SCRIPT)();

    expect(document.documentElement.dataset.motion).toBe('reduced');
    read.mockRestore();
    vi.unstubAllGlobals();
  });

  it('keeps an explicit choice when the system preference changes', async () => {
    let onChange: (() => void) | undefined;
    const query = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: (_type: string, handler: () => void) => {
        onChange = handler;
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.stubGlobal('matchMedia', vi.fn(() => query));
    localStorage.setItem('aura-motion', 'reduced');
    const { result } = renderHook(() => useMotionPreference());
    await waitFor(() => expect(result.current.mode).toBe('reduced'));

    act(() => onChange?.());

    expect(result.current.mode).toBe('reduced');
    vi.unstubAllGlobals();
  });

  it('falls back without crashing when browser storage is restricted', () => {
    const read = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    const write = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });

    const { result } = renderHook(() => useMotionPreference());
    act(() => result.current.setMode('reduced'));

    expect(result.current.mode).toBe('reduced');
    read.mockRestore();
    write.mockRestore();
  });
});
