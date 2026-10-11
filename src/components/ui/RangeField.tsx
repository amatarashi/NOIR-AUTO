"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, type StyleWithVars } from "@/lib/cn";

/** Digits that changed roll in (240ms); instant while dragging. */
function RollingValue({ text, instant }: { text: string; instant: boolean }) {
  return (
    <span className={cn("inline-flex", instant && "roll-instant")} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span key={`${i}-${ch}`} className="roll-char">
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * Custom range (§8.7): the native <input type=range> stays on top
 * (opacity 0, 44px tall) for keyboard, screen readers and touch; the
 * visual track / fill / thumb / tooltip underneath are driven by one
 * CSS variable `--p` (transform only).
 */
export function RangeField({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
  tip,
  valueText,
  minLabel,
  maxLabel,
  extra,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Value in the field header, e.g. "3 500 000 ₽". */
  display: string;
  /** Short value in the tooltip, e.g. "3,5 млн ₽". */
  tip: string;
  valueText: string;
  minLabel: string;
  maxLabel: string;
  /** Optional chip after the value (first-payment %). */
  extra?: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const [tipShown, setTipShown] = useState(false);
  const hideTimer = useRef(0);
  const progress = max > min ? (value - min) / (max - min) : 0;

  const showTip = () => {
    window.clearTimeout(hideTimer.current);
    setTipShown(true);
  };
  const hideTip = (delay: number) => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setTipShown(false), delay);
  };

  useEffect(() => {
    if (!dragging) return;
    const end = () => {
      setDragging(false);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setTipShown(false), 600);
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  return (
    <div
      className={cn("range", dragging && "is-dragging", tipShown && "show-tip")}
      style={{ "--p": progress.toFixed(4) } as StyleWithVars}
    >
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="eyebrow">
          {label}
        </label>
        <span className="flex items-center gap-3">
          <output htmlFor={id} className="text-title-lg tabular-nums text-ink-primary">
            <RollingValue text={display} instant={dragging} />
            <span className="sr-only">{display}</span>
          </output>
          {extra}
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={valueText}
          onChange={(e) => {
            onChange(Number(e.target.value));
            showTip();
          }}
          onPointerDown={() => {
            setDragging(true);
            showTip();
          }}
          onPointerEnter={showTip}
          onPointerLeave={() => {
            if (!dragging) hideTip(600);
          }}
          onFocus={showTip}
          onBlur={() => hideTip(0)}
          onKeyUp={() => hideTip(1200)}
          className="range-input"
        />
        <div className="range-track" aria-hidden="true">
          <div className="range-fill" />
          <div className="range-rail">
            <span className="range-hot" />
            <span className="range-thumb" />
            <span className="range-tip">{tip}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-small tabular-nums text-ink-muted" aria-hidden="true">
        <span>{minLabel}</span>
        <span className="flex flex-1 justify-between px-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className="block h-1.5 w-px bg-onyx-600" />
          ))}
        </span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
