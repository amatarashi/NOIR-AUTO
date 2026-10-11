import type Lenis from "lenis";
import { prefersReducedNow } from "./fx";

/**
 * Single access point for page scrolling. Lenis exists only on
 * fine-pointer + no-reduced-motion devices; everything else falls back to
 * native scrolling. Locks are keyed so the modal, the mobile menu and the
 * intro can stack without releasing each other.
 */
let lenis: Lenis | null = null;
const locks = new Set<string>();

export const HEADER_OFFSET = 96;

function applyLocks() {
  const locked = locks.size > 0;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("scroll-locked", locked);
}

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis) applyLocks();
}

export function lockScroll(key: string) {
  locks.add(key);
  applyLocks();
}

export function unlockScroll(key: string) {
  if (!locks.delete(key)) return;
  applyLocks();
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** Scrolls to an element (with the floating-header offset) or to the top. */
export function scrollToTarget(target: HTMLElement | "top", opts: { duration?: number } = {}) {
  const isTop = target === "top";
  if (lenis) {
    lenis.scrollTo(isTop ? 0 : target, {
      offset: isTop ? 0 : -HEADER_OFFSET,
      duration: opts.duration ?? 1.4,
      easing: easeOutQuart,
      force: true,
    });
    return;
  }
  const top = isTop ? 0 : target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: prefersReducedNow() ? "auto" : "smooth" });
}
