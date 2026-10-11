"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion, type Variants } from "framer-motion";
import type { Car } from "@/types/car";
import { useMediaQuery } from "@/lib/fx";
import { ease } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { IconCircle, PearlButton } from "../ui/Button";
import { TypeChip } from "../ui/Primitives";
import { CarPhotoImage } from "./CarPhotoImage";

const priceFormatter = new Intl.NumberFormat("ru-RU");
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const panelDesktop: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: ease.outExpo } },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.35, ease: ease.inQuart } },
};
const panelSheet: Variants = {
  hidden: { opacity: 0, y: "100%" },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.outExpo, opacity: { duration: 0.3 } } },
  exit: { opacity: 0, y: "100%", transition: { duration: 0.35, ease: ease.inQuart } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.08, duration: 0.7, ease: ease.outExpo } }),
};

/**
 * Car details dialog (§8.3). Desktop: two-column glass panel; mobile:
 * bottom sheet with a drag handle (drag down > 120px closes).
 * Closes on ✕ / Esc / backdrop click, traps Tab, locks page scroll
 * (Lenis included) and returns focus to the control that opened it.
 */
export function CarDetailsModal({
  car,
  opener,
  onClose,
}: {
  car: Car | null;
  opener: HTMLElement | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isSheet = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();
  const dragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!car) return;
    const returnTo = opener;
    lockScroll("modal");
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true });
    }, 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll("modal");
      returnTo?.focus({ preventScroll: true });
    };
  }, [car, opener, onClose]);

  if (!mounted) return null;

  const photoReveal: Variants = reduced
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { clipPath: "inset(100% 0% 0% 0% round 22px)" },
        shown: { clipPath: "inset(0% 0% 0% 0% round 22px)", transition: { duration: 1, ease: ease.inOutQuint } },
      };

  return createPortal(
    <AnimatePresence>
      {car ? (
        <motion.div
          key="car-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="car-modal-title"
          className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-6"
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          {/* Click-outside backdrop: not focusable, not a button — the ✕ is
              the single accessible close control. */}
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-void/[0.72] backdrop-blur-[14px]"
            variants={{
              hidden: { opacity: 0 },
              shown: { opacity: 1, transition: { duration: 0.5, ease: ease.outQuart } },
              exit: { opacity: 0, transition: { duration: 0.35, ease: ease.inQuart } },
            }}
          />

          <motion.div
            ref={panelRef}
            variants={isSheet ? panelSheet : panelDesktop}
            drag={isSheet ? "y" : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            className="glass relative flex max-h-[92svh] w-full max-w-[960px] flex-col overflow-hidden rounded-t-xl shadow-float md:max-h-[calc(100svh-48px)] md:rounded-xl"
          >
            <div
              className="flex h-6 shrink-0 touch-none items-center justify-center md:hidden"
              onPointerDown={(e) => dragControls.start(e)}
              aria-hidden="true"
            >
              <span className="h-1 w-9 rounded-pill bg-white/25" />
            </div>

            <div data-lenis-prevent className="grid min-h-0 grid-cols-1 overflow-y-auto overscroll-contain p-1.5 pt-0 md:grid-cols-[5fr_6fr] md:pt-1.5">
              <motion.div variants={photoReveal} className="relative overflow-hidden rounded-[22px]">
                <motion.div
                  className="relative h-full"
                  variants={
                    reduced
                      ? undefined
                      : {
                          hidden: { scale: 1.12 },
                          shown: { scale: 1, transition: { duration: 1.4, ease: ease.outExpo } },
                        }
                  }
                >
                  <CarPhotoImage
                    photo={car.photo}
                    defaultPosition="50% 58%"
                    sizes="(min-width: 768px) 440px, 100vw"
                    className="aspect-[16/10] rounded-[22px] md:aspect-auto md:h-full md:min-h-[420px]"
                  />
                </motion.div>
              </motion.div>

              <div className="relative flex min-w-0 flex-col gap-5 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-6 md:px-8 md:pb-7 md:pt-9">
                <motion.div variants={item} custom={0}>
                  <TypeChip type={car.type} />
                </motion.div>
                <motion.div variants={item} custom={1} className="pr-12">
                  <h3 id="car-modal-title" className="text-h3 text-ink-primary">
                    {car.name}
                  </h3>
                  <p className="mt-1 text-small-lg text-ink-muted">{car.segment}</p>
                </motion.div>
                <motion.p variants={item} custom={2} className="text-body text-ink-secondary md:text-body-lg">
                  {car.description}
                </motion.p>
                <motion.dl variants={item} custom={3} className="grid grid-cols-3 gap-2">
                  {car.specs.map((spec) => (
                    <div key={spec.label} className="glass flex min-w-0 flex-col gap-1.5 rounded-md p-3.5">
                      <dt className="relative z-[3] text-[0.5625rem] font-semibold uppercase leading-tight tracking-[0.18em] text-ink-muted">
                        {spec.label}
                      </dt>
                      <dd className="relative z-[3] text-title tabular-nums text-ink-primary">{spec.value}</dd>
                    </div>
                  ))}
                </motion.dl>
                <motion.p variants={item} custom={4} className="chrome-text self-start text-price-lg tabular-nums">
                  {priceFormatter.format(car.price)} ₽
                </motion.p>
                <motion.div variants={item} custom={5}>
                  <PearlButton href="#contacts" size="L" full onClick={onClose}>
                    Оставить заявку
                  </PearlButton>
                </motion.div>
              </div>
            </div>

            <IconCircle
              data-close=""
              aria-label="Закрыть окно с деталями"
              onClick={onClose}
              className="absolute right-3 top-3 z-[5] md:right-4 md:top-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </IconCircle>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
