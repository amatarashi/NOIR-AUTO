"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, useReducedMotion } from "framer-motion";
import { Container } from "../Container";
import { Section } from "../Section";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../motion/Reveal";
import { PearlButton } from "../ui/Button";
import { RangeField } from "../ui/RangeField";
import { Segmented, type SegmentOption } from "../ui/Segmented";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const MIN_PRICE = 1_500_000;
const MAX_PRICE = 9_000_000;
const PRICE_STEP = 50_000;
const TERMS = [12, 24, 36, 48, 60] as const;
type Term = (typeof TERMS)[number];
/** Representative annual rate used for the estimate; actual programs start from 3.9%. */
const ANNUAL_RATE = 9.9;

const currency = new Intl.NumberFormat("ru-RU");

function monthlyPayment(loanAmount: number, annualRatePct: number, months: number) {
  if (loanAmount <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return loanAmount / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (loanAmount * (monthlyRate * factor)) / (factor - 1);
}

/** Short tooltip value: "3,5 млн ₽" / "700 тыс. ₽". */
function shortRub(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽`;
  if (v >= 1_000) return `${Math.round(v / 1_000)} тыс. ₽`;
  return `${v} ₽`;
}

const TERM_OPTIONS: SegmentOption<Term>[] = TERMS.map((months) => ({ value: months, label: `${months} мес.` }));

const POOLS =
  "radial-gradient(40% 50% at 75% 50%, rgba(255,255,255,0.08) 0%, transparent 70%), radial-gradient(50% 40% at 10% 10%, rgba(154,163,178,0.06) 0%, transparent 70%)";

/** Payment counter (§8.7): tweens the text node directly, no React re-renders per frame. */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  const initial = useRef(currency.format(value));
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      current.current = value;
      el.textContent = currency.format(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: 0.6,
      ease: ease.outExpo,
      onUpdate: (v) => {
        current.current = v;
        el.textContent = currency.format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return <span ref={ref}>{initial.current}</span>;
}

export function Calculator() {
  const [price, setPrice] = useState(3_500_000);
  const [downPayment, setDownPayment] = useState(700_000);
  const [term, setTerm] = useState<Term>(36);

  const clampedDownPayment = Math.min(downPayment, price);
  const downPaymentPercent = Math.round((clampedDownPayment / price) * 100);
  const loanAmount = Math.max(price - clampedDownPayment, 0);

  const payment = useMemo(() => monthlyPayment(loanAmount, ANNUAL_RATE, term), [loanAmount, term]);
  const totalPaid = payment * term;
  const overpayment = Math.max(totalPaid - loanAmount, 0);
  const roundedPayment = Math.round(payment);

  const total = loanAmount + overpayment;
  const bodyShare = total > 0 ? loanAmount / total : 0;
  const overShare = total > 0 ? overpayment / total : 0;

  // Screen readers get the settled value only (debounced 400ms).
  const paymentText = `${currency.format(roundedPayment)} рублей в месяц`;
  const [announced, setAnnounced] = useState(paymentText);
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(paymentText), 400);
    return () => window.clearTimeout(t);
  }, [paymentText]);

  // Mobile sticky bar: section on screen, result panel not.
  const resultRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    setMounted(true);
    const section = document.getElementById("calculator");
    const result = resultRef.current;
    if (!section || !result) return;
    let sectionIn = false;
    let resultIn = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === section) sectionIn = e.isIntersecting;
        else resultIn = e.isIntersecting;
      });
      setShowBar(sectionIn && !resultIn);
    });
    io.observe(section);
    io.observe(result);
    return () => io.disconnect();
  }, []);

  return (
    <Section id="calculator" pools={POOLS} aria-labelledby="calculator-title">
      <Container>
        <SectionHeading
          num="06"
          eyebrow="Калькулятор"
          id="calculator-title"
          before="Рассчитайте"
          accent="ежемесячный"
          after="платёж"
          subtitle="Примерный расчёт для ориентира — точные условия зависят от банка-партнёра и выбранной модели."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="glass flex flex-col gap-12 rounded-xl px-5 pb-8 pt-10 sm:px-8 md:p-10 lg:col-span-7">
            <RangeField
              id="calc-price"
              label="Стоимость автомобиля"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              value={price}
              onChange={setPrice}
              display={`${currency.format(price)} ₽`}
              tip={shortRub(price)}
              valueText={`${currency.format(price)} рублей`}
              minLabel="1,5 млн"
              maxLabel="9 млн"
            />
            <RangeField
              id="calc-down"
              label="Первый взнос"
              min={0}
              max={price}
              step={PRICE_STEP}
              value={clampedDownPayment}
              onChange={setDownPayment}
              display={`${currency.format(clampedDownPayment)} ₽`}
              tip={shortRub(clampedDownPayment)}
              valueText={`${currency.format(clampedDownPayment)} рублей`}
              minLabel="0"
              maxLabel={shortRub(price).replace(" ₽", "")}
              extra={
                <span className="rounded-pill bg-white/[0.06] px-2.5 py-1 text-small tabular-nums text-ink-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  {downPaymentPercent}%
                </span>
              }
            />
            <div className="flex flex-col gap-4">
              <span id="calc-term-label" className="eyebrow">
                Срок кредита
              </span>
              <Segmented
                mode="pressed"
                layoutId="term"
                ariaLabelledBy="calc-term-label"
                compact
                options={TERM_OPTIONS}
                value={term}
                onChange={setTerm}
                className="self-start"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <div ref={resultRef} className="lg:sticky lg:top-28">
              <Reveal delay={120} className="glass glass-edge-active flex flex-col gap-8 rounded-xl p-6 sm:p-8 md:p-10">
                <div>
                  <p className="eyebrow">Ежемесячный платёж</p>
                  <p className="chrome-text mt-5 text-figure tabular-nums" aria-hidden="true">
                    <AnimatedNumber value={roundedPayment} />
                    <span className="ml-2 text-[0.5em]">₽</span>
                  </p>
                  <p className="sr-only" aria-live="polite">
                    {announced}
                  </p>
                </div>

                <div className="flex flex-col gap-3" aria-hidden="true">
                  <div className="relative h-1.5 overflow-hidden rounded-pill bg-onyx-800">
                    <span
                      className="hatch absolute inset-0 origin-right transition-transform duration-700 ease-out-expo"
                      style={{ transform: `scaleX(${overShare})` }}
                    />
                    <span
                      className="absolute inset-0 origin-left bg-chrome-sheet transition-transform duration-700 ease-out-expo"
                      style={{ transform: `scaleX(${bodyShare})` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-small text-ink-muted">
                    <span className="inline-flex items-center gap-2">
                      <i className="block h-1.5 w-3 rounded-pill bg-chrome-sheet" /> Тело кредита
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <i className="hatch block h-1.5 w-3 rounded-pill" /> Переплата
                    </span>
                  </div>
                </div>

                <dl className="flex flex-col text-small-lg">
                  {[
                    ["Сумма кредита", `${currency.format(Math.round(loanAmount))} ₽`],
                    [`Переплата за ${term} мес.`, `${currency.format(Math.round(overpayment))} ₽`],
                    ["Ставка (ориентир)", `${ANNUAL_RATE}% годовых`],
                  ].map(([label, value], i) => (
                    <div key={label} className={cn("flex items-center justify-between gap-4 py-3", i > 0 && "border-t border-onyx-700")}>
                      <dt className="text-ink-muted">{label}</dt>
                      <dd className="tabular-nums text-ink-primary">{value}</dd>
                    </div>
                  ))}
                </dl>

                <PearlButton href="#contacts" size="M" full>
                  Оформить заявку
                </PearlButton>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>

      {mounted
        ? createPortal(
            <div
              aria-hidden={!showBar}
              className={cn(
                "glass fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 flex h-16 items-center justify-between gap-4 rounded-pill pl-6 pr-2 transition-[transform,opacity] duration-500 ease-out-expo lg:hidden",
                showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
              )}
            >
              <span className="flex flex-col gap-1">
                <span className="text-[0.625rem] font-semibold uppercase leading-none tracking-[0.22em] text-ink-muted">Платёж</span>
                <span className="text-title tabular-nums text-ink-primary">{currency.format(roundedPayment)} ₽</span>
              </span>
              <a
                href="#contacts"
                tabIndex={showBar ? undefined : -1}
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-pearl px-5 text-small-lg font-semibold text-ink-inverse shadow-pearl"
              >
                К форме <span aria-hidden="true">→</span>
              </a>
            </div>,
            document.body,
          )
        : null}
    </Section>
  );
}
