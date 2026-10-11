import { useCallback, useSyncExternalStore } from "react";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe media query: the server snapshot (and therefore the hydration
 * render) always uses `serverValue`, the real value arrives right after.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * Gate for heavy pointer effects (tilt, cursor glow, magnets, parallax,
 * Lenis): fine hover-capable pointer AND no reduced-motion preference.
 */
export function useFx() {
  const canHover = useMediaQuery(HOVER_QUERY);
  const reduced = useMediaQuery(REDUCED_QUERY);
  return { fx: canHover && !reduced, canHover, reduced };
}

/** Non-hook checks for event handlers / effects. */
export function canHoverNow() {
  return typeof window !== "undefined" && window.matchMedia(HOVER_QUERY).matches;
}
export function prefersReducedNow() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}
