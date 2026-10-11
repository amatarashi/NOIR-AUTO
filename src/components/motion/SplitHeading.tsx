"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { cn, type StyleWithVars } from "@/lib/cn";
import { observeOnce } from "@/lib/reveal";

type Unit = { text: string; accent?: boolean };

/** Split on regular whitespace only — NBSP keeps "заявку —" together. */
const words = (s: string) => s.split(/[ \t\n]+/).filter(Boolean);

/**
 * Line-by-line mask reveal for h1/h2 (§5.9). Exactly one accent fragment
 * (Cormorant italic chrome) per heading — enforced by the props shape.
 * Lines are measured after layout (and again after web fonts load or the
 * width changes); before that the whole text is a single masked line, so
 * nothing flashes. The accessible name is the plain text via aria-label.
 */
export function SplitHeading({
  as: Tag = "h2",
  before = "",
  accent,
  after = "",
  className,
  play,
  delay = 0,
  id,
}: {
  as?: "h1" | "h2";
  before?: string;
  accent: string;
  after?: string;
  className?: string;
  play?: boolean;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<number[][] | null>(null);
  const [inView, setInView] = useState(false);

  const units = useMemo<Unit[]>(
    () => [
      ...words(before).map((text) => ({ text })),
      { text: accent, accent: true },
      ...words(after).map((text) => ({ text })),
    ],
    [before, accent, after],
  );
  const label = units.map((u) => u.text).join(" ");

  // Measure word tops → group into lines (runs before paint).
  useIsomorphicLayoutEffect(() => {
    if (lines) return;
    const el = ref.current;
    if (!el) return;
    const groups: number[][] = [];
    let top: number | null = null;
    el.querySelectorAll<HTMLElement>("[data-unit]").forEach((node, i) => {
      const t = node.offsetTop;
      if (top === null || Math.abs(t - top) > 4) {
        groups.push([]);
        top = t;
      }
      groups[groups.length - 1].push(i);
    });
    setLines(groups);
  }, [lines]);

  // Re-split when the width changes (debounced) or fonts finish loading.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let width = el.offsetWidth;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (el.offsetWidth !== width) {
          width = el.offsetWidth;
          setLines(null);
        }
      }, 150);
    });
    ro.observe(el);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) setLines(null);
    });
    return () => {
      alive = false;
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (play !== undefined) return;
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setInView(true));
  }, [play]);

  const shown = play ?? inView;
  const groups = lines ?? [units.map((_, i) => i)];

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={label}
      className={cn("split", shown && "is-in", className)}
      style={{ "--d": `${delay}ms` } as StyleWithVars}
    >
      {groups.map((group, li) => (
        <span key={li} className="split-line" aria-hidden="true">
          <span className="split-inner" style={{ "--i": li } as StyleWithVars}>
            {group.map((ui, j) => {
              const unit = units[ui];
              return (
                <Fragment key={ui}>
                  <span
                    data-unit=""
                    className={unit.accent ? "split-word accent-serif" : "split-word"}
                    style={unit.accent ? ({ "--i": li } as StyleWithVars) : undefined}
                  >
                    {unit.text}
                  </span>
                  {j < group.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        </span>
      ))}
    </Tag>
  );
}
