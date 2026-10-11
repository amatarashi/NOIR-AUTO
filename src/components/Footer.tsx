"use client";

import { useEffect, useRef } from "react";
import { Container } from "./Container";
import { NAV_LINKS } from "./SiteHeader";
import { IconCircle, PearlButton } from "./ui/Button";
import { SOCIALS } from "@/data/socials";
import { useFx } from "@/lib/fx";
import { scrollToTarget } from "@/lib/scroll";
import { ADDRESS, BRAND_TAGLINE, EMAIL, PHONE_HREF, PHONE_NUMBER, WORK_HOURS } from "@/lib/constants";

const linkClass = "footer-link text-small-lg text-ink-secondary";

/**
 * Footer (§8.9): four columns, then the giant chrome wordmark sinking into
 * the floor — a cursor-following reflection (lerp 0.06, fine pointer only)
 * and an ambient sweep every 9s while visible.
 */
export function Footer({ brandName }: { brandName: string }) {
  const footerRef = useRef<HTMLElement>(null);
  const giantRef = useRef<HTMLSpanElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const { fx, reduced } = useFx();
  const [first, ...rest] = brandName.split(" ");

  useEffect(() => {
    const footer = footerRef.current;
    const giant = giantRef.current;
    if (!fx || !footer || !giant) return;
    let target = 50;
    let current = 50;
    let raf = 0;
    const tick = () => {
      current += (target - current) * 0.06;
      giant.style.setProperty("--fx", `${current.toFixed(2)}%`);
      raf = Math.abs(target - current) < 0.05 ? 0 : requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = giant.getBoundingClientRect();
      target = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    footer.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      footer.removeEventListener("pointermove", move);
    };
  }, [fx]);

  useEffect(() => {
    const layer = sweepRef.current;
    if (reduced || !layer) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(layer);
    const run = () => {
      if (!visible) return;
      layer.classList.remove("is-on");
      void layer.offsetWidth;
      layer.classList.add("is-on");
    };
    const end = () => layer.classList.remove("is-on");
    layer.addEventListener("animationend", end);
    const interval = window.setInterval(run, 9000);
    return () => {
      io.disconnect();
      window.clearInterval(interval);
      layer.removeEventListener("animationend", end);
    };
  }, [reduced]);

  return (
    <footer ref={footerRef} className="section relative overflow-hidden bg-onyx-950 pt-24 lg:pt-30">
      <div className="light-strip" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(60% 50% at 50% 120%, rgba(255,255,255,0.06), transparent 70%)" }}
        aria-hidden="true"
      />
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
          <div className="flex flex-col items-start gap-5">
            <p className="wordmark">
              <span className="wordmark-a">{first}</span> <span className="wordmark-b">{rest.join(" ")}</span>
            </p>
            <p className="max-w-[34ch] text-small-lg text-ink-muted">{BRAND_TAGLINE}</p>
            <PearlButton href="#contacts" size="S">
              Оставить заявку
            </PearlButton>
          </div>

          <nav aria-label="Разделы сайта">
            <p className="eyebrow mb-5">Разделы</p>
            <ul className="grid gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-5">Контакты</p>
            <ul className="grid gap-2.5">
              <li>
                <a href={`tel:${PHONE_HREF}`} className={`${linkClass} tabular-nums`}>
                  {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className={linkClass}>
                  {EMAIL}
                </a>
              </li>
              <li className="text-small-lg text-ink-secondary">{ADDRESS}</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Режим работы</p>
            <p className="text-small-lg tabular-nums text-ink-secondary">{WORK_HOURS}</p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((social) => (
                <IconCircle key={social.label} href={social.href} size={40} aria-label={social.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {social.icon}
                  </svg>
                </IconCircle>
              ))}
            </div>
          </div>
        </div>

        <div className="giant mt-16 lg:mt-20" aria-hidden="true">
          <span ref={giantRef} className="giant-text">
            {brandName}
          </span>
          <span ref={sweepRef} className="giant-sweep">
            {brandName}
          </span>
        </div>

        <div className="flex flex-col-reverse items-start gap-5 border-t border-onyx-700 py-6 text-small text-ink-muted md:flex-row md:items-center md:justify-between">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {brandName}. Все права защищены.
          </p>
          <p>Название и автомобили в каталоге — демонстрационные.</p>
          <IconCircle aria-label="Наверх" onClick={() => scrollToTarget("top", { duration: 1.8 })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </IconCircle>
        </div>
      </Container>
    </footer>
  );
}
