const rawOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN;
if (!rawOrigin) {
  throw new Error('NEXT_PUBLIC_SITE_ORIGIN is required for a production build.');
}

let origin;
try {
  origin = new URL(rawOrigin);
} catch {
  throw new Error('NEXT_PUBLIC_SITE_ORIGIN must be an absolute URL.');
}

if (origin.protocol !== 'https:' || !origin.hostname.endsWith('.chatgpt.site')) {
  throw new Error(
    'NEXT_PUBLIC_SITE_ORIGIN must be a trusted HTTPS Sites origin for production.',
  );
}

console.log(`Production metadata origin: ${origin.origin}`);
