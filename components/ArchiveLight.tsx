'use client';

import { useEffect, useRef } from 'react';
import type { MotionMode } from '../hooks/useMotionPreference';
import styles from './ArchiveLight.module.css';

interface ArchiveLightProps {
  mode: MotionMode;
}

function archiveTarget(node: EventTarget | null) {
  return node instanceof Element
    ? (node.closest('[data-archive-target]') as HTMLElement | null)
    : null;
}

export function ArchiveLight({ mode }: ArchiveLightProps) {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    let disposed = false;
    let cleanup = () => {};

    void import('gsap').then(({ gsap }) => {
      if (disposed) return;

      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      const duration = mode === 'reduced' ? 0 : 0.1;
      const xTo = gsap.quickTo(light, '--light-x', {
        duration,
        ease: 'power2.out',
      });
      const yTo = gsap.quickTo(light, '--light-y', {
        duration,
        ease: 'power2.out',
      });
      let activeTarget: HTMLElement | null = null;

      const moveTo = (x: number, y: number) => {
        xTo(x);
        yTo(y);
      };

      const clearTarget = () => {
        activeTarget?.removeAttribute('data-light-active');
        activeTarget = null;
        light.removeAttribute('data-active');
      };

      const activate = (target: HTMLElement, x?: number, y?: number) => {
        if (activeTarget !== target) {
          activeTarget?.removeAttribute('data-light-active');
          activeTarget = target;
          target.setAttribute('data-light-active', 'true');
        }
        const rect = target.getBoundingClientRect();
        const snap = mode === 'reduced' || coarse || x === undefined || y === undefined;
        moveTo(snap ? rect.left + rect.width / 2 : x, snap ? rect.top + rect.height / 2 : y);
        light.setAttribute('data-active', 'true');
      };

      const onPointerMove = (event: PointerEvent) => {
        if (coarse) return;
        const target = archiveTarget(event.target);
        if (target) activate(target, event.clientX, event.clientY);
      };
      const onPointerOver = (event: PointerEvent) => {
        const target = archiveTarget(event.target);
        if (target) activate(target, event.clientX, event.clientY);
      };
      const onPointerOut = (event: PointerEvent) => {
        if (!activeTarget) return;
        const related = event.relatedTarget;
        if (related instanceof Node && activeTarget.contains(related)) return;
        if (!activeTarget.contains(document.activeElement)) clearTarget();
      };
      const onPointerDown = (event: PointerEvent) => {
        if (!coarse) return;
        const target = archiveTarget(event.target);
        if (target) activate(target);
      };
      const onPointerUp = () => {
        if (coarse && !activeTarget?.contains(document.activeElement)) clearTarget();
      };
      const onFocusIn = (event: FocusEvent) => {
        const target = archiveTarget(event.target);
        if (target) activate(target);
      };
      const onFocusOut = (event: FocusEvent) => {
        if (!activeTarget) return;
        const related = event.relatedTarget;
        if (!(related instanceof Node) || !activeTarget.contains(related)) clearTarget();
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerover', onPointerOver, { passive: true });
      document.addEventListener('pointerout', onPointerOut, { passive: true });
      document.addEventListener('pointerdown', onPointerDown, { passive: true });
      document.addEventListener('pointerup', onPointerUp, { passive: true });
      document.addEventListener('focusin', onFocusIn);
      document.addEventListener('focusout', onFocusOut);

      cleanup = () => {
        clearTarget();
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerover', onPointerOver);
        document.removeEventListener('pointerout', onPointerOut);
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('focusin', onFocusIn);
        document.removeEventListener('focusout', onFocusOut);
        xTo.tween.kill();
        yTo.tween.kill();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mode]);

  return <div ref={lightRef} className={styles.light} aria-hidden="true" />;
}
