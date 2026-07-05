import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes intelligently (dedupe + conflict resolution). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Standardized easing curves used across the site so motion feels cohesive.
 * Matches Framer Motion's preferred "premium" easing.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Reduced-motion-safe variant helpers for Framer Motion transitions. */
export const motionTransition = (duration = 0.8) => ({
  duration,
  ease: EASE,
});

/** Clamp a number between min and max. */
export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
