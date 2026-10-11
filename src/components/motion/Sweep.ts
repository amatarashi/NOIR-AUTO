import { useEffect, type RefObject } from "react";
import { canHoverNow, prefersReducedNow } from "@/lib/fx";

/**
 * Light sweep trigger (§5.1). The beam is a `.sweep` layer inside `host`;
 * the class toggle lives on the layer so React never overwrites it.
 * Fine pointer → pointerenter, touch → pointerdown; keyboard → focus-visible.
 * Throttled to one pass per 1200ms (2000ms on touch). Optional ambient pass:
 * first after 2.4s, then every 7s while visible and never hovered.
 */
export function useSweep(
  hostRef: RefObject<HTMLElement>,
  layerRef: RefObject<HTMLElement>,
  { enabled = true, ambient = false }: { enabled?: boolean; ambient?: boolean } = {},
) {
  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!enabled || !host || !layer || prefersReducedNow()) return;

    const fine = canHoverNow();
    const gap = fine ? 1200 : 2000;
    let last = -Infinity;
    let touched = false;
    let visible = false;
    const timers: number[] = [];

    const run = () => {
      const now = performance.now();
      if (now - last < gap) return;
      last = now;
      layer.classList.remove("is-on");
      void layer.offsetWidth; // restart the animation
      layer.classList.add("is-on");
    };
    const onPointer = () => {
      touched = true;
      run();
    };
    const onFocus = () => {
      if (host.matches(":focus-visible") || host.querySelector(":focus-visible")) run();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === layer) layer.classList.remove("is-on");
    };

    const trigger = fine ? "pointerenter" : "pointerdown";
    host.addEventListener(trigger, onPointer);
    host.addEventListener("focusin", onFocus);
    layer.addEventListener("animationend", onEnd);

    let io: IntersectionObserver | undefined;
    if (ambient) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);
      const tick = () => {
        if (!touched && visible) run();
        timers.push(window.setTimeout(tick, 7000));
      };
      timers.push(window.setTimeout(tick, 2400));
    }

    return () => {
      host.removeEventListener(trigger, onPointer);
      host.removeEventListener("focusin", onFocus);
      layer.removeEventListener("animationend", onEnd);
      io?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [hostRef, layerRef, enabled, ambient]);
}
