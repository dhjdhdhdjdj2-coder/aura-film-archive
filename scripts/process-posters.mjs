import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const defaultSlugs = [
  "afterlight",
  "mother-of-static",
  "orbital-nocturne",
  "glass-tide",
  "the-last-bloom",
  "a-memory-of-rain",
  "echoes-from-ix",
  "sleepwalker-2084",
];

export const defaultWidths = [480, 800, 1200, 1600];

function seededNoise(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export async function createTextures(outputDir) {
  const width = 512;
  const height = 512;
  const channels = 3;
  const grain = Buffer.alloc(width * height * channels);
  const normal = Buffer.alloc(width * height * channels);
  const random = seededNoise(240826);

  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const offset = pixel * channels;
    const grainValue = 122 + Math.round((random() - 0.5) * 28);
    grain[offset] = grainValue;
    grain[offset + 1] = grainValue;
    grain[offset + 2] = grainValue;

    normal[offset] = 128 + Math.round((random() - 0.5) * 10);
    normal[offset + 1] = 128 + Math.round((random() - 0.5) * 10);
    normal[offset + 2] = 250;
  }

  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    sharp(grain, { raw: { width, height, channels } })
      .webp({ quality: 24, effort: 6 })
      .toFile(path.join(outputDir, "grain.webp")),
    sharp(normal, { raw: { width, height, channels } })
      .webp({ quality: 28, effort: 6 })
      .toFile(path.join(outputDir, "glass-normal.webp")),
  ]);
}

export async function processPosters({
  sourceDir,
  outputDir,
  slugs = defaultSlugs,
  widths = defaultWidths,
  onOutput = () => {},
}) {
  await mkdir(outputDir, { recursive: true });

  for (const slug of slugs) {
    const source = path.join(sourceDir, `${slug}.png`);
    await access(source);

    for (const width of widths) {
      const height = Math.round(width * 1.5);
      const image = sharp(source).resize(width, height, {
        fit: "cover",
        position: "attention",
      });
      const avifPath = path.join(outputDir, `${slug}-${width}.avif`);
      const webpPath = path.join(outputDir, `${slug}-${width}.webp`);
      const jpegPath = path.join(outputDir, `${slug}-${width}.jpg`);

      await Promise.all([
        image.clone().avif({ quality: 58, effort: 6 }).toFile(avifPath),
        image.clone().webp({ quality: 78 }).toFile(webpPath),
        image.clone().jpeg({ quality: 82, progressive: true }).toFile(jpegPath),
      ]);

      onOutput(avifPath);
      onOutput(webpPath);
      onOutput(jpegPath);
    }
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await processPosters({
    sourceDir: path.resolve(process.cwd(), "../work/poster-masters"),
    outputDir: path.resolve(process.cwd(), "public/posters"),
    onOutput: (file) => console.log(path.relative(process.cwd(), file)),
  });
  const texturesDir = path.resolve(process.cwd(), "public/textures");
  await createTextures(texturesDir);
  console.log(path.relative(process.cwd(), path.join(texturesDir, "grain.webp")));
  console.log(
    path.relative(process.cwd(), path.join(texturesDir, "glass-normal.webp")),
  );
}
