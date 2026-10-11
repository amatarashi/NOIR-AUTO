"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "./Container";
import { Reveal } from "./motion/Reveal";
import { SplitHeading } from "./motion/SplitHeading";
import { PearlButton } from "./ui/Button";
import { Eyebrow, TextLink } from "./ui/Primitives";
import { useFx } from "@/lib/fx";
import { heroStartDelay, onIntroSkip } from "@/lib/intro";
import { cn } from "@/lib/cn";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=2400&q=80";

const TICKER = [
  { k: "Гарантия", v: "до 5 лет" },
  { k: "Кредит", v: "от 3.9%" },
  { k: "Trade-in", v: "за 1 день" },
];

/**
 * Cursor torch + lacquer reflection (§5.2): lerped in rAF (0.12/frame),
 * stops when settled, fades out when the pointer leaves the hero.
 * Rendered only with a fine pointer and motion allowed.
 */
function useTorch(heroRef: React.RefObject<HTMLElement>, fxRef: React.RefObject<HTMLDivElement>, enabled: boolean) {
  useEffect(() => {
    const hero = heroRef.current;
    const layer = fxRef.current;
    if (!enabled || !hero || !layer) return;
    let tx = 0;
    let ty = 0;
    let cx = -1;
    let cy = -1;
    let raf = 0;

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      layer.style.setProperty("--tx", `${cx.toFixed(1)}px`);
      layer.style.setProperty("--ty", `${cy.toFixed(1)}px`);
      raf = Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1 ? 0 : requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (cx < 0) {
        cx = r.width * 0.68;
        cy = r.height * 0.52;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const enter = () => layer.classList.remove("is-off");
    const leave = () => layer.classList.add("is-off");

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerenter", enter);
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerenter", enter);
      hero.removeEventListener("pointerleave", leave);
    };
  }, [heroRef, fxRef, enabled]);
}

export function Hero({ brandName }: { brandName: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const fxLayerRef = useRef<HTMLDivElement>(null);
  const { fx } = useFx();
  const [play, setPlay] = useState(false);

  // Choreography starts with the intro timeline (t = 1000ms) or right away.
  useEffect(() => {
    const timer = window.setTimeout(() => setPlay(true), heroStartDelay());
    const off = onIntroSkip(() => setPlay(true));
    return () => {
      window.clearTimeout(timer);
      off();
    };
  }, []);

  useTorch(heroRef, fxLayerRef, fx);

  // Parallax (§5.8) — transform only, disabled on touch / reduced motion.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const softY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const tickerOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      id="top"
      ref={heroRef}
      aria-labelledby="hero-title"
      className={cn("hero", play && "is-in")}
    >
      <motion.div className="hero-media" style={fx ? { y: mediaY, scale: mediaScale } : { scale: 1.04 }}>
        <div className="hero-photo">
          <div className="hero-photo-inner">
            <Image
              src={HERO_PHOTO}
              alt="Тёмный седан в профиль, контурный свет на лакированном кузове"
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1737px) 1320px, (min-width: 768px) 76vw, 132vw"
              className="photo-grade-hero object-cover object-[70%_55%] md:object-[62%_60%]"
            />
          </div>
        </div>
      </motion.div>

      <motion.div className="hero-soft" style={fx ? { y: softY } : undefined} aria-hidden="true" />
      {fx ? (
        <div ref={fxLayerRef} className="hero-fx" aria-hidden="true">
          <div className="hero-torch" />
          <div className="hero-reflect" />
        </div>
      ) : null}
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-horizon" aria-hidden="true" />

      <motion.div className="hero-content" style={fx ? { y: contentY, opacity: contentOpacity } : undefined}>
        <Container className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="flex min-w-0 flex-col items-start gap-7 lg:col-span-8">
            <Eyebrow label="Электро · Гибрид · Бензин" play={play} />
            <SplitHeading
              as="h1"
              id="hero-title"
              before="Автомобиль, который"
              accent="соответствует"
              after="вашему образу жизни"
              play={play}
              delay={120}
              className="text-display text-ink-primary"
            />
            <Reveal as="p" variant="text" play={play} delay={700} className="max-w-[44ch] text-lead text-ink-secondary md:text-lead-lg">
              {brandName} — салон гибридных, бензиновых и электрических автомобилей с честным trade-in, кредитом от
              3.9% и сервисом по гарантии до 5 лет.
            </Reveal>
            <Reveal
              variant="text"
              play={play}
              delay={860}
              className="mt-1 flex w-full flex-col items-stretch gap-1 sm:w-auto sm:flex-row sm:items-center sm:gap-7"
            >
              <PearlButton href="#contacts" size="L" arrow ambient={play} className="w-full sm:w-auto">
                Оставить заявку
              </PearlButton>
              <TextLink href="#catalog" className="justify-center sm:justify-start">
                Смотреть каталог
              </TextLink>
            </Reveal>
          </div>

          <motion.div className="min-w-0 lg:col-span-4" style={fx ? { opacity: tickerOpacity } : undefined}>
            <Reveal as="dl" play={play} delay={1600} className="ticker">
              {TICKER.map((t) => (
                <div key={t.k} className="ticker-cell glass">
                  <dt className="ticker-k">{t.k}</dt>
                  <dd className="ticker-v">{t.v}</dd>
                </div>
              ))}
            </Reveal>
          </motion.div>
        </Container>
      </motion.div>

      <div className="scroll-cue pointer-events-none absolute bottom-8 left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-3.5 lg:flex" aria-hidden="true">
        <i className="relative block h-14 w-px overflow-hidden bg-white/[0.12]">
          <span className="scroll-cue-line absolute inset-0 block bg-ink-primary motion-safe:animate-scroll-cue" />
        </i>
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink-muted [writing-mode:vertical-rl] [transform:rotate(180deg)]">
          Листайте
        </span>
      </div>
    </section>
  );
}
