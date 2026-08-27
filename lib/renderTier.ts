export interface RenderCapability {
  webgl2: boolean;
  majorCaveat: boolean;
  averageFrameMs: number;
  contextLosses: number;
}

export type RenderTier = 'full' | 'lite' | 'static';

export function averageFrameDuration(timestamps: readonly number[]): number {
  if (timestamps.length < 2) return 0;
  const duration = timestamps[timestamps.length - 1] - timestamps[0];
  return Math.round((duration / (timestamps.length - 1)) * 100) / 100;
}

export function sampleAverageFrameMs(sampleCount = 18): Promise<number> {
  if (typeof requestAnimationFrame !== 'function') return Promise.resolve(0);

  return new Promise((resolve) => {
    const timestamps: number[] = [];
    const sample = (time: number) => {
      timestamps.push(time);
      if (timestamps.length >= sampleCount) {
        resolve(averageFrameDuration(timestamps));
      } else {
        requestAnimationFrame(sample);
      }
    };
    requestAnimationFrame(sample);
  });
}

export function resolveRenderTier(input: RenderCapability): RenderTier {
  if (!input.webgl2 || input.contextLosses >= 2) return 'static';
  if (
    input.contextLosses === 1 ||
    input.majorCaveat ||
    input.averageFrameMs > 22
  ) {
    return 'lite';
  }
  return 'full';
}

export function detectInitialRenderTier(): RenderTier {
  if (typeof window === 'undefined' || !('WebGL2RenderingContext' in window)) {
    return 'static';
  }

  try {
    const canvas = document.createElement('canvas');
    const strict = canvas.getContext('webgl2', {
      failIfMajorPerformanceCaveat: true,
    });
    const fallback = strict ?? canvas.getContext('webgl2');
    return resolveRenderTier({
      webgl2: Boolean(fallback),
      majorCaveat: !strict && Boolean(fallback),
      averageFrameMs: 16,
      contextLosses: 0,
    });
  } catch {
    return 'static';
  }
}
