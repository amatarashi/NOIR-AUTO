import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Grain } from "@/components/motion/Grain";
import { Intro } from "@/components/motion/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
  description:
    "Гибридные, бензиновые и электрические автомобили: каталог, trade-in, кредит от 3.9% и сервис с гарантией до 5 лет.",
};

export const viewport: Viewport = {
  themeColor: "#050506",
};

/**
 * Runs before first paint:
 * - `js-motion` enables reveal start states (no-JS → everything visible);
 * - `intro-on` shows the curtain once per session (not for reduced motion);
 * - `low-power` lowers glass blur on ≤4-core devices (§10);
 * - failsafe: if the app hasn't hydrated in 4s, drop the hidden states.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js-motion');window.__noirIntroT=performance.now();try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&sessionStorage.getItem('noir-intro')!=='1'){d.classList.add('intro-on')}}catch(e){}if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4){d.classList.add('low-power')}setTimeout(function(){if(!d.classList.contains('hydrated')){d.classList.remove('js-motion','intro-on')}},4000)})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="bg-void font-sans text-ink-primary antialiased">
        <Intro brandName={BRAND_NAME} />
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
      </body>
    </html>
  );
}
