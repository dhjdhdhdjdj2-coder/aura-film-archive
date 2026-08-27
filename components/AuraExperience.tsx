'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArchiveHeader } from './ArchiveHeader';
import { ArchiveLight } from './ArchiveLight';
import { Colophon } from './Colophon';
import { DirectorMode } from './DirectorMode';
import { FilmArchive } from './FilmArchive';
import { FilmDetail } from './FilmDetail';
import { Landing } from './Landing';
import { VisualLaboratory } from './VisualLaboratory';
import { films, getFilmBySlug, type Film } from '../data/films';
import { useArchiveUrlState } from '../hooks/useArchiveUrlState';
import { useAuraMotion } from '../hooks/useAuraMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import {
  detectInitialRenderTier,
  resolveRenderTier,
  sampleAverageFrameMs,
  type RenderTier,
} from '../lib/renderTier';

const heroScenePosters = films.slice(0, 7).map((film) => film.poster.jpg);

export function AuraExperience() {
  const { mode, setMode } = useMotionPreference();
  const { state: archiveState, update: updateArchiveState } = useArchiveUrlState();
  const [renderTier, setRenderTier] = useState<RenderTier>('static');
  const contextLosses = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  useAuraMotion({ mode, rootRef: mainRef });

  useEffect(() => {
    let cancelled = false;
    const initialTier = detectInitialRenderTier();
    const tierHandle = window.setTimeout(() => {
      if (!cancelled) setRenderTier(initialTier);
    }, 0);
    if (initialTier !== 'static') {
      void sampleAverageFrameMs().then((averageFrameMs) => {
        if (cancelled) return;
        setRenderTier(
          resolveRenderTier({
            webgl2: true,
            majorCaveat: initialTier === 'lite',
            averageFrameMs,
            contextLosses: contextLosses.current,
          }),
        );
      });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(tierHandle);
    };
  }, []);

  const handleSceneContextLoss = useCallback(() => {
    contextLosses.current += 1;
    setRenderTier(contextLosses.current >= 2 ? 'static' : 'lite');
  }, []);

  const selectedFilm = archiveState.film
    ? getFilmBySlug(archiveState.film)
    : undefined;
  const selectedIndex = selectedFilm
    ? films.findIndex((film) => film.slug === selectedFilm.slug)
    : -1;
  const openFilm = useCallback(
    (film: Film) => updateArchiveState({ film: film.slug }),
    [updateArchiveState],
  );
  const closeFilm = useCallback(
    () => updateArchiveState({ film: null }),
    [updateArchiveState],
  );
  const showAdjacentFilm = useCallback(
    (offset: number) => {
      if (selectedIndex < 0) return;
      const nextIndex = (selectedIndex + offset + films.length) % films.length;
      updateArchiveState({ film: films[nextIndex].slug });
    },
    [selectedIndex, updateArchiveState],
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to archive
      </a>
      <ArchiveHeader mode={mode} setMode={setMode} />
      <ArchiveLight mode={mode} />
      <main ref={mainRef} id="main" data-motion={mode}>
        <Landing
          heroFilm={films[0]}
          tier={renderTier}
          reducedMotion={mode === 'reduced'}
          scenePosters={heroScenePosters}
          onSceneContextLoss={handleSceneContextLoss}
        />
        <FilmArchive
          films={films}
          filter={{
            genre: archiveState.genre,
            palette: archiveState.palette,
            model: archiveState.model,
            year: archiveState.year,
          }}
          onFilterChange={updateArchiveState}
          onOpen={openFilm}
        />
        <DirectorMode film={selectedFilm ?? films[0]} />
        <VisualLaboratory />
      </main>
      <Colophon films={films} onOpen={openFilm} />
      {selectedFilm ? (
        <FilmDetail
          film={selectedFilm}
          onClose={closeFilm}
          onPrevious={() => showAdjacentFilm(-1)}
          onNext={() => showAdjacentFilm(1)}
        />
      ) : null}
    </>
  );
}
