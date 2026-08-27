export function sitePath(
  path: string,
  basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '',
): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  const normalizedBasePath = basePath
    ? `/${basePath.replace(/^\/+|\/+$/g, '')}`
    : '';

  return `${normalizedBasePath}${path}`;
}
