import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createTextures,
  processPosters,
} from '../scripts/process-posters.mjs';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

async function temporaryDirectory(prefix: string) {
  const directory = await mkdtemp(path.join(tmpdir(), prefix));
  temporaryDirectories.push(directory);
  return directory;
}

describe('processPosters', () => {
  it('fails when a required poster master is missing', async () => {
    const sourceDir = await temporaryDirectory('aura-source-');
    const outputDir = await temporaryDirectory('aura-output-');

    await expect(
      processPosters({ sourceDir, outputDir, slugs: ['missing-film'], widths: [20] }),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('writes AVIF, WebP and JPEG artwork with a two-to-three ratio', async () => {
    const sourceDir = await temporaryDirectory('aura-source-');
    const outputDir = await temporaryDirectory('aura-output-');
    await sharp({
      create: {
        width: 40,
        height: 60,
        channels: 3,
        background: '#9f7a4a',
      },
    })
      .png()
      .toFile(path.join(sourceDir, 'test-film.png'));

    await processPosters({ sourceDir, outputDir, slugs: ['test-film'], widths: [20] });

    expect((await readdir(outputDir)).sort()).toEqual([
      'test-film-20.avif',
      'test-film-20.jpg',
      'test-film-20.webp',
    ]);
    // Read through a buffer so libvips does not retain a Windows file handle.
    const metadata = await sharp(
      await readFile(path.join(outputDir, 'test-film-20.webp')),
    ).metadata();
    expect({ width: metadata.width, height: metadata.height }).toEqual({
      width: 20,
      height: 30,
    });
    const jpeg = await sharp(
      await readFile(path.join(outputDir, 'test-film-20.jpg')),
    ).metadata();
    expect({ width: jpeg.width, height: jpeg.height }).toEqual({
      width: 20,
      height: 30,
    });
  });

  it('creates compact grain and glass-normal WebP textures', async () => {
    const outputDir = await temporaryDirectory('aura-textures-');

    await createTextures(outputDir);

    expect((await readdir(outputDir)).sort()).toEqual([
      'glass-normal.webp',
      'grain.webp',
    ]);
    const grain = await sharp(
      await readFile(path.join(outputDir, 'grain.webp')),
    ).metadata();
    const normal = await sharp(
      await readFile(path.join(outputDir, 'glass-normal.webp')),
    ).metadata();
    expect([grain.width, grain.height]).toEqual([512, 512]);
    expect([normal.width, normal.height]).toEqual([512, 512]);
    expect((await stat(path.join(outputDir, 'grain.webp'))).size).toBeLessThan(40_000);
    expect((await stat(path.join(outputDir, 'glass-normal.webp'))).size).toBeLessThan(
      40_000,
    );
  });
});
