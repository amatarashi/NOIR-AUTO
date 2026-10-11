import type { Config } from "tailwindcss";

/**
 * Design tokens — design/spec-v2.md §4 «Lacquer & Light».
 * Monochrome only: obsidian → graphite → steel → chrome → white.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: { sm: "480px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        void: "#050506",
        onyx: {
          950: "#0A0A0C",
          900: "#0F1012",
          850: "#141518",
          800: "#1B1C20",
          700: "#26272C",
          600: "#34363C",
        },
        steel: "#9AA3B2",
        ink: {
          primary: "#F4F4F2",
          secondary: "#B6B8BE",
          muted: "#83858D",
          faint: "#5A5C63",
          inverse: "#0A0A0C",
        },
        error: { DEFAULT: "#E5484D", text: "#FF7A7E" },
      },
      backgroundImage: {
        "chrome-text":
          "linear-gradient(180deg,#FFFFFF 0%,#ECEDEF 30%,#A4A8B0 50%,#6E727A 54%,#C9CCD2 72%,#FFFFFF 100%)",
        "chrome-sheet":
          "linear-gradient(115deg,#5B5F66 0%,#D9DBDF 22%,#8A8E96 38%,#F7F7F8 55%,#9EA2AA 72%,#E4E5E8 88%,#6E727A 100%)",
        pearl: "linear-gradient(180deg,#FFFFFF 0%,#F1F2F4 38%,#D4D6DA 100%)",
        "glass-fill":
          "linear-gradient(180deg,rgba(255,255,255,0.060) 0%,rgba(255,255,255,0.018) 100%)",
        "glass-edge":
          "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.06) 32%,rgba(255,255,255,0.03) 70%,rgba(255,255,255,0.10) 100%)",
        "glass-edge-active":
          "linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.14) 40%,rgba(255,255,255,0.08) 70%,rgba(255,255,255,0.28) 100%)",
        sweep:
          "linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0.55) 48%,rgba(255,255,255,0.85) 50%,rgba(255,255,255,0.55) 52%,rgba(255,255,255,0) 62%,rgba(255,255,255,0) 100%)",
        "light-strip":
          "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.28) 50%,rgba(255,255,255,0) 100%)",
        "photo-fade":
          "linear-gradient(180deg,rgba(5,5,6,0) 40%,rgba(5,5,6,0.55) 75%,rgba(5,5,6,0.92) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        display: [
          "clamp(2.5rem, 1.2rem + 4.6vw, 4.75rem)",
          { lineHeight: "0.96", letterSpacing: "-0.045em", fontWeight: "300" },
        ],
        h2: [
          "clamp(2.25rem, 1.2rem + 3vw, 4rem)",
          { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "300" },
        ],
        h3: [
          "clamp(1.5rem, 1.1rem + 1.2vw, 2rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        title: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }],
        "title-lg": ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }],
        lead: ["1.0625rem", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        "lead-lg": ["1.25rem", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        "body-lg": ["1rem", { lineHeight: "1.65" }],
        small: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.005em", fontWeight: "500" }],
        "small-lg": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.005em", fontWeight: "500" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.24em", fontWeight: "600" }],
        price: ["1.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "300" }],
        "price-lg": ["1.75rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "300" }],
        figure: [
          "clamp(3rem, 2rem + 3vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "200" },
        ],
      },
      spacing: { 18: "4.5rem", 22: "5.5rem", 30: "7.5rem", 40: "10rem" },
      maxWidth: { container: "1280px", prose: "60ch" },
      borderRadius: { xs: "6px", sm: "10px", md: "14px", lg: "20px", xl: "28px", pill: "999px" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(0,0,0,0.85), 0 12px 24px -12px rgba(0,0,0,0.6)",
        float:
          "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 50px 100px -40px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.7)",
        pearl:
          "inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(255,255,255,0.28)",
        "pearl-hover":
          "inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 16px 48px -10px rgba(255,255,255,0.45), 0 0 0 1px rgba(255,255,255,0.35)",
        "glow-soft": "0 0 24px rgba(255,255,255,0.18)",
        "glow-thumb":
          "0 4px 12px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,255,255,0.06), 0 0 24px rgba(255,255,255,0.35)",
        "focus-field": "0 0 0 4px rgba(255,255,255,0.05), 0 0 28px rgba(255,255,255,0.10)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)",
        lacquer: "cubic-bezier(0.65, 0, 0.35, 1)",
        "in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
      },
      transitionDuration: {
        120: "120ms",
        240: "240ms",
        400: "400ms",
        700: "700ms",
        900: "900ms",
        1000: "1000ms",
        1200: "1200ms",
        1400: "1400ms",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "12%": { transform: "translate(-4%,-6%)" },
          "25%": { transform: "translate(-9%,3%)" },
          "37%": { transform: "translate(5%,-10%)" },
          "50%": { transform: "translate(-6%,8%)" },
          "62%": { transform: "translate(8%,2%)" },
          "75%": { transform: "translate(2%,9%)" },
          "87%": { transform: "translate(-3%,-3%)" },
        },
        "scroll-cue": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        sweep: "sweep 900ms cubic-bezier(0.65,0,0.35,1) 1",
        grain: "grain 1s steps(8) infinite",
        "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.83,0,0.17,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
