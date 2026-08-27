import sharp from 'sharp';
import path from 'node:path';

const width = 1200;
const height = 630;
const source = path.resolve('public/posters/afterlight-1200.jpg');
const output = path.resolve('public/og.png');

const ambient = await sharp(source)
  .resize(width, height, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.16, saturation: 0.55 })
  .blur(20)
  .png()
  .toBuffer();

const poster = await sharp(source)
  .resize(344, 516, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.9, saturation: 0.82 })
  .png()
  .toBuffer();

const artwork = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" x2="1">
      <stop offset="0" stop-color="#050505" stop-opacity="0.99"/>
      <stop offset="0.55" stop-color="#050505" stop-opacity="0.93"/>
      <stop offset="0.76" stop-color="#050505" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#050505" stop-opacity="0.2"/>
    </linearGradient>
    <radialGradient id="aura" cx="80%" cy="50%" r="48%">
      <stop offset="0" stop-color="#E7C184" stop-opacity="0.66"/>
      <stop offset="0.2" stop-color="#C9A66B" stop-opacity="0.28"/>
      <stop offset="0.7" stop-color="#6B4A2F" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-200%" width="160%" height="500%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#veil)"/>
  <rect width="1200" height="630" fill="url(#aura)"/>
  <rect x="775" y="56" width="346" height="518" fill="none" stroke="#EEE9DF" stroke-opacity="0.24"/>
  <path d="M632 322 H1174" stroke="#C9A66B" stroke-width="14" stroke-opacity="0.32" filter="url(#glow)"/>
  <path d="M632 322 H1174" stroke="#E7C184" stroke-width="1" stroke-opacity="0.72"/>
  <path d="M72 72 H324" stroke="#C9A66B" stroke-width="1" stroke-opacity="0.72"/>
  <text x="72" y="302" fill="#EEE9DF" font-family="Georgia, 'Times New Roman', serif" font-size="63" letter-spacing="1.4">AURA FILM ARCHIVE</text>
  <text x="77" y="351" fill="#C9A66B" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="500" letter-spacing="5.2">CINEMA THAT NEVER EXISTED</text>
  <rect x="72" y="536" width="112" height="1" fill="#EEE9DF" fill-opacity="0.22"/>
  <circle cx="202" cy="536.5" r="2.5" fill="#C9A66B"/>
</svg>`;

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: '#050505',
  },
})
  .composite([
    { input: ambient, left: 0, top: 0 },
    { input: poster, left: 776, top: 57 },
    { input: Buffer.from(artwork), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 94 })
  .toFile(output);

console.log(output);
