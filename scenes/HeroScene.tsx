'use client';

import { useEffect, useRef } from 'react';
import type { RenderTier } from '../lib/renderTier';
import { createPosterScene } from './createPosterScene';

interface HeroSceneProps {
  tier: Exclude<RenderTier, 'static'>;
  posters: readonly string[];
  reducedMotion: boolean;
  onContextLoss?: () => void;
}

export default function HeroScene({
  tier,
  posters,
  reducedMotion,
  onContextLoss,
}: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = createPosterScene(canvas, {
      tier,
      posters,
      reducedMotion,
      onContextLoss,
    });
    let visible = true;

    const syncRunning = () => {
      controller.setRunning(
        !reducedMotion && visible && document.visibilityState === 'visible',
      );
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      controller.resize(rect.width, rect.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      syncRunning();
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', syncRunning);
    resize();
    syncRunning();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncRunning);
      controller.dispose();
    };
  }, [onContextLoss, posters, reducedMotion, tier]);

  return <canvas ref={canvasRef} data-tier={tier} aria-hidden="true" />;
}
