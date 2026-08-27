import { describe, expect, it } from 'vitest';
import { films } from '../data/films';
import { filterFilms } from '../lib/archiveFilters';

describe('filterFilms', () => {
  it('combines genre and palette filters and preserves archive order', () => {
    const result = filterFilms(films, {
      genre: 'Solar noir',
      palette: 'Amber',
      model: null,
      year: 2026,
    });
    expect(result.map((film) => film.slug)).toEqual(['afterlight']);
  });

  it('returns the full collection when filters are clear', () => {
    expect(
      filterFilms(films, {
        genre: null,
        palette: null,
        model: null,
        year: null,
      }),
    ).toEqual(films);
  });
});
