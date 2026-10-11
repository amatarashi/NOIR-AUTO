import { useEffect, type RefObject } from "react";
import { useSpring } from "framer-motion";
import { useFx } from "@/lib/fx";
import { springs } from "@/lib/motion";

/**
 * Magnetic buttons (§5.4). One shared, rAF-coalesced pointermove listener
 * for every magnet; the hit area never moves — only `.magnet-inner`
 * (and the label a bit further) is offset by springs.
 */
type Magnet = {
  el: HTMLElement;
  active: boolean;
  update: (dx: number, dy: number) => void;
  reset: () => void;
};

const ZONE = 48;
const magnets = new Set<Magnet>();
let lastEvent: PointerEvent | null = null;
let raf = 0;

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

function flush() {
  raf = 0;
  const e = lastEvent;
  if (!e) return;
  const vh = window.innerHeight;
  magnets.forEach((m) => {
    const r = m.el.getBoundingClientRect();
    const onScreen = r.width > 0 && r.bottom > -ZONE && r.top < vh + ZONE;
    const inside =
      onScreen &&
      e.clientX > r.left - ZONE &&
      e.clientX < r.right + ZONE &&
      e.clientY > r.top - ZONE &&
      e.clientY < r.bottom + ZONE;
    if (inside) {
      m.update(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      m.active = true;
    } else if (m.active) {
      m.reset();
      m.active = false;
    }
  });
}

function onMove(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  lastEvent = e;
  if (!raf) raf = requestAnimationFrame(flush);
}

function resetAll() {
  magnets.forEach((m) => {
    m.reset();
    m.active = false;
  });
}

function register(m: Magnet) {
  magnets.add(m);
  if (magnets.size === 1) {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetAll);
  }
  return () => {
    magnets.delete(m);
    if (magnets.size === 0) {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", resetAll);
    }
  };
}

export function useMagnetic(ref: RefObject<HTMLElement>, enabled: boolean) {
  const { fx } = useFx();
  const x = useSpring(0, springs.magnet);
  const y = useSpring(0, springs.magnet);
  const lx = useSpring(0, springs.magnet);
  const ly = useSpring(0, springs.magnet);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !fx) return;
    const magnet: Magnet = {
      el,
      active: false,
      update(dx, dy) {
        x.set(clamp(dx * 0.35, 14));
        y.set(clamp(dy * 0.35, 14));
        lx.set(clamp(dx * 0.18, 6));
        ly.set(clamp(dy * 0.18, 6));
      },
      reset() {
        x.set(0);
        y.set(0);
        lx.set(0);
        ly.set(0);
      },
    };
    const unregister = register(magnet);
    return () => {
      unregister();
      magnet.reset();
    };
  }, [ref, enabled, fx, x, y, lx, ly]);

  return { x, y, lx, ly };
}
