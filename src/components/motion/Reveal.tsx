"use client";

import { createElement, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn, type StyleWithVars } from "@/lib/cn";
import { observeOnce } from "@/lib/reveal";

type RevealVariant = "block" | "text" | "eyebrow" | "fade";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "span" | "p" | "li" | "article" | "dl" | "ul" | "aside";
  variant?: RevealVariant;
  /** ms, maps to --d */
  delay?: number;
  /** Controlled trigger (hero timeline). When omitted, reveals on scroll. */
  play?: boolean;
  children?: ReactNode;
};

/**
 * Scroll reveal (§5.9). Hidden state exists only under `html.js-motion`,
 * so server HTML is fully visible without JS. Variants: block (y 40,
 * scale .98), text (y 16 + blur), eyebrow (tracking + hairline), fade.
 */
export function Reveal({
  as = "div",
  variant = "block",
  delay = 0,
  play,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (play !== undefined) return;
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setInView(true));
  }, [play]);

  const shown = play ?? inView;
  const mergedStyle: StyleWithVars = { ...style, "--d": `${delay}ms` };

  return createElement(
    as,
    {
      ...rest,
      ref,
      "data-reveal": variant,
      className: cn(className, shown && "is-in"),
      style: mergedStyle,
    },
    children,
  );
}
