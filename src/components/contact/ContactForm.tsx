"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { animate, useIsomorphicLayoutEffect, useReducedMotion } from "framer-motion";
import { CAR_TYPE_LABELS, type CarType } from "@/types/car";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { Field } from "../ui/Field";
import { PearlButton } from "../ui/Button";
import { Segmented, type SegmentOption } from "../ui/Segmented";

interface FormState {
  name: string;
  phone: string;
  carType: CarType | "";
}

type FieldName = "name" | "phone";
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_STATE: FormState = { name: "", phone: "", carType: "" };

const PHONE_PATTERN = /^[+]?[\d\s()-]{10,18}$/;

const RULES: Record<FieldName, (v: string) => string | undefined> = {
  name: (v) => (v.trim().length < 2 ? "Укажите имя — минимум 2 символа." : undefined),
  phone: (v) => (!PHONE_PATTERN.test(v.trim()) ? "Проверьте номер телефона, например +7 900 123-45-67." : undefined),
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(RULES) as FieldName[]).forEach((field) => {
    const message = RULES[field](values[field]);
    if (message) errors[field] = message;
  });
  return errors;
}

const TYPE_OPTIONS: SegmentOption<CarType | "">[] = [
  { value: "hybrid", label: CAR_TYPE_LABELS.hybrid },
  { value: "gasoline", label: CAR_TYPE_LABELS.gasoline },
  { value: "electric", label: CAR_TYPE_LABELS.electric },
  { value: "", label: "Не определился(ась)" },
];

/** Success state (§8.8): chrome ring + check drawn by stroke-dashoffset, then a sweep. */
function SuccessMessage({ onAgain }: { onAgain: () => void }) {
  const [drawn, setDrawn] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sweepRef = useRef<HTMLElement>(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    const raf = requestAnimationFrame(() => setDrawn(true));
    const t = window.setTimeout(() => sweepRef.current?.classList.add("is-on"), 900);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-start gap-5 py-2", drawn && "is-drawn")}>
      <div className="relative h-16 w-16 overflow-hidden rounded-pill" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="success-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset=".5" stopColor="#8A8E96" />
              <stop offset="1" stopColor="#E4E5E8" />
            </linearGradient>
          </defs>
          <circle className="ring-draw" pathLength={1} cx="32" cy="32" r="30" stroke="url(#success-chrome)" strokeWidth="1.2" />
          <path className="ring-draw ring-draw-late" pathLength={1} d="M22 33l7 7 14-15" stroke="#F4F4F2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <i ref={sweepRef} className="sweep" />
      </div>
      <h3 ref={titleRef} tabIndex={-1} className="text-h3 text-ink-primary">
        Заявка принята, мы свяжемся с вами
      </h3>
      <p className="text-body-lg text-ink-secondary">Обычно перезваниваем в течение 30 минут в рабочее время.</p>
      <button
        type="button"
        onClick={onAgain}
        className="text-small-lg text-ink-muted underline underline-offset-4 transition-colors duration-240 hover:text-ink-primary"
      >
        Отправить ещё одну заявку
      </button>
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [valid, setValid] = useState<Partial<Record<FieldName, boolean>>>({});
  const [shake, setShake] = useState<Record<FieldName, number>>({ name: 0, phone: 0 });
  const [submitted, setSubmitted] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fromHeight = useRef<number | null>(null);
  const focusNameNext = useRef(false);
  const reduced = useReducedMotion();

  // Collapse/expand the panel between form and success (height, 600ms out-expo).
  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const start = fromHeight.current;
    fromHeight.current = null;
    if (!wrap || !inner || start === null || reduced) return;
    const end = inner.offsetHeight;
    wrap.style.overflow = "hidden";
    const controls = animate(wrap, { height: [start, end] }, {
      duration: 0.6,
      ease: ease.outExpo,
      onComplete: () => {
        wrap.style.height = "";
        wrap.style.overflow = "";
      },
    });
    return () => {
      controls.stop();
      wrap.style.height = "";
      wrap.style.overflow = "";
    };
  }, [submitted, reduced]);

  useEffect(() => {
    if (!submitted && focusNameNext.current) {
      focusNameNext.current = false;
      document.getElementById("contact-name")?.focus();
    }
  }, [submitted]);

  const checkField = (field: FieldName, value: string) => {
    const message = RULES[field](value);
    setErrors((prev) => ({ ...prev, [field]: message }));
    setValid((prev) => ({ ...prev, [field]: !message }));
  };

  const update = (field: FieldName, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) checkField(field, value);
    else if (valid[field]) setValid((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setValid({ name: !nextErrors.name, phone: !nextErrors.phone });
    const invalid = (Object.keys(nextErrors) as FieldName[]).filter((f) => nextErrors[f]);
    if (invalid.length > 0) {
      setShake((s) => {
        const next = { ...s };
        invalid.forEach((f) => (next[f] += 1));
        return next;
      });
      document.getElementById(`contact-${invalid[0]}`)?.focus();
      return;
    }
    // MVP: no backend — this just simulates a successful submission.
    fromHeight.current = wrapRef.current?.offsetHeight ?? null;
    setSubmitted(true);
    setValues(INITIAL_STATE);
    setValid({});
  };

  const again = () => {
    fromHeight.current = wrapRef.current?.offsetHeight ?? null;
    focusNameNext.current = true;
    setSubmitted(false);
  };

  return (
    <div ref={wrapRef}>
      <div ref={innerRef}>
        {submitted ? (
          <SuccessMessage onAgain={again} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                id="contact-name"
                label="Имя"
                type="text"
                autoComplete="name"
                placeholder="Иван Иванов"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={(e) => e.target.value && checkField("name", e.target.value)}
                error={errors.name}
                valid={valid.name}
                shakeKey={shake.name}
              />
              <Field
                id="contact-phone"
                label="Телефон"
                type="tel"
                autoComplete="tel"
                placeholder="+7 900 123-45-67"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={(e) => e.target.value && checkField("phone", e.target.value)}
                error={errors.phone}
                valid={valid.phone}
                shakeKey={shake.phone}
              />
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <span id="contact-type-label" className="eyebrow">
                Тип авто
              </span>
              <Segmented
                mode="radio"
                layoutId="car-type"
                ariaLabelledBy="contact-type-label"
                options={TYPE_OPTIONS}
                value={values.carType}
                onChange={(carType) => setValues((v) => ({ ...v, carType }))}
                wrap
                className="self-start"
              />
            </div>

            <PearlButton type="submit" size="L" full className="mt-3">
              Отправить заявку
            </PearlButton>
            <p className="text-center text-small text-ink-muted">Перезвоним в течение 30 минут в рабочее время.</p>
          </form>
        )}
      </div>
    </div>
  );
}
