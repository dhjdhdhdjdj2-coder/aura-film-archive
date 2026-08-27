'use client';

import { useEffect, type RefObject } from 'react';
import type { MotionMode } from './useMotionPreference';
import { getMotionProfile } from '../lib/motion';

interface AuraMotionOptions {
  mode: MotionMode;
  rootRef: RefObject<HTMLElement | null>;
}

export function useAuraMotion({ mode, rootRef }: AuraMotionOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let cleanupMotion = () => {};

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollModule]) => {
        if (disposed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const media = gsap.matchMedia();
          media.add(
            {
              wide: '(min-width: 760px)',
              systemReduced: '(prefers-reduced-motion: reduce)',
            },
            (mediaContext) => {
              const conditions = mediaContext.conditions as {
                wide: boolean;
                systemReduced: boolean;
              };
              // `mode` already reflects the system preference when no explicit
              // choice is stored. Once chosen, the visible control is authoritative.
              const effectiveMode = mode;
              const profile = getMotionProfile(effectiveMode);

              if (effectiveMode === 'reduced') {
                gsap.set('[data-hero-poster], [data-motion-title], [data-archive-target]', {
                  clearProps: 'transform,opacity',
                });
                return;
              }

              gsap
                .timeline({
                  defaults: { ease: 'none' },
                  scrollTrigger: {
                    trigger: '#top',
                    start: 'top top',
                    end: () => `+=${Math.round(window.innerHeight * 1.25)}`,
                    pin: conditions.wide,
                    pinSpacing: conditions.wide,
                    scrub: conditions.wide ? 0.6 : 0.35,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                })
                .to(
                  '[data-hero-poster]',
                  {
                    yPercent: -8 * profile.cameraTravel,
                    scale: 0.94,
                    opacity: 0.42,
                    duration: profile.chapterDuration,
                  },
                  0,
                )
                .to(
                  '[data-motion-title]',
                  {
                    yPercent: -5 * profile.cameraTravel,
                    opacity: 0.18,
                    duration: profile.chapterDuration,
                  },
                  0,
                );

              gsap.utils.toArray<HTMLElement>('[data-archive-target]').forEach((card) => {
                gsap.fromTo(
                  card,
                  { y: 34, opacity: 0.45 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.72,
                    ease: 'power3.out',
                    scrollTrigger: {
                      trigger: card,
                      start: 'top 88%',
                      once: true,
                    },
                  },
                );
              });
            },
          );

          cleanupMotion = () => media.revert();
        }, root);

        const cleanupMedia = cleanupMotion;
        cleanupMotion = () => {
          cleanupMedia();
          context.revert();
        };
      },
    );

    return () => {
      disposed = true;
      cleanupMotion();
    };
  }, [mode, rootRef]);
}
