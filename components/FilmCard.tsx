import type { Film } from '../data/films';
import { sitePath } from '../lib/sitePath';
import styles from './FilmCard.module.css';

interface FilmCardProps {
  film: Film;
  onOpen: (film: Film) => void;
}

export function FilmCard({ film, onOpen }: FilmCardProps) {
  return (
    <article className={styles.card} data-archive-target>
      <a
        className={styles.link}
        href={`${sitePath('/')}?film=${film.slug}`}
        aria-label={`View ${film.title}`}
        onClick={(event) => {
          event.preventDefault();
          onOpen(film);
        }}
      >
        <picture className={styles.picture}>
          <source
            srcSet={film.poster.avifSrcSet}
            sizes="(max-width: 700px) 74vw, (max-width: 1100px) 38vw, 24vw"
            type="image/avif"
          />
          <source
            srcSet={film.poster.webpSrcSet}
            sizes="(max-width: 700px) 74vw, (max-width: 1100px) 38vw, 24vw"
            type="image/webp"
          />
          <img
            src={film.poster.jpg}
            srcSet={film.poster.jpgSrcSet}
            sizes="(max-width: 700px) 74vw, (max-width: 1100px) 38vw, 24vw"
            alt={film.poster.alt}
            width="800"
            height="1200"
            loading="lazy"
          />
          <span className={styles.reflection} aria-hidden="true" />
        </picture>
        <span className={styles.meta} data-light-meta>{film.archiveId} / {film.year}</span>
        <h3 data-light-meta>{film.title}</h3>
        <p data-light-meta>{film.genre}</p>
      </a>
    </article>
  );
}
