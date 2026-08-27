import { describe, expect, it } from 'vitest';
import { resolveMetadataOrigin } from '../lib/metadataOrigin';

describe('resolveMetadataOrigin', () => {
  it('requires an explicit origin in production', () => {
    expect(() => resolveMetadataOrigin(undefined, 'production')).toThrow(
      /NEXT_PUBLIC_SITE_ORIGIN is required/i,
    );
  });

  it('rejects untrusted production origins', () => {
    expect(() => resolveMetadataOrigin('http://localhost:3000', 'production')).toThrow(
      /trusted HTTPS Sites origin/i,
    );
    expect(() => resolveMetadataOrigin('https://example.com', 'production')).toThrow(
      /trusted HTTPS Sites origin/i,
    );
  });

  it('accepts the deployed Sites origin', () => {
    expect(
      resolveMetadataOrigin(
        'https://aura-film-archive.dhjdhdhdjdj2.chatgpt.site',
        'production',
      ).origin,
    ).toBe('https://aura-film-archive.dhjdhdhdjdj2.chatgpt.site');
  });
});
