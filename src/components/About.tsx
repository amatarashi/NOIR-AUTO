"use client";

import { useRef, type ReactNode } from "react";
import { Container } from "./Container";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion/Reveal";
import { useSpotlight } from "./motion/Spotlight";
import { useFx } from "@/lib/fx";

/** Icon paths use pathLength=1 so they can be "drawn" on reveal. */
const ADVANTAGES: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Гарантия до 5 лет",
    description: "Официальная гарантия производителя на все модели, включая тяговую батарею.",
    icon: <path className="draw" pathLength={1} d="M16 3l11 4v9c0 8-5 13-11 15-6-2-11-7-11-15V7l11-4z" />,
  },
  {
    title: "Сертифицированный сервис",
    description: "Собственный технический центр и оригинальные запчасти для каждой модели.",
    icon: (
      <path
        className="draw"
        pathLength={1}
        d="M25 9.5a5.5 5.5 0 01-7.4 5.2L9.4 22.9a2.4 2.4 0 01-3.4-3.4l8.2-8.2A5.5 5.5 0 0120.5 4l-4.5 4.5 1.5 1.5 4.5-4.5c1 1 1.5 2.4 1.5 4z"
      />
    ),
  },
  {
    title: "Trade-in за 1 день",
    description: "Оценим ваш автомобиль и оформим обмен с зачётом стоимости в тот же день.",
    icon: (
      <>
        <path className="draw" pathLength={1} d="M4 10h20l-5-5" />
        <path className="draw" pathLength={1} d="M28 22H8l5 5" />
      </>
    ),
  },
  {
    title: "Кредит от 3.9%",
    description: "Индивидуальные программы с банками-партнёрами и оформление прямо в салоне.",
    icon: (
      <>
        <circle className="draw" pathLength={1} cx="10" cy="10" r="3.5" />
        <circle className="draw" pathLength={1} cx="22" cy="22" r="3.5" />
        <path className="draw" pathLength={1} d="M24 8L8 24" />
      </>
    ),
  },
];

const POOLS =
  "radial-gradient(50% 45% at 50% 55%, rgba(154,163,178,0.09) 0%, transparent 70%), radial-gradient(60% 50% at 18% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)";

function AdvantageTile({ item, index }: { item: (typeof ADVANTAGES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { fx } = useFx();
  useSpotlight(ref, fx);

  return (
    <Reveal as="li" delay={index * 80} className="h-full">
      <div
        ref={ref}
        className="tile glass flex h-full min-h-[260px] flex-col justify-between gap-10 rounded-lg p-7 lg:min-h-[300px] lg:p-8"
      >
        <span className="spot-fill" aria-hidden="true" />
        <span className="spot-edge" aria-hidden="true" />
        <div className="medallion" aria-hidden="true">
          <span className="medallion-halo" />
          <span className="chrome-ring" />
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            stroke="#F4F4F2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="medallion-icon"
          >
            {item.icon}
          </svg>
        </div>
        <div className="relative flex flex-col gap-3">
          <h3 className="text-title text-ink-primary md:text-title-lg">{item.title}</h3>
          <p className="text-body text-ink-secondary md:text-body-lg">{item.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function About() {
  return (
    <Section id="advantages" tone="onyx" pools={POOLS} aria-labelledby="advantages-title">
      <div className="dot-grid" aria-hidden="true" />
      <Container>
        <SectionHeading
          num="03"
          eyebrow="Почему мы"
          id="advantages-title"
          before="Салон, которому доверяют"
          accent="на годы"
          after="вперёд"
          subtitle="Не только продажа — полное сопровождение автомобиля от покупки до планового сервиса."
        />
        <ul className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((item, index) => (
            <AdvantageTile key={item.title} item={item} index={index} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
