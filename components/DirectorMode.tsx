'use client';

/* eslint-disable @next/next/no-img-element -- curated picture sources are pre-generated and art-directed */

import { useMemo, useState, type CSSProperties } from 'react';
import type { DirectorStageKind, Film } from '../data/films';
import styles from './DirectorMode.module.css';

interface DirectorModeProps {
  film: Film;
}

function promptText(film: Film) {
  const prompt = film.process.find((stage) => stage.kind === 'prompt');
  return [film.title, prompt?.summary, ...(prompt?.details ?? [])]
    .filter(Boolean)
    .join('\n');
}

export function DirectorMode({ film }: DirectorModeProps) {
  const [active, setActive] = useState<DirectorStageKind>('inspiration');
  const [comparison, setComparison] = useState(100);
  const [announcement, setAnnouncement] = useState('');
  const activeStage = useMemo(
    () => film.process.find((stage) => stage.kind === active) ?? film.process[0],
    [active, film.process],
  );

  const copyPrompt = async () => {
    setAnnouncement('');
    if (!navigator.clipboard?.writeText) {
      setAnnouncement('COPY FAILED — SELECT PROMPT MANUALLY');
      return;
    }
    try {
      await navigator.clipboard.writeText(promptText(film));
      setAnnouncement('PROMPT COPIED');
    } catch {
      setAnnouncement('COPY FAILED — SELECT PROMPT MANUALLY');
    }
  };

  return (
    <section id="director" className={styles.director} aria-labelledby="director-title">
      <div className={styles.heading}>
        <p className="metadata">CHAPTER 03 / AI DIRECTOR MODE</p>
        <h2 id="director-title">Art direction, recorded.</h2>
        <p>
          The image is only the final frame. This is the reasoning, prompting,
          comparison and human judgment that constructed it.
        </p>
      </div>

      <div className={styles.workspace}>
        <div
          className={styles.artwork}
          style={{ '--comparison': `${comparison}%` } as CSSProperties}
        >
          <div className={styles.posterStack}>
            <img
              className={styles.before}
              src={film.poster.jpg}
              srcSet={film.poster.jpgSrcSet}
              sizes="(max-width: 850px) 88vw, 46vw"
              alt=""
              width="1200"
              height="1800"
            />
            <img
              className={styles.after}
              src={film.poster.jpg}
              srcSet={film.poster.jpgSrcSet}
              sizes="(max-width: 850px) 88vw, 46vw"
              alt={film.poster.alt}
              width="1200"
              height="1800"
              loading="lazy"
            />
            <span className={styles.divider} aria-hidden="true" />
          </div>
          <div className={styles.comparisonControls}>
            <button type="button" onClick={() => setComparison(0)}>BEFORE</button>
            <label>
              <span>Before and after</span>
              <input
                type="range"
                min="0"
                max="100"
                value={comparison}
                onChange={(event) => setComparison(Number(event.target.value))}
              />
            </label>
            <button type="button" onClick={() => setComparison(100)}>AFTER</button>
          </div>
          <p className={styles.artworkMeta}>{film.archiveId} / {film.title}</p>
        </div>

        <div className={styles.processPanel}>
          <ol className={styles.stages}>
            {film.process.map((stage, index) => {
              const selected = stage.kind === active;
              return (
                <li key={stage.kind} data-active={selected}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={selected}
                        aria-controls={`director-stage-${stage.kind}`}
                        onClick={() => setActive(stage.kind)}
                      >
                        {stage.title}
                      </button>
                    </h3>
                    <div
                      id={`director-stage-${stage.kind}`}
                      className={styles.stageBody}
                      hidden={!selected}
                    >
                      <p>{stage.summary}</p>
                      <ul>
                        {stage.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                      {stage.kind === 'prompt' ? (
                        <button className={styles.copy} type="button" onClick={copyPrompt}>
                          COPY PROMPT
                        </button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <article className={styles.activeRecord} aria-label="Active process record">
            <p className="metadata">ACTIVE RECORD / {activeStage.title}</p>
            <blockquote>{activeStage.summary}</blockquote>
          </article>

          <div className={styles.provenance}>
            <p className="metadata">GENERATION PROVENANCE</p>
            <dl>
              <div><dt>Model</dt><dd>{film.provenance.model} / {film.provenance.version}</dd></div>
              <div><dt>Seed</dt><dd>{film.provenance.seed}</dd></div>
              <div><dt>Ratio</dt><dd>{film.provenance.ratio}</dd></div>
              <div><dt>Iterations</dt><dd>{film.provenance.iterations}</dd></div>
              <div><dt>Human edits</dt><dd>{film.provenance.humanEdits.join(' / ')}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">{announcement}</p>
    </section>
  );
}
