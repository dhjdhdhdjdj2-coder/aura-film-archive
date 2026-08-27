'use client';

import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import type { Film } from '../data/films';
import type { RenderTier } from '../lib/renderTier';
import { sitePath } from '../lib/sitePath';
import styles from './Landing.module.css';

const LazyHeroScene = lazy(() => import('../scenes/HeroScene'));

interface LandingProps {
  heroFilm: Film;
  tier: RenderTier;
  reducedMotion: boolean;
  scenePosters?: readonly string[];
  onSceneContextLoss?: () => void;
}

const posterSizes =
  '(max-width: 560px) 58vw, (max-width: 896px) 224px, (min-width: 1472px) 368px, 25vw';

export function Landing({
  heroFilm,
  tier,
  reducedMotion,
  scenePosters = [],
  onSceneContextLoss,
}: LandingProps) {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (tier === 'static') return;
    const reveal = () => setSceneReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(reveal, { timeout: 900 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(reveal, 120);
    return () => window.clearTimeout(handle);
  }, [tier]);

  return (
    <section
      id="top"
      className={styles.hero}
      aria-labelledby="hero-title"
      data-render-tier={tier}
      data-reduced-motion={reducedMotion}
      style={{
        '--grain-texture': `url("${sitePath('/textures/grain.webp')}")`,
      } as CSSProperties}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <picture className={styles.lcpPoster} data-hero-poster>
        <source
          srcSet={heroFilm.poster.avifSrcSet}
          sizes={posterSizes}
          type="image/avif"
        />
        <source
          srcSet={heroFilm.poster.webpSrcSet}
          sizes={posterSizes}
          type="image/webp"
        />
        <img
          src={heroFilm.poster.jpg}
          srcSet={heroFilm.poster.jpgSrcSet}
          sizes={posterSizes}
          alt={heroFilm.poster.alt}
          width="1200"
          height="1800"
          fetchPriority="high"
        />
      </picture>

      {tier !== 'static' && sceneReady ? (
        <div className={styles.scene} aria-hidden="true">
          <Suspense fallback={null}>
            <LazyHeroScene
              tier={tier}
              posters={scenePosters}
              reducedMotion={reducedMotion}
              onContextLoss={onSceneContextLoss}
            />
          </Suspense>
        </div>
      ) : null}

      <div className={styles.copy}>
        <p className={`${styles.eyebrow} metadata`}>
          AI CINEMA / COLLECTION 01 / 2026
        </p>
        <h1
          id="hero-title"
          className={styles.title}
          aria-label="AURA FILM ARCHIVE"
          data-motion-title
        >
          <span>AURA</span>
          <span>FILM ARCHIVE</span>
        </h1>
        <p className={styles.statement}>
          Cinema that never existed, preserved as if it did.
        </p>
      </div>

      <a className={styles.enter} href="#archive">
        <span>ENTER ARCHIVE</span>
        <span className={styles.enterLine} aria-hidden="true" />
        <span aria-hidden="true">01—08</span>
      </a>

      <p className={styles.accession} aria-hidden="true">
        AF–001 / AFTERLIGHT
      </p>
    </section>
  );
}
