"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { cn, type StyleWithVars } from "@/lib/cn";
import { springs } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { PHONE_HREF, PHONE_NUMBER, WORK_HOURS } from "@/lib/constants";
import { IconCircle, PearlButton } from "./ui/Button";

export const NAV_LINKS = [
  { href: "#catalog", label: "Каталог", num: "02" },
  { href: "#advantages", label: "Преимущества", num: "03" },
  { href: "#reviews", label: "Отзывы", num: "04" },
  { href: "#faq", label: "FAQ", num: "05" },
  { href: "#calculator", label: "Калькулятор", num: "06" },
  { href: "#contacts", label: "Контакты", num: "07" },
];

/**
 * Floating glass pill header (§8.1): dissolves over the hero, turns to
 * glass after 24px, hides on fast scroll down past 600px (always visible
 * in the hero and near the footer), active-section capsule + progress
 * hairline. Mobile: glass burger + full-screen glass menu.
 */
export function SiteHeader({ brandName }: { brandName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuOpenRef = useRef(false);
  const { scrollYProgress } = useScroll();

  const [first, ...rest] = brandName.split(" ");

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 300;
      setScrolled(y > 24);
      if (y > lastY + 2 && y > 600 && !nearBottom && !menuOpenRef.current) setHidden(true);
      else if (y < lastY - 2 || y <= 600 || nearBottom) setHidden(false);
      lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Active section: the one crossing the middle band of the viewport.
  useEffect(() => {
    const ids = ["top", ...NAV_LINKS.map((l) => l.href.slice(1))];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : `#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    menuOpenRef.current = false;
    unlockScroll("menu");
    setMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    if (menuOpenRef.current) {
      closeMenu();
      return;
    }
    menuOpenRef.current = true;
    lockScroll("menu");
    setHidden(false);
    setMenuOpen(true);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && closeMenu();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => () => unlockScroll("menu"), []);

  return (
    <>
      <header className={cn("site-header", (scrolled || menuOpen) && "is-scrolled", hidden && "is-hidden")}>
        <div className="header-pill">
          <a href="#top" className="wordmark" aria-label={`${brandName}, наверх`}>
            <span className="wordmark-a">{first}</span> <span className="wordmark-b">{rest.join(" ")}</span>
          </a>

          <nav aria-label="Разделы" className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative isolate inline-flex h-10 items-center rounded-pill px-4 text-small-lg transition-colors duration-240 ease-out-quart",
                    isActive ? "text-ink-primary" : "text-ink-muted hover:text-ink-primary",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      transition={springs.navPill}
                      className="absolute inset-0 -z-10 rounded-pill bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      aria-hidden="true"
                    >
                      <span className="absolute -bottom-[9px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-ink-primary shadow-glow-soft" />
                    </motion.span>
                  ) : null}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <PearlButton href="#contacts" size="S" className="hidden lg:inline-flex">
              Оставить заявку
            </PearlButton>
            <IconCircle
              size={44}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
              className="lg:hidden"
            >
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="burger-line" />
                <span className="burger-line" />
              </span>
            </IconCircle>
          </div>

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left bg-chrome-sheet opacity-50"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn("mobile-menu lg:hidden", menuOpen && "is-open")}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Разделы" className="flex flex-col gap-1.5">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? undefined : -1}
              onClick={closeMenu}
              className="menu-item flex flex-col gap-1 py-1"
              style={{ "--i": i } as StyleWithVars}
            >
              <span className="eyebrow text-ink-faint" aria-hidden="true">{link.num}</span>
              <span className="text-[2.25rem] font-light leading-tight tracking-[-0.03em] text-ink-primary">
                {link.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu-item mt-auto flex flex-col gap-4 pt-10" style={{ "--i": NAV_LINKS.length } as StyleWithVars}>
          <PearlButton href="#contacts" size="L" full onClick={closeMenu} tabIndex={menuOpen ? undefined : -1}>
            Оставить заявку
          </PearlButton>
          <a
            href={`tel:${PHONE_HREF}`}
            tabIndex={menuOpen ? undefined : -1}
            className="text-center text-small-lg tabular-nums text-ink-muted"
          >
            {PHONE_NUMBER} · {WORK_HOURS}
          </a>
        </div>
      </div>
    </>
  );
}
