import type { Film } from '../data/films';
import { sitePath } from '../lib/sitePath';
import styles from './Colophon.module.css';

interface ColophonProps {
  films: readonly Film[];
  onOpen: (film: Film) => void;
}

export function Colophon({ films, onOpen }: ColophonProps) {
  return (
    <footer className={styles.footer} aria-labelledby="colophon-title">
      <div className={styles.light} aria-hidden="true" />

      <div className={styles.intro}>
        <p className="metadata">COLOPHON / COLLECTION 01</p>
        <p className={styles.manifesto}>AI-GENERATED / HUMAN ART-DIRECTED</p>
      </div>

      <h2 id="colophon-title">
        END OF COLLECTION 01. <em>THE ARCHIVE REMAINS OPEN.</em>
      </h2>

      <div className={styles.ledger}>
        <div>
          <p className={styles.label}>Archive index / 08 films</p>
          <ol aria-label="Archive index">
            {films.map((film) => (
              <li key={film.slug}>
                <a
                  href={`${sitePath('/')}?film=${film.slug}`}
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }
                    event.preventDefault();
                    onOpen(film);
                  }}
                >
                  <span>{film.archiveId}</span>
                  <span>{film.title}</span>
                  <span>{film.genre}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.credits}>
          <p className={styles.label}>Authorship and provenance</p>
          <dl>
            <div>
              <dt>Creative direction</dt>
              <dd>AURA Studio</dd>
            </div>
            <div>
              <dt>Image system</dt>
              <dd>Aura Diffusion XL / 2.6</dd>
            </div>
            <div>
              <dt>Human authorship</dt>
              <dd>Concept, curation, typography, compositing and color</dd>
            </div>
            <div>
              <dt>Collection</dt>
              <dd>01 / Eight unreal films / 2026</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.closing}>
        <a href="#top">RETURN TO LIGHT</a>
        <p>AURA FILM ARCHIVE™ / AN IMAGINED CINEMA COLLECTION</p>
      </div>
    </footer>
  );
}
