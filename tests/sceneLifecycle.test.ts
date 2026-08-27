import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('poster scene lifecycle', () => {
  it('handles context loss and explicitly releases the WebGL context', async () => {
    const source = await readFile(
      path.resolve(process.cwd(), 'scenes/createPosterScene.ts'),
      'utf8',
    );

    expect(source).toContain("addEventListener('webglcontextlost'");
    expect(source).toContain('renderer.forceContextLoss()');
  });
});
