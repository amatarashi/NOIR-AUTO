"use client";

import { useState } from "react";
import { Container } from "./Container";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion/Reveal";
import { FAQ_ITEMS } from "@/data/faq";
import { cn } from "@/lib/cn";

const POOLS = "radial-gradient(55% 40% at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 65%)";

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <Section id="faq" tone="onyx" pools={POOLS} aria-labelledby="faq-title">
      <Container>
        <div className="mx-auto max-w-[860px]">
          <SectionHeading layout="stack" num="05" eyebrow="FAQ" id="faq-title" before="Частые" accent="вопросы" />

          <Reveal className="glass overflow-hidden rounded-xl">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={cn("faq-row", index > 0 && "border-t border-onyx-700", isOpen && "is-open")}>
                  <span className="faq-strip" aria-hidden="true" />
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-panel`}
                      id={`${item.id}-button`}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-center gap-4 px-5 py-6 text-left focus-visible:outline-offset-[-3px] md:gap-6 md:px-8 md:py-7"
                    >
                      <span className="eyebrow w-6 shrink-0 text-ink-faint" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-title text-ink-primary md:text-title-lg">{item.question}</span>
                      <span className="btn icon-circle icon-circle-sm shrink-0" aria-hidden="true">
                        <span className="magnet-inner">
                          <span className="faq-icon-pearl" />
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="faq-icon-glyph">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </h3>
                  <div id={`${item.id}-panel`} role="region" aria-labelledby={`${item.id}-button`} className="accordion">
                    <div>
                      <p className="accordion-text max-w-[64ch] px-5 pb-7 text-body text-ink-secondary md:pl-[4.5rem] md:pr-8 md:text-body-lg">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
