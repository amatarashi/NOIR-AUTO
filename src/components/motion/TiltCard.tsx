"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useFx } from "@/lib/fx";
import { springs } from "@/lib/motion";
import { useSpotlight } from "./Spotlight";
import { useSweep } from "./Sweep";

const MAX_TILT = 6; // degrees (§5.3)

/**
 * Glass product card shell (§5.3 + §5.2 + §5.1): 3D tilt on springs,
 * cursor spotlight on fill and edge, card light sweep, float-shadow
 * crossfade. Tilt/spotlight only with a fine pointer and motion allowed;
 * on touch the card "lights up" while it crosses the middle of the screen.
 */
export function TiltCard({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const sweepRef = useRef<HTMLElement>(null);
  const { fx, canHover, reduced } = useFx();

  const rotateX = useSpring(0, springs.tilt);
  const rotateY = useSpring(0, springs.tilt);
  const lift = useSpring(0, springs.tilt);
  const y = useTransform(lift, (v) => v * -6);

  useSpotlight(ref, fx);
  useSweep(ref, sweepRef);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fx) return;
    let rect: DOMRect | null = null;
    let willChangeTimer = 0;
    const invalidate = () => {
      rect = null;
    };
    const enter = () => {
      rect = el.getBoundingClientRect();
      window.clearTimeout(willChangeTimer);
      el.style.willChange = "transform";
      lift.set(1);
      window.addEventListener("scroll", invalidate, { passive: true });
    };
    const move = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateX.set(-(py - 0.5) * MAX_TILT * 2);
      rotateY.set((px - 0.5) * MAX_TILT * 2);
    };
    const leave = () => {
      rotateX.set(0);
      rotateY.set(0);
      lift.set(0);
      rect = null;
      window.removeEventListener("scroll", invalidate);
      willChangeTimer = window.setTimeout(() => {
        el.style.willChange = "";
      }, 900);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", invalidate);
      window.clearTimeout(willChangeTimer);
      leave();
    };
  }, [fx, rotateX, rotateY, lift]);

  // Touch: "lights on" while the card passes the middle band of the screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || canHover || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.setAttribute("data-lit", "");
        else el.removeAttribute("data-lit");
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeAttribute("data-lit");
    };
  }, [canHover, reduced]);

  return (
    <div className="car-tilt">
      <motion.article
        ref={ref}
        onClick={onClick}
        className="car-card"
        style={fx ? { rotateX, rotateY, y } : undefined}
      >
        <span className="car-card-shadow" aria-hidden="true" />
        <span className="glass absolute inset-0 rounded-[inherit]" aria-hidden="true" />
        <span className="spot-fill" aria-hidden="true" />
        <span className="spot-edge" aria-hidden="true" />
        <span className="sweep-clip" aria-hidden="true">
          <i ref={sweepRef} className="sweep sweep-card" />
        </span>
        {children}
      </motion.article>
    </div>
  );
}
