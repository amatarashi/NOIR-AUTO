"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_START_MS, INTRO_END_MS, introActive, introElapsed, skipIntro } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll";

const SKIP_EVENTS = ["wheel", "keydown", "pointerdown", "touchstart"] as const;

/**
 * Intro curtain (§5.10), once per session. The markup is server-rendered
 * and only displayed when the inline head script set `html.intro-on`
 * (no sessionStorage flag, no reduced motion) — no flash of content before
 * hydration. The timeline itself is CSS from first paint; this component
 * owns the scroll lock, skip-on-interaction and cleanup.
 */
export function Intro({ brandName }: { brandName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!introActive()) {
      setGone(true);
      return;
    }
    try {
      sessionStorage.setItem("noir-intro", "1");
    } catch {
      /* storage disabled: the intro simply shows again next time */
    }

    const timers: number[] = [];
    const finish = () => {
      document.documentElement.classList.remove("intro-on");
      unlockScroll("intro");
      setGone(true);
    };
    const elapsed = introElapsed();
    lockScroll("intro");
    timers.push(window.setTimeout(() => unlockScroll("intro"), Math.max(0, HERO_START_MS - elapsed)));
    timers.push(window.setTimeout(finish, Math.max(0, INTRO_END_MS + 100 - elapsed)));

    const skip = () => {
      SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
      if (introElapsed() > INTRO_END_MS - 300) return;
      ref.current?.classList.add("is-skip");
      skipIntro();
      unlockScroll("intro");
      timers.push(window.setTimeout(finish, 320));
    };
    SKIP_EVENTS.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));

    return () => {
      SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skip));
      timers.forEach((t) => window.clearTimeout(t));
      unlockScroll("intro");
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <div className="intro-inner">
        <div className="intro-mark">
          {brandName}
          <span className="sweep" />
        </div>
        <div className="intro-line" />
      </div>
    </div>
  );
}
