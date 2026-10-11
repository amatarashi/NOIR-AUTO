/**
 * Intro timeline shared between <Intro> (curtain) and <Hero> (choreography).
 * The curtain is CSS-animated from first paint; `__noirIntroT` is stamped
 * by the inline head script so the hero can start in sync (t = 1000ms).
 */
declare global {
  interface Window {
    __noirIntroT?: number;
  }
}

export const HERO_START_MS = 1000;
export const INTRO_END_MS = 1500;

let skipped = false;
const listeners = new Set<() => void>();

export function introActive() {
  return document.documentElement.classList.contains("intro-on");
}

/** ms elapsed since the curtain started painting. */
export function introElapsed() {
  return performance.now() - (window.__noirIntroT ?? 0);
}

export function heroStartDelay() {
  if (!introActive() || skipped) return 0;
  return Math.max(0, HERO_START_MS - introElapsed());
}

export function skipIntro() {
  if (skipped) return;
  skipped = true;
  listeners.forEach((fn) => fn());
}

export function onIntroSkip(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
