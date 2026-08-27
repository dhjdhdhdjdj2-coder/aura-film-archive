const SITES_HOST_SUFFIX = '.chatgpt.site';

export function resolveMetadataOrigin(
  rawOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN,
  environment =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? process.env.NODE_ENV
      : 'production',
) {
  if (!rawOrigin) {
    if (environment === 'production') {
      throw new Error('NEXT_PUBLIC_SITE_ORIGIN is required for a production build.');
    }
    return new URL('http://localhost:3000');
  }

  let origin: URL;
  try {
    origin = new URL(rawOrigin);
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_ORIGIN must be an absolute URL.');
  }

  if (
    environment === 'production' &&
    (origin.protocol !== 'https:' || !origin.hostname.endsWith(SITES_HOST_SUFFIX))
  ) {
    throw new Error(
      'Production NEXT_PUBLIC_SITE_ORIGIN must be a trusted HTTPS Sites origin.',
    );
  }

  return origin;
}
