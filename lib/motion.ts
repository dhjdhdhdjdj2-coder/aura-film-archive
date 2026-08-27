import type { MotionMode } from '../hooks/useMotionPreference';

export const MOTION = {
  micro: 0.14,
  control: 0.22,
  poster: 0.32,
  dialog: 0.72,
  chapter: 1.1,
  ambient: 18,
} as const;

export interface MotionProfile {
  chapterDuration: number;
  cameraTravel: number;
  pointerParallax: number;
  ambient: boolean;
}

export function getMotionProfile(mode: MotionMode): MotionProfile {
  return mode === 'reduced'
    ? {
        chapterDuration: 0.16,
        cameraTravel: 0,
        pointerParallax: 0,
        ambient: false,
      }
    : {
        chapterDuration: MOTION.chapter,
        cameraTravel: 1,
        pointerParallax: 1,
        ambient: true,
      };
}
