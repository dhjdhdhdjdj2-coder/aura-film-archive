import type { MotionMode } from '../hooks/useMotionPreference';
import styles from './ArchiveHeader.module.css';

interface ArchiveHeaderProps {
  mode: MotionMode;
  setMode: (mode: MotionMode) => void;
}

export function ArchiveHeader({ mode, setMode }: ArchiveHeaderProps) {
  const reduced = mode === 'reduced';

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label="AURA Film Archive, top">
        <span className={styles.brandMark}>AURA</span>
        <span className={styles.brandDivider} aria-hidden="true" />
        <span>FILM ARCHIVE</span>
      </a>

      <nav className={styles.navigation} aria-label="Archive chapters">
        <a className={styles.chapterLink} href="#archive">Archive</a>
        <a className={styles.chapterLink} href="#director">Director</a>
        <a className={styles.chapterLink} href="#laboratory">Laboratory</a>
      </nav>

      <p className={styles.index}>COLLECTION 01 / 08 FILMS</p>

      <button
        className={styles.motion}
        type="button"
        aria-pressed={reduced}
        onClick={() => setMode(reduced ? 'full' : 'reduced')}
      >
        <span className={styles.motionDot} aria-hidden="true" />
        MOTION: {reduced ? 'REDUCED' : 'FULL'}
      </button>
    </header>
  );
}
