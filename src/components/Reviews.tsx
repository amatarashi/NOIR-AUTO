"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "./Container";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion/Reveal";
import { IconCircle } from "./ui/Button";
import { REVIEWS } from "@/data/reviews";
import { prefersReducedNow } from "@/lib/fx";
import type { StyleWithVars } from "@/lib/cn";

const STAR_PATH = "M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5-4.9-4.5 6.6-.7L12 2.5z";
const GAP = 24;
const pad = (n: number) => String(n).padStart(2, "0");

const POOLS =
  "radial-gradient(55% 50% at 82% 10%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(45% 40% at 95% 70%, rgba(154,163,178,0.08) 0%, transparent 70%)";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" role="img" aria-label={`Оценка ${rating} из 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < rating;
          return (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={filled ? "star star-filled" : "star"}
              style={{ "--s": i } as StyleWithVars}
            >
              <path
                d={STAR_PATH}
                fill={filled ? "url(#star-chrome)" : "none"}
                stroke={filled ? "none" : "#34363C"}
                strokeWidth="1.2"
              />
            </svg>
          );
        })}
      </div>
      {rating < 5 ? (
        <span className="text-small tabular-nums text-ink-muted" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}

/** Engraved monogram (§8.5): conic-chrome ring + chrome italic initials. */
function Monogram({ initials }: { initials: string }) {
  return (
    <span className="monogram" aria-hidden="true">
      <span className="chrome-ring" />
      <span className="chrome-text font-serif text-[22px] font-medium italic leading-none tracking-[0.02em]">
        {initials}
      </span>
    </span>
  );
}

export function Reviews() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const step = useCallback(() => {
    const card = scrollerRef.current?.querySelector<HTMLElement>("[data-review-card]");
    return (card?.offsetWidth ?? 320) + GAP;
  }, []);

  const scrollByCards = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * step(), behavior: prefersReducedNow() ? "auto" : "smooth" });
  };

  // Progress thumb, counter and the dimming of partly hidden cards —
  // all reads first, then writes, once per frame.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      const visible = el.clientWidth / el.scrollWidth;
      const progress = max > 0 ? el.scrollLeft / max : 0;
      const box = el.getBoundingClientRect();
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-review-card]"));
      const dims = cards.map((card) => {
        const r = card.getBoundingClientRect();
        const shown = Math.min(r.right, box.right) - Math.max(r.left, box.left);
        return shown / r.width < 0.9;
      });
      const index = max > 0 && el.scrollLeft >= max - 2 ? cards.length - 1 : Math.round(el.scrollLeft / step());

      cards.forEach((card, i) => card.firstElementChild?.setAttribute("data-dim", String(dims[i])));
      if (thumbRef.current) {
        // Full-width thumb scaled to the visible share, moved by transform only.
        thumbRef.current.style.transform = `translateX(${(progress * (1 - visible) * 100).toFixed(2)}%) scaleX(${visible.toFixed(4)})`;
      }
      setActiveIndex(Math.min(Math.max(index, 0), cards.length - 1));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [step]);

  // Mouse drag-to-scroll on desktop; touch keeps native swipe + snap.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add("is-dragging");
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      const s = step();
      const target = Math.round(el.scrollLeft / s) * s;
      el.classList.remove("is-dragging");
      el.scrollTo({ left: target, behavior: prefersReducedNow() ? "auto" : "smooth" });
    };
    // Swallow the click that ends a drag so text selection / links don't fire.
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, [step]);

  const arrows = (
    <div className="hidden items-center gap-3 sm:flex">
      <IconCircle aria-label="Предыдущие отзывы" onClick={() => scrollByCards(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </IconCircle>
      <IconCircle aria-label="Следующие отзывы" onClick={() => scrollByCards(1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </IconCircle>
    </div>
  );

  return (
    <Section id="reviews" pools={POOLS} aria-labelledby="reviews-title">
      {/* Shared chrome gradient for filled stars */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="star-chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#C9CCD2" />
            <stop offset="100%" stopColor="#8A8E96" />
          </linearGradient>
        </defs>
      </svg>

      <Container>
        <SectionHeading
          num="04"
          eyebrow="Отзывы"
          id="reviews-title"
          before="Что говорят"
          accent="наши клиенты"
          subtitle="Реальные истории покупки — от выбора модели до первого планового ТО."
          action={arrows}
        />

        <div
          ref={scrollerRef}
          data-lenis-prevent
          tabIndex={0}
          role="region"
          aria-label="Отзывы клиентов, прокрутка по горизонтали"
          className="carousel -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-2 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {REVIEWS.map((review, index) => (
            <Reveal
              as="article"
              key={review.id}
              data-review-card=""
              delay={(index % 3) * 80}
              className="w-[86%] shrink-0 snap-start md:w-[48%] lg:w-[calc((100%-48px)/3)]"
            >
              <div className="review-card glass relative flex h-full flex-col gap-6 overflow-hidden rounded-lg p-7 md:p-8">
                <span
                  className="chrome-text pointer-events-none absolute -top-3 right-5 select-none font-serif text-[120px] leading-none opacity-[0.14]"
                  aria-hidden="true"
                >
                  “
                </span>
                <Stars rating={review.rating} />
                <p className="relative flex-1 text-lead text-ink-primary/[0.88]">{review.text}</p>
                <div className="flex items-center gap-4 border-t border-onyx-700 pt-5">
                  <Monogram initials={review.initials} />
                  <div className="min-w-0">
                    <p className="text-title text-ink-primary">{review.name}</p>
                    <p className="text-small text-ink-muted">{review.carModel}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-5" aria-hidden="true">
          <span className="relative block h-px w-40 overflow-hidden bg-onyx-700">
            <span ref={thumbRef} className="absolute inset-0 block origin-left bg-chrome-sheet" />
          </span>
          <span className="text-small tabular-nums text-ink-muted">
            {pad(activeIndex + 1)} / {pad(REVIEWS.length)}
          </span>
        </div>
      </Container>
    </Section>
  );
}
