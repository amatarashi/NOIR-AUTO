import type { ReactNode } from "react";
import { cn, type StyleWithVars } from "@/lib/cn";

/**
 * Page section shell (§7): G8 light strip on top, G7 studio-light pools
 * behind the content (`--pools`), and the soft void ↔ onyx-950 blend.
 */
export function Section({
  id,
  tone = "void",
  pools,
  className,
  children,
  "aria-labelledby": labelledBy,
}: {
  id: string;
  tone?: "void" | "onyx" | "void-to-onyx";
  pools: string;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "section py-24 lg:py-40",
        tone === "onyx" && "section-onyx",
        tone === "void-to-onyx" && "section-to-onyx",
        className,
      )}
      style={{ "--pools": pools } as StyleWithVars}
    >
      <div className="light-strip" aria-hidden="true" />
      {children}
    </section>
  );
}
