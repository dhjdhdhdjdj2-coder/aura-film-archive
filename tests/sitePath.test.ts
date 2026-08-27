import { describe, expect, it } from 'vitest';
import { sitePath } from '../lib/sitePath';

describe('sitePath', () => {
  it('prefixes root-relative paths for a GitHub Pages project site', () => {
    expect(sitePath('/posters/afterlight-1200.jpg', '/aura-film-archive')).toBe(
      '/aura-film-archive/posters/afterlight-1200.jpg',
    );
    expect(sitePath('/', '/aura-film-archive')).toBe('/aura-film-archive/');
  });

  it('keeps root-relative paths unchanged without a project base path', () => {
    expect(sitePath('/textures/grain.webp', '')).toBe('/textures/grain.webp');
  });

  it('does not rewrite anchors or absolute URLs', () => {
    expect(sitePath('#archive', '/aura-film-archive')).toBe('#archive');
    expect(sitePath('https://example.com/poster.jpg', '/aura-film-archive')).toBe(
      'https://example.com/poster.jpg',
    );
  });
});
