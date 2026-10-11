/**
 * One shared IntersectionObserver for every scroll reveal (§5.9 trigger:
 * once, amount 0.25, bottom margin −10%). Tall elements count as visible
 * once they cover a quarter of the viewport, so they can't get stuck.
 */
type Callback = () => void;

const callbacks = new Map<Element, Callback>();
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        const enough =
          entry.intersectionRatio >= 0.25 || entry.intersectionRect.height >= viewport * 0.25;
        if (!enough) continue;
        const cb = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        cb?.();
      }
    },
    { threshold: [0, 0.1, 0.25], rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

export function observeOnce(el: Element, cb: Callback) {
  if (!("IntersectionObserver" in window)) {
    cb();
    return () => {};
  }
  callbacks.set(el, cb);
  getObserver().observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}
