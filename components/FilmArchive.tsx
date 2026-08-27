import type { Film } from '../data/films';
import {
  emptyArchiveFilter,
  filterFilms,
  type ArchiveFilter,
} from '../lib/archiveFilters';
import { FilmCard } from './FilmCard';
import styles from './FilmArchive.module.css';

interface FilmArchiveProps {
  films: readonly Film[];
  filter: ArchiveFilter;
  onFilterChange: (patch: Partial<ArchiveFilter>) => void;
  onOpen: (film: Film) => void;
}

function unique(values: readonly string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function FilmArchive({
  films,
  filter,
  onFilterChange,
  onOpen,
}: FilmArchiveProps) {
  const results = filterFilms(films, filter);
  const genres = unique(films.map((film) => film.genre));
  const palettes = unique(films.flatMap((film) => film.palette.map((color) => color.name)));
  const models = unique(films.map((film) => film.provenance.model));
  const years = [...new Set(films.map((film) => film.year))];
  const resultLabel = `${String(results.length).padStart(2, '0')} ${
    results.length === 1 ? 'FILM' : 'FILMS'
  } RETRIEVED`;

  return (
    <section id="archive" className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.heading}>
        <div>
          <p className="metadata">CHAPTER 02 / THE COLLECTION</p>
          <h2 id="archive-title">Film Archive</h2>
        </div>
        <p className={styles.intro}>
          Eight imagined films. Each image is preserved with its story,
          visual system and record of human art direction.
        </p>
      </div>

      <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Genre</span>
          <select
            value={filter.genre ?? ''}
            onChange={(event) => onFilterChange({ genre: event.target.value || null })}
          >
            <option value="">All genres</option>
            {genres.map((genre) => <option key={genre}>{genre}</option>)}
          </select>
        </label>
        <label>
          <span>Palette</span>
          <select
            value={filter.palette ?? ''}
            onChange={(event) => onFilterChange({ palette: event.target.value || null })}
          >
            <option value="">All palettes</option>
            {palettes.map((palette) => <option key={palette}>{palette}</option>)}
          </select>
        </label>
        <label>
          <span>Year</span>
          <select
            value={filter.year ?? ''}
            onChange={(event) =>
              onFilterChange({ year: event.target.value ? Number(event.target.value) : null })
            }
          >
            <option value="">All years</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
        <label>
          <span>Model</span>
          <select
            value={filter.model ?? ''}
            onChange={(event) => onFilterChange({ model: event.target.value || null })}
          >
            <option value="">All models</option>
            {models.map((model) => <option key={model}>{model}</option>)}
          </select>
        </label>
        <button
          className={styles.clear}
          type="button"
          onClick={() => onFilterChange(emptyArchiveFilter)}
        >
          CLEAR FILTERS
        </button>
      </form>

      <div className={styles.resultLine}>
        <span>{resultLabel}</span>
        <span aria-hidden="true">INDEX / {results.length}.08</span>
      </div>

      <div className={styles.wall} aria-live="polite" aria-label={resultLabel}>
        {results.map((film) => (
          <FilmCard key={film.slug} film={film} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
