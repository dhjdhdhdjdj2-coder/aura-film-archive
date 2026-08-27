import { useCallback, useEffect, useRef, useState } from 'react';
import { films } from '../data/films';
import type { ArchiveFilter } from '../lib/archiveFilters';

export interface ArchiveUrlState extends ArchiveFilter {
  film: string | null;
}

const emptyState: ArchiveUrlState = {
  film: null,
  genre: null,
  palette: null,
  model: null,
  year: null,
};

const validFilms = new Set(films.map((film) => film.slug));
const validGenres = new Set(films.map((film) => film.genre));
const validPalettes = new Set(
  films.flatMap((film) => film.palette.map((color) => color.name)),
);
const validModels = new Set(films.map((film) => film.provenance.model));
const validYears = new Set<number>(films.map((film) => film.year));

function validString(value: string | null, values: ReadonlySet<string>) {
  return value && values.has(value) ? value : null;
}

function normalizeArchiveState(candidate: ArchiveUrlState): ArchiveUrlState {
  const year = candidate.year;
  return {
    film: validString(candidate.film, validFilms),
    genre: validString(candidate.genre, validGenres),
    palette: validString(candidate.palette, validPalettes),
    model: validString(candidate.model, validModels),
    year:
      year !== null && Number.isInteger(year) && validYears.has(year)
        ? year
        : null,
  };
}

function readArchiveUrl(): ArchiveUrlState {
  const params = new URLSearchParams(window.location.search);
  const year = Number(params.get('year'));
  return normalizeArchiveState({
    film: params.get('film'),
    genre: params.get('genre'),
    palette: params.get('palette'),
    model: params.get('model'),
    year: Number.isFinite(year) && year > 0 ? year : null,
  });
}

function writeArchiveUrl(next: ArchiveUrlState, method: 'push' | 'replace') {
  const url = new URL(window.location.href);
  for (const key of ['film', 'genre', 'palette', 'model', 'year'] as const) {
    const value = next[key];
    if (value === null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  if (method === 'push') window.history.pushState(next, '', url);
  else window.history.replaceState(next, '', url);
}

export function useArchiveUrlState() {
  const [state, setState] = useState<ArchiveUrlState>(emptyState);
  const stateRef = useRef<ArchiveUrlState>(emptyState);

  useEffect(() => {
    const sync = () => {
      const next = readArchiveUrl();
      stateRef.current = next;
      writeArchiveUrl(next, 'replace');
      setState(next);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const update = useCallback((patch: Partial<ArchiveUrlState>) => {
    const next = normalizeArchiveState({ ...stateRef.current, ...patch });
    stateRef.current = next;
    writeArchiveUrl(next, 'push');
    setState(next);
  }, []);

  return { state, update };
}
