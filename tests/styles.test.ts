import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('motion styles', () => {
  it('lets the explicit document motion mode override the system preference', async () => {
    const css = await readFile(path.resolve(process.cwd(), 'styles/base.css'), 'utf8');

    expect(css).toContain("html[data-motion='reduced']");
    expect(css).toContain('html:not([data-motion])');
  });
});
