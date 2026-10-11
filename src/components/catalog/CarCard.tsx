"use client";

import type { Car } from "@/types/car";
import { TiltCard } from "../motion/TiltCard";
import { GlassButton, IconCircle } from "../ui/Button";
import { TypeChip } from "../ui/Primitives";
import { CarPhotoImage } from "./CarPhotoImage";

const priceFormatter = new Intl.NumberFormat("ru-RU");
const pad = (n: number) => String(n).padStart(2, "0");

export function CarCard({
  car,
  position,
  total,
  onDetails,
}: {
  car: Car;
  /** 1-based position in the current (filtered) list */
  position: number;
  total: number;
  onDetails: (car: Car, opener: HTMLElement | null) => void;
}) {
  const price = priceFormatter.format(car.price);

  return (
    <TiltCard
      onClick={(e) => {
        // Whole card opens details; real controls handle their own clicks.
        if ((e.target as HTMLElement).closest("a, button")) return;
        onDetails(car, e.currentTarget.querySelector<HTMLElement>("[data-details]"));
      }}
    >
      <div className="relative [transform-style:preserve-3d] [transform:translateZ(24px)]">
        <CarPhotoImage
          photo={car.photo}
          curtain
          defaultPosition="50% 62%"
          sizes="(min-width: 1280px) 380px, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
          className="aspect-[3/2] rounded-md"
        />
        <TypeChip type={car.type} className="absolute left-3 top-3 z-[3] [transform:translateZ(16px)]" />
        <span className="absolute right-4 top-[18px] z-[3] text-[0.625rem] font-semibold leading-none tracking-[0.22em] tabular-nums text-ink-faint" aria-hidden="true">
          {pad(position)} / {pad(total)}
        </span>
        <div className="pointer-events-none absolute inset-x-[18px] bottom-4 z-[3]">
          <h3 className="text-title text-ink-primary md:text-title-lg">{car.name}</h3>
          <p className="text-small text-ink-secondary">{car.segment}</p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-3 pb-3 pt-4 [transform-style:preserve-3d] sm:px-4 sm:pb-4">
        <dl className="grid grid-cols-3">
          {car.specs.map((spec, i) => (
            <div key={spec.label} className={i === 0 ? "flex min-w-0 flex-col gap-1.5 pr-3" : "flex min-w-0 flex-col gap-1.5 border-l border-onyx-700 px-3"}>
              <dt className="text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.18em] text-ink-muted">{spec.label}</dt>
              <dd className="text-small-lg tabular-nums text-ink-primary">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="my-4 h-px bg-onyx-700" aria-hidden="true" />

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-4">
          <div className="shrink-0 [transform:translateZ(16px)]">
            <p className="mb-2 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.2em] text-ink-muted">Цена от</p>
            <p className="car-price text-price tabular-nums text-ink-primary">
              {price}
              <span className="ml-1 text-[0.6em] text-ink-muted">₽</span>
              <span className="car-price-chrome" aria-hidden="true">
                {price}
                <span className="ml-1 text-[0.6em]">₽</span>
              </span>
            </p>
          </div>
          <div className="flex min-w-[188px] flex-1 items-center gap-2">
            <GlassButton
              data-details=""
              aria-label={`Подробнее о модели ${car.name}`}
              onClick={(e) => onDetails(car, e.currentTarget)}
              className="flex-1 [&>.magnet-inner]:px-5"
            >
              Подробнее
            </GlassButton>
            <IconCircle href="#contacts" variant="pearl" magnetic={false} sweep aria-label={`Оставить заявку на ${car.name}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </IconCircle>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
