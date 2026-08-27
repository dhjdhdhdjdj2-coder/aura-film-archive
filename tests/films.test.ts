import { describe, expect, it } from 'vitest';
import { films, getFilmBySlug } from '../data/films';

describe('film collection', () => {
  it('contains eight unique, fully attributed records in archive order', () => {
    expect(films).toHaveLength(8);
    expect(new Set(films.map((film) => film.slug)).size).toBe(8);
    expect(films.map((film) => film.archiveId)).toEqual([
      'AF–001',
      'AF–002',
      'AF–003',
      'AF–004',
      'AF–005',
      'AF–006',
      'AF–007',
      'AF–008',
    ]);

    for (const film of films) {
      expect(film.palette).toHaveLength(5);
      expect(film.keywords.length).toBeGreaterThanOrEqual(5);
      expect(film.process.map((stage) => stage.kind)).toEqual([
        'inspiration',
        'analysis',
        'prompt',
        'generation',
        'art-direction',
      ]);
      expect(film.provenance.model).not.toBe('');
      expect(film.provenance.version).not.toBe('');
      expect(film.provenance.humanEdits.length).toBeGreaterThan(0);
      expect(film.poster.avifSrcSet).toContain('480w');
      expect(film.poster.avifSrcSet).toContain('1600w');
      expect(film.poster.jpgSrcSet.split(', ')).toHaveLength(4);
      expect(film.poster.alt.length).toBeGreaterThan(20);
    }
  });

  it('looks up a film by slug without inventing missing records', () => {
    expect(getFilmBySlug('afterlight')?.archiveId).toBe('AF–001');
    expect(getFilmBySlug('not-in-the-archive')).toBeUndefined();
  });
});
