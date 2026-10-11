"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Floating-label field (§8.8). The label moves with transform only
 * (`:focus` / `:not(:placeholder-shown)`), the example text is a real
 * placeholder that only becomes visible on focus. `shakeKey` changes
 * replay the one-off error shake.
 */
export function Field({
  id,
  label,
  error,
  valid,
  shakeKey,
  value,
  ...inputProps
}: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value"> & {
  id: string;
  label: string;
  value: string;
  error?: string;
  valid?: boolean;
  shakeKey?: number;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const errorId = `${id}-error`;

  useEffect(() => {
    const el = fieldRef.current;
    if (!el || !shakeKey) return;
    el.classList.remove("is-shaking");
    void el.offsetWidth;
    el.classList.add("is-shaking");
    const done = () => el.classList.remove("is-shaking");
    el.addEventListener("animationend", done, { once: true });
    return () => el.removeEventListener("animationend", done);
  }, [shakeKey]);

  return (
    <div>
      <div
        ref={fieldRef}
        className={cn("field", value && "is-filled", valid && "is-valid", error && "is-invalid")}
      >
        <input
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="field-input"
          {...inputProps}
        />
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <span className="field-beam" aria-hidden="true" />
        <svg className="field-ok" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div className={cn("field-msg", error && "is-shown")}>
        <div>
          {error ? (
            <p id={errorId} className="pt-2 text-small text-error-text">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
