"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "../Container";
import { Section } from "../Section";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../motion/Reveal";
import { Segmented, type SegmentOption } from "../ui/Segmented";
import { CarCard } from "./CarCard";
import { CarDetailsModal } from "./CarDetailsModal";
import { CARS } from "@/data/cars";
import { ease } from "@/lib/motion";
import { CAR_TYPE_LABELS, type Car, type CarType } from "@/types/car";

type FilterValue = CarType | "all";

function modelsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} модель`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} модели`;
  return `${n} моделей`;
}

const count = (type: FilterValue) => (type === "all" ? CARS.length : CARS.filter((c) => c.type === type).length);

const FILTERS: SegmentOption<FilterValue>[] = (["all", "hybrid", "gasoline", "electric"] as const).map((value) => ({
  value,
  label: value === "all" ? "Все" : CAR_TYPE_LABELS[value],
  count: count(value),
  countLabel: modelsLabel(count(value)),
}));

const POOLS =
  "radial-gradient(60% 50% at 15% 0%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(45% 45% at 85% 40%, rgba(154,163,178,0.09) 0%, transparent 70%), radial-gradient(70% 40% at 50% 110%, rgba(255,255,255,0.04) 0%, transparent 70%)";

export function CatalogSection() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [selected, setSelected] = useState<{ car: Car; opener: HTMLElement | null } | null>(null);
  const filtered = useRef(false);
  const reduced = useReducedMotion();

  const filteredCars = useMemo(
    () => (filter === "all" ? CARS : CARS.filter((car) => car.type === filter)),
    [filter],
  );

  const openDetails = useCallback((car: Car, opener: HTMLElement | null) => setSelected({ car, opener }), []);
  const closeDetails = useCallback(() => setSelected(null), []);

  return (
    <Section id="catalog" pools={POOLS} aria-labelledby="catalog-title">
      <Container>
        <SectionHeading
          num="02"
          eyebrow="Каталог"
          id="catalog-title"
          before="Подберите автомобиль под свой"
          accent="тип поездок"
          subtitle="12 моделей на выбор — от городского электрохэтчбека до флагманского купе с бензиновым V6."
          action={
            <Segmented
              mode="tabs"
              layoutId="catalog-tab"
              ariaLabel="Фильтр по типу двигателя"
              options={FILTERS}
              value={filter}
              onChange={(value) => {
                filtered.current = true;
                setFilter(value);
              }}
            />
          }
        />

        <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                layout
                exit={
                  reduced
                    ? { opacity: 0, transition: { duration: 0.15 } }
                    : { opacity: 0, scale: 0.96, filter: "blur(6px)", transition: { duration: 0.3, ease: ease.inQuart } }
                }
                transition={{ layout: { duration: 0.7, ease: ease.outExpo } }}
                className="h-full"
              >
                <Reveal className="h-full" delay={(index % 3) * (filtered.current ? 60 : 80)}>
                  <CarCard car={car} position={index + 1} total={filteredCars.length} onDetails={openDetails} />
                </Reveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCars.length === 0 ? (
          <p className="py-12 text-center text-body text-ink-muted">
            В этой категории пока нет автомобилей — загляните чуть позже.
          </p>
        ) : null}
      </Container>

      <CarDetailsModal car={selected?.car ?? null} opener={selected?.opener ?? null} onClose={closeDetails} />
    </Section>
  );
}
