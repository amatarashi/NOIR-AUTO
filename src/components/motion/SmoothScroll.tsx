"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig, cancelFrame, frame } from "framer-motion";
import { useFx } from "@/lib/fx";
import { scrollToTarget, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scroll (§5.7) on fine-pointer, no-reduced-motion devices,
 * driven by framer-motion's frame loop so `useScroll` stays in sync.
 * Also owns in-page anchor navigation (header offset, focus hand-off) and
 * the global MotionConfig (framer honours prefers-reduced-motion).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { fx } = useFx();

  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  useEffect(() => {
    if (!fx) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
    });
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);
    setLenis(lenis);
    return () => {
      cancelFrame(update);
      setLenis(null);
      lenis.destroy();
    };
  }, [fx]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href") ?? "";
      if (hash.length < 2) return;
      if (hash === "#top") {
        e.preventDefault();
        scrollToTarget("top");
        return;
      }
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      // Keep keyboard / screen-reader position in sync with the visual jump.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
