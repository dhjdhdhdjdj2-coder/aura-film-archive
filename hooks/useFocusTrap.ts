import { useEffect, type RefObject } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusable = () =>
      [...container.querySelectorAll<HTMLElement>(focusableSelector)].filter(
        (element) => !element.hidden && element.tabIndex !== -1,
      );
    focusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [containerRef, onEscape]);
}
