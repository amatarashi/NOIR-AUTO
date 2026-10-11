import { useEffect, type RefObject } from "react";

/**
 * Cursor spotlight for glass surfaces (§5.2, cards/tiles): local px
 * coordinates into --mx/--my, `data-hot` while hovered. Rect is cached on
 * enter and dropped on scroll. Attribute (not class) so React re-renders
 * never wipe it.
 */
export function useSpotlight(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
  onHotChange?: (hot: boolean) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let rect: DOMRect | null = null;
    const invalidate = () => {
      rect = null;
    };
    const enter = () => {
      rect = el.getBoundingClientRect();
      el.setAttribute("data-hot", "");
      window.addEventListener("scroll", invalidate, { passive: true });
      onHotChange?.(true);
    };
    const move = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(1)}px`);
      el.style.setProperty("--my", `${(e.clientY - rect.top).toFixed(1)}px`);
    };
    const leave = () => {
      el.removeAttribute("data-hot");
      rect = null;
      window.removeEventListener("scroll", invalidate);
      onHotChange?.(false);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", invalidate);
      el.removeAttribute("data-hot");
    };
  }, [ref, enabled, onHotChange]);
}
