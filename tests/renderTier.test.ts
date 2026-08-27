import { describe, expect, it } from 'vitest';
import { averageFrameDuration, resolveRenderTier } from '../lib/renderTier';

describe('resolveRenderTier', () => {
  it('uses static rendering when WebGL 2 is unavailable or repeatedly lost', () => {
    expect(
      resolveRenderTier({
        webgl2: false,
        majorCaveat: false,
        averageFrameMs: 0,
        contextLosses: 0,
      }),
    ).toBe('static');
    expect(
      resolveRenderTier({
        webgl2: true,
        majorCaveat: false,
        averageFrameMs: 12,
        contextLosses: 2,
      }),
    ).toBe('static');
  });

  it('uses lite rendering for caveats or sustained slow frames', () => {
    expect(
      resolveRenderTier({
        webgl2: true,
        majorCaveat: true,
        averageFrameMs: 18,
        contextLosses: 0,
      }),
    ).toBe('lite');
    expect(
      resolveRenderTier({
        webgl2: true,
        majorCaveat: false,
        averageFrameMs: 28,
        contextLosses: 0,
      }),
    ).toBe('lite');
    expect(
      resolveRenderTier({
        webgl2: true,
        majorCaveat: false,
        averageFrameMs: 14,
        contextLosses: 1,
      }),
    ).toBe('lite');
  });

  it('returns full only for a healthy context', () => {
    expect(
      resolveRenderTier({
        webgl2: true,
        majorCaveat: false,
        averageFrameMs: 14,
        contextLosses: 0,
      }),
    ).toBe('full');
  });

  it('calculates an observed average from animation timestamps', () => {
    expect(averageFrameDuration([100, 116, 134, 158])).toBe(19.33);
  });
});
