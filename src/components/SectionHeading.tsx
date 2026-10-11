import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./motion/Reveal";
import { SplitHeading } from "./motion/SplitHeading";
import { Eyebrow } from "./ui/Primitives";

/**
 * Section header (§6.3). Desktop: eyebrow + h2 in 7/12 columns on the left,
 * subtitle + action in the right column, bottom-aligned. `stack` keeps
 * everything in one column (narrow FAQ layout).
 */
export function SectionHeading({
  num,
  eyebrow,
  id,
  before,
  accent,
  after,
  subtitle,
  action,
  layout = "split",
}: {
  num: string;
  eyebrow: string;
  id?: string;
  before?: string;
  accent: string;
  after?: string;
  subtitle?: string;
  action?: ReactNode;
  layout?: "split" | "stack";
}) {
  const split = layout === "split";
  return (
    <div
      className={cn(
        "mb-10 grid grid-cols-1 gap-6 lg:mb-16",
        split && "lg:grid-cols-12 lg:items-end lg:gap-6",
      )}
    >
      <div className={cn("flex min-w-0 flex-col gap-6", split && "lg:col-span-7")}>
        <Eyebrow num={num} label={eyebrow} />
        <SplitHeading id={id} before={before} accent={accent} after={after} className="text-h2 text-ink-primary" />
      </div>
      {subtitle || action ? (
        <div className={cn("flex min-w-0 flex-col items-start gap-6", split && "lg:col-span-4 lg:col-start-9")}>
          {subtitle ? (
            <Reveal as="p" variant="text" delay={300} className="max-w-[52ch] text-lead text-ink-secondary md:text-lead-lg">
              {subtitle}
            </Reveal>
          ) : null}
          {action ? (
            <Reveal variant="text" delay={420} className="max-w-full">
              {action}
            </Reveal>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
