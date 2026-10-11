import type { CSSProperties } from "react";

/** Joins truthy class names. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Inline style that may carry CSS custom properties (`--p`, `--d`, …). */
export type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;
