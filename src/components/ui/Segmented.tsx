"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { springs } from "@/lib/motion";

export type SegmentOption<T extends string | number> = {
  value: T;
  label: string;
  /** Optional count shown as a superscript (`Электро ⁴`). */
  count?: number;
  /** Screen-reader suffix for the count, e.g. "4 модели". */
  countLabel?: string;
};

/**
 * Glass segmented control with a sliding pearl capsule (§8.3 / §8.7 / §8.8).
 * Modes keep the semantics each use-case already had:
 * - `tabs`    → role=tablist / tab + aria-selected (catalog filter)
 * - `pressed` → toggle buttons with aria-pressed (credit term)
 * - `radio`   → role=radiogroup, roving tabindex + arrow keys (form)
 */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  layoutId,
  mode,
  ariaLabel,
  ariaLabelledBy,
  compact = false,
  wrap = false,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
  mode: "tabs" | "pressed" | "radio";
  ariaLabel?: string;
  ariaLabelledBy?: string;
  compact?: boolean;
  wrap?: boolean;
  className?: string;
}) {
  const interacted = useRef(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (next: T) => {
    interacted.current = true;
    onChange(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== "radio") return;
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const current = options.findIndex((o) => o.value === value);
    const nextIndex = (current + step + options.length) % options.length;
    select(options[nextIndex].value);
    buttons.current[nextIndex]?.focus();
  };

  const role = mode === "tabs" ? "tablist" : mode === "radio" ? "radiogroup" : "group";

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onKeyDown={onKeyDown}
      className={cn("seg glass", compact && "seg-compact", wrap && "seg-wrap", className)}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        const stateProps =
          mode === "tabs"
            ? { role: "tab", "aria-selected": active }
            : mode === "radio"
              ? { role: "radio", "aria-checked": active, tabIndex: active ? 0 : -1 }
              : { "aria-pressed": active };
        return (
          <button
            key={String(option.value)}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            data-active={active}
            onClick={() => select(option.value)}
            className="seg-btn"
            {...stateProps}
          >
            {active ? (
              <motion.span layoutId={layoutId} className="seg-pill" transition={springs.segPill} aria-hidden="true">
                {interacted.current ? <i className="sweep sweep-pearl sweep-tab is-on" /> : null}
              </motion.span>
            ) : null}
            {option.label}
            {option.count !== undefined ? (
              <>
                <sup className="seg-sup" aria-hidden="true">
                  {option.count}
                </sup>
                {option.countLabel ? <span className="sr-only">, {option.countLabel}</span> : null}
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
