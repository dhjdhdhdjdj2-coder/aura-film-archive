import type { Film } from '../data/films';

export interface ArchiveFilter {
  genre: string | null;
  palette: string | null;
  model: string | null;
  year: number | null;
}

export const emptyArchiveFilter: ArchiveFilter = {
  genre: null,
  palette: null,
  model: null,
  year: null,
};

export function filterFilms(
  collection: readonly Film[],
  filter: ArchiveFilter,
): Film[] {
  return collection.filter(
    (film) =>
      (!filter.genre || film.genre === filter.genre) &&
      (!filter.palette ||
        film.palette.some((color) => color.name === filter.palette)) &&
      (!filter.model || film.provenance.model === filter.model) &&
      (!filter.year || film.year === filter.year),
  );
}
