'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { Film } from '../data/films';
import { useFocusTrap } from '../hooks/useFocusTrap';
import styles from './FilmDetail.module.css';

interface FilmDetailProps {
  film: Film;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function FilmDetail({
  film,
  onClose,
  onPrevious,
  onNext,
}: FilmDetailProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, onClose);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="film-detail-title"
      >
        <header className={styles.toolbar}>
          <p>{film.archiveId} / COLLECTION 01</p>
          <button type="button" onClick={onClose}>
            CLOSE <span aria-hidden="true">ESC</span>
          </button>
        </header>

        <div className={styles.layout}>
          <div className={styles.artwork}>
            <picture>
              <source srcSet={film.poster.avifSrcSet} sizes="(max-width: 800px) 88vw, 46vw" type="image/avif" />
              <source srcSet={film.poster.webpSrcSet} sizes="(max-width: 800px) 88vw, 46vw" type="image/webp" />
              <img
                src={film.poster.jpg}
                srcSet={film.poster.jpgSrcSet}
                sizes="(max-width: 800px) 88vw, 46vw"
                alt={film.poster.alt}
                width="1200"
                height="1800"
              />
            </picture>
            <p>{film.tagline}</p>
          </div>

          <div className={styles.content}>
            <p className="metadata">{film.genre} / {film.runtime} / {film.year}</p>
            <h2 id="film-detail-title">{film.title}</h2>
            <section aria-labelledby="story-title">
              <p className={styles.kicker}>01 / STORY CONCEPT</p>
              <h3 id="story-title">A film remembered before it was made.</h3>
              <p className={styles.concept}>{film.concept}</p>
            </section>

            <section aria-labelledby="palette-title">
              <p className={styles.kicker}>02 / COLOR SYSTEM</p>
              <h3 id="palette-title">Color palette</h3>
              <ul className={styles.palette} aria-label="Color palette">
                {film.palette.map((color) => (
                  <li key={color.hex}>
                    <span
                      className={styles.swatch}
                      style={{ '--swatch': color.hex } as CSSProperties}
                      aria-hidden="true"
                    />
                    <span>{color.name}</span>
                    <span>{color.hex}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="keywords-title">
              <p className={styles.kicker}>03 / VISUAL LANGUAGE</p>
              <h3 id="keywords-title">Visual keywords</h3>
              <ul className={styles.keywords}>
                {film.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
              </ul>
            </section>

            <section aria-labelledby="process-title">
              <p className={styles.kicker}>04 / AI CREATION PROCESS</p>
              <h3 id="process-title">Creation record</h3>
              <ol className={styles.process}>
                {film.process.map((stage, index) => (
                  <li key={stage.kind}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{stage.title}</strong><p>{stage.summary}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="provenance-title">
              <p className={styles.kicker}>05 / PROVENANCE</p>
              <h3 id="provenance-title">Archive record</h3>
              <dl className={styles.provenance}>
                <div><dt>Model</dt><dd>{film.provenance.model} / {film.provenance.version}</dd></div>
                <div><dt>Seed</dt><dd>{film.provenance.seed}</dd></div>
                <div><dt>Ratio</dt><dd>{film.provenance.ratio}</dd></div>
                <div><dt>Iterations</dt><dd>{film.provenance.iterations}</dd></div>
                <div><dt>Human edits</dt><dd>{film.provenance.humanEdits.join(' / ')}</dd></div>
              </dl>
            </section>
          </div>
        </div>

        <footer className={styles.pagination}>
          <button type="button" onClick={onPrevious}>← PREVIOUS FILM</button>
          <span>{film.archiveId}</span>
          <button type="button" onClick={onNext}>NEXT FILM →</button>
        </footer>
      </div>
    </div>
  );
}
