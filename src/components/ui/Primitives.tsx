import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CarType } from "@/types/car";
import { CAR_TYPE_LABELS } from "@/types/car";
import { Reveal } from "../motion/Reveal";

/** Text link with the «reloading» hairline (§6.1). */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={cn("text-link", className)}>
      {children}
      <span className="text-link-arrow" aria-hidden="true">
        →
      </span>
      <i className="text-link-line" aria-hidden="true" />
    </a>
  );
}

/** Engine-type chip (§6.2): the type differs by dot shape, never by colour. */
export function TypeChip({ type, className }: { type: CarType; className?: string }) {
  return (
    <span className={cn("chip", className)}>
      <i className={cn("chip-dot", type === "electric" && "chip-dot-electric", type === "hybrid" && "chip-dot-hybrid")} aria-hidden="true" />
      {CAR_TYPE_LABELS[type]}
    </span>
  );
}

/** Eyebrow `— 02 / Каталог` (§6.3) with its own reveal. */
export function Eyebrow({
  num,
  label,
  play,
  delay = 0,
  className,
}: {
  num?: string;
  label: string;
  play?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal as="span" variant="eyebrow" play={play} delay={delay} className={cn("eyebrow", className)}>
      <span className="eyebrow-rule" aria-hidden="true" />
      {num ? <span className="eyebrow-num">{num}</span> : null}
      {num ? `/ ${label}` : label}
    </Reveal>
  );
}
