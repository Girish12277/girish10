/**
 * Central motion vocabulary for the entire app.
 *
 * Every framer-motion `transition` and CSS `transition` token should come
 * from this file. Centralising it keeps the player feeling coherent: dock
 * hover, panel open, seekbar thumb, OSD pills — all share the same physics.
 *
 * Respect `prefers-reduced-motion`: consumers should fall back to
 * `reducedMotion` when the user opts out.
 */

import type { Transition } from "framer-motion";

// Cubic-bezier curves — exposed as CSS vars too (see styles.css additions).
export const ease = {
  standard: [0.2, 0, 0.2, 1] as const,
  decel:    [0.05, 0.7, 0.1, 1] as const,
  accel:    [0.3, 0, 1, 1] as const,
  expoOut:  [0.16, 1, 0.3, 1] as const,
  back:     [0.34, 1.56, 0.64, 1] as const,
} as const;

// Durations in seconds (framer-motion). CSS gets ms in styles.css.
export const dur = {
  fast: 0.12,
  base: 0.22,
  slow: 0.38,
} as const;

// Spring presets — the personality of every interactive surface.
export const spring = {
  /** Snappy press / dock hover lift. */
  snap:   { type: "spring", stiffness: 520, damping: 32, mass: 0.6 } satisfies Transition,
  /** Panel open, dialog scale-in. */
  glide:  { type: "spring", stiffness: 320, damping: 30, mass: 0.7 } satisfies Transition,
  /** Floating elements, layoutId morphs. */
  float:  { type: "spring", stiffness: 260, damping: 26, mass: 0.8 } satisfies Transition,
  /** Tight press feedback. */
  press:  { type: "spring", stiffness: 700, damping: 28, mass: 0.4 } satisfies Transition,
} as const;

/** Stagger helper for revealing groups of children. */
export const stagger = (each = 0.04, delay = 0): Transition => ({
  staggerChildren: each,
  delayChildren: delay,
});

/** Drop-in transition for opacity/transform tweens that should feel "smooth". */
export const tween = {
  fast:  { duration: dur.fast, ease: ease.standard } satisfies Transition,
  base:  { duration: dur.base, ease: ease.expoOut } satisfies Transition,
  slow:  { duration: dur.slow, ease: ease.expoOut } satisfies Transition,
} as const;

/** True when the OS / user prefers reduced motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Use as a `transition` when reduced motion is preferred. */
export const reducedMotion: Transition = { duration: 0.01 };