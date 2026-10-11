"use client";

import {
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMagnetic } from "../motion/Magnetic";
import { useSweep } from "../motion/Sweep";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
  href: string;
};
type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
  href?: undefined;
};
type ElementProps = AnchorProps | NativeButtonProps;

type LacquerProps = ElementProps & {
  className: string;
  children: ReactNode;
  magnetic: boolean;
  /** Extra class for the sweep layer; `null` = no sweep. */
  sweepClass: string | null;
  ambient?: boolean;
};

/**
 * Shared shell (§6.1): the outer <a>/<button> is the fixed hit area and
 * focus target; `.magnet-inner` carries the surface, moves with the
 * magnet and clips the light sweep.
 */
function Lacquer({ className, children, magnetic, sweepClass, ambient = false, ...props }: LacquerProps) {
  const hostRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLElement>(null);
  const { x, y, lx, ly } = useMagnetic(hostRef, magnetic);
  useSweep(hostRef, layerRef, { enabled: sweepClass !== null, ambient });

  const inner = (
    <motion.span className="magnet-inner" style={{ x, y }}>
      <motion.span className="magnet-label" style={{ x: lx, y: ly }}>
        {children}
      </motion.span>
      {sweepClass !== null ? (
        <i ref={layerRef} className={cn("sweep", sweepClass)} aria-hidden="true" />
      ) : null}
    </motion.span>
  );

  if (props.href !== undefined) {
    const anchorProps = props as AnchorProps;
    return (
      <a ref={hostRef as Ref<HTMLAnchorElement>} className={className} {...anchorProps}>
        {inner}
      </a>
    );
  }
  const { type = "button", ...buttonProps } = props as NativeButtonProps;
  return (
    <button ref={hostRef as Ref<HTMLButtonElement>} type={type} className={className} {...buttonProps}>
      {inner}
    </button>
  );
}

type Common = { className?: string; children: ReactNode; magnetic?: boolean };

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Primary «Pearl». Full-width buttons are never magnetic (§8.8). */
export function PearlButton({
  size = "M",
  arrow = false,
  full = false,
  ambient = false,
  magnetic,
  className,
  children,
  ...props
}: Common &
  ElementProps & {
    size?: "L" | "M" | "S";
    arrow?: boolean;
    full?: boolean;
    ambient?: boolean;
  }) {
  return (
    <Lacquer
      {...props}
      className={cn("btn pearl", `pearl-${size}`, arrow && "has-arrow", full && "w-full", className)}
      magnetic={magnetic ?? !full}
      sweepClass="sweep-pearl"
      ambient={ambient}
    >
      {children}
      {arrow ? (
        <span className="pearl-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      ) : null}
    </Lacquer>
  );
}

/** Secondary «Glass». */
export function GlassButton({ magnetic = false, className, children, ...props }: Common & ElementProps) {
  return (
    <Lacquer {...props} className={cn("btn glass-btn", className)} magnetic={magnetic} sweepClass="sweep-glass">
      {children}
    </Lacquer>
  );
}

/** Round icon control (arrows, close, to-top, socials). Requires an accessible name. */
export function IconCircle({
  variant = "glass",
  size = 48,
  magnetic = true,
  sweep = false,
  className,
  children,
  ...props
}: Common &
  ElementProps & {
    "aria-label": string;
    variant?: "glass" | "pearl";
    size?: 48 | 44 | 40;
    sweep?: boolean;
  }) {
  return (
    <Lacquer
      {...props}
      className={cn(
        "btn icon-circle",
        variant === "pearl" && "is-pearl",
        size === 44 && "icon-circle-md",
        size === 40 && "icon-circle-sm",
        className,
      )}
      magnetic={magnetic}
      sweepClass={sweep ? (variant === "pearl" ? "sweep-pearl" : "sweep-glass") : null}
    >
      {children}
    </Lacquer>
  );
}
