# NOIR AUTO — дизайн-спека v2 «Lacquer & Light»

Статус: **v2.0, заменяет `design/spec.md` (v1 сохраняется как история)**. Где v2 молчит — v1 не действует, спрашивать у дизайнера.
Прототип ключевых решений (hero, карточки, модалка, кнопки, слайдер, форма, футер): артефакт «NOIR Lacquer Prototype» — https://claude.ai/artifact/PtthTrcdAxtQoUygJAkJLb (исходник — `design/prototype-v2.html`, фото встроено как data-URI). Исходник прототипа — эталон значений: при расхождении с текстом прав текст этой спеки.

Стек без изменений: Next.js 14 App Router + TS + Tailwind 3 + framer-motion. Новые зависимости — раздел 12.

---

## 0. Концепция

**Ночной шоурум.** Сайт — тёмный зал, в котором единственный источник «цвета» — свет: софтбоксы над машинами, отражения на лаке, хром. Палитра строго монохромная (обсидиан → графит → сталь → хром → белый). Никаких фиолетово-бирюзовых градиентов: роль акцента теперь играет **блик** — диагональный световой проход по лакированной поверхности кнопок и карточек, и мягкое свечение, следующее за курсором, как фонарь в руке консультанта.

Три принципа:
1. **Материал, а не заливка.** Каждая поверхность — стекло (полупрозрачный слой + blur + тонкая светящаяся кромка сверху) или металл (хромовый градиент). Плоских `#1A1A1E`-прямоугольников больше нет.
2. **Масштабный контраст.** Огромные тонкие заголовки (Manrope 200–300) против мелких разреженных капс-лейблов 11px. Один акцентный фрагмент заголовка — курсивная антиква (Cormorant Garamond Italic) в хроме.
3. **Медленный, дорогой моушн.** Длинные expo-кривые, маски вместо fade, всё «выплывает», ничего не «прыгает». Эффекты дозированы: в одной зоне видимости — максимум один активный блик.

### Решение по акценту
Хроматического акцента **нет**. Обоснование: любой насыщенный цвет на чёрном (фиолетовый, бирюза, «кислотный» зелёный) мгновенно считывается как SaaS/крипто-шаблон; люкс-авто бренды (Porsche Design, Rolls-Royce Black Badge, Lucid) держат цвет в материале, а не в UI. Акцентную функцию выполняют: (а) белый «pearl» у главной кнопки — самый яркий объект на экране, (б) хромовый градиент на акцентном слове, (в) свет. Единственный сервисный цвет — ошибка формы `#E5484D` (не декоративный).

---

## 1. Палитра

### 1.1 Нейтрали (лёгкий холодный «стальной» сдвиг, не чистый серый)

| Токен | Hex | Применение |
|---|---|---|
| `void` | `#050506` | Фон страницы (глубже, чем v1 — даёт пространство свечениям) |
| `onyx-950` | `#0A0A0C` | Фон альтернативных секций (Преимущества, FAQ) |
| `onyx-900` | `#0F1012` | Подложка фото-окна в карточке, выпадашки |
| `onyx-850` | `#141518` | Непрозрачный fallback для glass (если нет `backdrop-filter`) |
| `onyx-800` | `#1B1C20` | Трек слайдера, неактивные сегменты |
| `onyx-700` | `#26272C` | Разделители внутри стекла (hairline) |
| `onyx-600` | `#34363C` | Неактивные звёзды, рамки в покое (непрозрачные) |
| `steel` | `#9AA3B2` | Только как rgba в холодных фоновых glow, никогда текстом |

### 1.2 Текст

| Токен | Hex | Контраст на `void` | На glass (≈`#121315`) |
|---|---|---|---|
| `ink-primary` | `#F4F4F2` | 18.9:1 | 17.4:1 |
| `ink-secondary` | `#B6B8BE` | 10.2:1 | 9.4:1 |
| `ink-muted` | `#83858D` | 5.4:1 | 5.0:1 |
| `ink-faint` | `#5A5C63` | 2.9:1 — **только декоративное** (индексы «01», хвосты линий), не для информации | — |
| `ink-inverse` | `#0A0A0C` | на pearl-кнопке ≥ 15:1 | — |

Правило: `ink-muted` — минимум для любого читаемого текста. На фото — только через оверлей, обеспечивающий фон темнее `rgba(5,5,6,.55)` под текстом.

### 1.3 Хром и свет (градиенты — ровно эти, новых не добавлять)

**G1 `chrome-text`** — вертикальный «горизонт», хромированный текст (акцентное слово, крупные цифры, вордмарк в футере):
```css
background: linear-gradient(180deg,
  #FFFFFF 0%, #ECEDEF 30%, #A4A8B0 50%, #6E727A 54%, #C9CCD2 72%, #FFFFFF 100%);
-webkit-background-clip: text; background-clip: text; color: transparent;
```
Тёмная полоса 50–54% — «линия горизонта» в отражении, именно она делает градиент хромом, а не просто серым. Контраст самой тёмной точки `#6E727A` на `void` = 4.2:1 — допустимо только для текста ≥ 32px (large text, AA 3:1).

**G2 `chrome-sheet`** — диагональный лист металла (заливка тонких элементов: заполненный трек слайдера, активная точка, hairline-линии):
```css
background: linear-gradient(115deg,
  #5B5F66 0%, #D9DBDF 22%, #8A8E96 38%, #F7F7F8 55%, #9EA2AA 72%, #E4E5E8 88%, #6E727A 100%);
```

**G3 `pearl`** — главная кнопка (объёмная, белая жемчужина):
```css
background: linear-gradient(180deg, #FFFFFF 0%, #F1F2F4 38%, #D4D6DA 100%);
```

**G4 `glass-fill`** — тело стеклянных карточек:
```css
background: linear-gradient(180deg, rgba(255,255,255,0.060) 0%, rgba(255,255,255,0.018) 100%);
backdrop-filter: blur(20px) saturate(140%);
```

**G5 `glass-edge`** — светящаяся кромка стекла (1px, через mask, см. 6.1):
```css
background: linear-gradient(180deg,
  rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 32%, rgba(255,255,255,0.03) 70%, rgba(255,255,255,0.10) 100%);
```
Верх ярче — свет падает сверху (софтбокс), низ слегка подсвечен отражённым светом пола.

**G6 `sweep`** — луч блика (используется только в эффекте 5.1):
```css
linear-gradient(105deg,
  rgba(255,255,255,0) 0%, rgba(255,255,255,0) 38%,
  rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.55) 52%,
  rgba(255,255,255,0) 62%, rgba(255,255,255,0) 100%);
```

**G7 `studio-light`** — фоновые glow-пятна секций (многослойные radial):
```css
/* базовый набор, позиции варьируются по секциям — см. раздел 8 */
radial-gradient(60% 50% at 18% 0%,  rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%),
radial-gradient(45% 40% at 88% 22%, rgba(154,163,178,0.08) 0%, rgba(154,163,178,0) 70%),
radial-gradient(70% 45% at 50% 110%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 70%);
```

**G8 `light-strip`** — «студийная световая полоса» на верхней границе секции (вместо скучного border):
```css
height: 1px;
background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%);
/* + под ней свечение: */
box-shadow: 0 0 24px 2px rgba(255,255,255,0.10);
/* ширина 70% контейнера, по центру */
```

**Служебные:** `error #E5484D` (обводка 60% alpha, текст ошибки — `#FF7A7E` для контраста 6.1:1 на `void`). Успех — белый (`ink-primary`) + хромовое кольцо, без зелёного.

`::selection { background: #F4F4F2; color: #0A0A0C; }`

---

## 2. Типографика

### 2.1 Пара шрифтов (все с кириллицей, через `next/font/google`)

| Роль | Шрифт | Веса | Почему |
|---|---|---|---|
| Display + UI + body + цифры | **Manrope** (variable) | 200, 300, 400, 500, 600 | Гротеск с геометричной, но тёплой кириллицей; тонкие начертания 200–300 на крупном кегле дают «дорогой» воздух (аналог Porsche Next / Lucid). Один вариативный файл вместо трёх семейств. Поддерживает `tnum` для цен. |
| Акцент (1 фрагмент на заголовок) | **Cormorant Garamond** Italic | 400, 500 (только italic) | Курсивная антиква = ручная работа, ателье, кожа салона. Контраст «тонкий гротеск + курсив-антиква» — классика luxury-редакционной вёрстки. Отличная кириллица. |

**Убираем:** Unbounded (широкий, «технологичный/игровой» — тянет в крипто/стартап-эстетику), Inter (самый шаблонный UI-шрифт, ничего не говорит о бренде), IBM Plex Mono (моноширинный = dev-tool, а не салон; цифры теперь Manrope `tabular-nums`).

```ts
// src/app/layout.tsx
import { Manrope, Cormorant_Garamond } from "next/font/google";
const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["200","300","400","500","600"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["400","500"], style: ["italic"], variable: "--font-cormorant", display: "swap" });
// <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
```
Проверка `tnum`: `font-variant-numeric: tabular-nums` на ценах/калькуляторе; если в браузере цифры «прыгают» при анимации счётчика — добавить `font-feature-settings: "tnum" 1` и фиксированную `min-width` в `ch`.

### 2.2 Шкала (fluid, `clamp`)

| Токен | Значение (mobile 375 → desktop 1440) | LH | Tracking | Вес | Где |
|---|---|---|---|---|---|
| `display` | `clamp(2.5rem, 1.2rem + 4.6vw, 4.75rem)` — 42 → 76px | 0.96 | -0.045em | 300 | h1 hero (3 строки на 1440, 5 на 375) |
| `h2` | `clamp(2.25rem, 1.2rem + 3vw, 4rem)` — 36 → 64px | 1.02 | -0.035em | 300 | заголовки секций |
| `h3` | `clamp(1.5rem, 1.1rem + 1.2vw, 2rem)` — 24 → 32px | 1.15 | -0.02em | 400 | модалка, результат |
| `title` | `1.25rem` → `1.375rem` (md) | 1.25 | -0.01em | 500 | имя авто, пункт преимуществ, вопрос FAQ |
| `lead` | `1.0625rem` → `1.25rem` | 1.55 | -0.005em | 400 | подзаголовки секций, hero-текст |
| `body` | `0.9375rem` → `1rem` | 1.65 | 0 | 400 | абзацы |
| `small` | `0.8125rem` → `0.875rem` | 1.5 | 0.005em | 500 | подписи, мета |
| `eyebrow` | `0.6875rem` (11px) | 1 | **0.24em**, uppercase | 600 | надзаголовки, лейблы спек |
| `price` | `1.5rem` → `1.75rem` | 1 | -0.02em | 300, tnum | цена в карточке |
| `figure` | `clamp(3rem, 2rem + 3vw, 4.5rem)` | 1 | -0.04em | 200, tnum | платёж в калькуляторе |
| `wordmark` | `0.9375rem` | 1 | 0.42em, uppercase | 600 | логотип в шапке |

**Акцентный фрагмент** `.accent-serif`: `font-family: var(--font-cormorant); font-style: italic; font-weight: 500; font-size: 1.08em; letter-spacing: -0.01em;` + `chrome-text` (G1). Compensating `1.08em` — у Cormorant меньше x-height. Максимум 1 фрагмент (1–2 слова) на заголовок; в абзацах — никогда.

Правила: веса 200/300 — только от 32px; ниже — минимум 400. `text-wrap: balance` на h1–h3, `text-wrap: pretty` на абзацах. Ширина абзацев ≤ 60ch. Кернинг: `font-kerning: normal; font-optical-sizing: auto;` на body. Цифры с пробелом-разделителем тысяч — неразрывный узкий пробел (`Intl.NumberFormat('ru-RU')` даёт ` `; ок).

---

## 3. Сетка, отступы, радиусы, глубина

- Контейнер: `max-width: 1280px` (было 1200 — шире воздух для крупной типографики), паддинги `px-5` (20px) mobile, `px-8` md, `px-12` lg.
- Секции: `py-24` (96px) mobile → `py-40` (160px) desktop. Заголовочный блок секции → контент: 64px desktop / 40px mobile.
- Радиусы: `r-xs 6px` (чипы), `r-sm 10px` (инпут-ячейки внутри), `r-md 14px` (фото-окно, инпуты), `r-lg 20px` (карточки), `r-xl 28px` (модалка, крупные панели), `pill 999px` (кнопки). **Правило вложенности:** внутренний радиус = внешний − паддинг (карточка 20 − паддинг 6 = фото 14).
- Тени (глубина = свет + тень вместе, всегда парой):

```css
--shadow-card:  0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(0,0,0,0.85), 0 12px 24px -12px rgba(0,0,0,0.6);
--shadow-float: 0 1px 0 0 rgba(255,255,255,0.08) inset, 0 50px 100px -40px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.7);
--shadow-pearl: inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(255,255,255,0.28);
--shadow-pearl-hover: inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 16px 48px -10px rgba(255,255,255,0.45), 0 0 0 1px rgba(255,255,255,0.35);
--glow-soft: 0 0 24px rgba(255,255,255,0.18);
```

---

## 4. Токены для `tailwind.config.ts`

```ts
// tailwind.config.ts — theme
screens: { sm: "480px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
extend: {
  colors: {
    void: "#050506",
    onyx: { 950: "#0A0A0C", 900: "#0F1012", 850: "#141518", 800: "#1B1C20", 700: "#26272C", 600: "#34363C" },
    steel: "#9AA3B2",
    ink: { primary: "#F4F4F2", secondary: "#B6B8BE", muted: "#83858D", faint: "#5A5C63", inverse: "#0A0A0C" },
    error: { DEFAULT: "#E5484D", text: "#FF7A7E" },
  },
  backgroundImage: {
    "chrome-text": "linear-gradient(180deg,#FFFFFF 0%,#ECEDEF 30%,#A4A8B0 50%,#6E727A 54%,#C9CCD2 72%,#FFFFFF 100%)",
    "chrome-sheet": "linear-gradient(115deg,#5B5F66 0%,#D9DBDF 22%,#8A8E96 38%,#F7F7F8 55%,#9EA2AA 72%,#E4E5E8 88%,#6E727A 100%)",
    pearl: "linear-gradient(180deg,#FFFFFF 0%,#F1F2F4 38%,#D4D6DA 100%)",
    "glass-fill": "linear-gradient(180deg,rgba(255,255,255,0.060) 0%,rgba(255,255,255,0.018) 100%)",
    "glass-edge": "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.06) 32%,rgba(255,255,255,0.03) 70%,rgba(255,255,255,0.10) 100%)",
    "glass-edge-active": "linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.14) 40%,rgba(255,255,255,0.08) 70%,rgba(255,255,255,0.28) 100%)",
    sweep: "linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0.55) 48%,rgba(255,255,255,0.85) 50%,rgba(255,255,255,0.55) 52%,rgba(255,255,255,0) 62%,rgba(255,255,255,0) 100%)",
    "light-strip": "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.28) 50%,rgba(255,255,255,0) 100%)",
    "photo-fade": "linear-gradient(180deg,rgba(5,5,6,0) 40%,rgba(5,5,6,0.55) 75%,rgba(5,5,6,0.92) 100%)",
  },
  fontFamily: {
    sans: ["var(--font-manrope)", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
    serif: ["var(--font-cormorant)", "Georgia", "Times New Roman", "serif"],
  },
  fontSize: {
    display: ["clamp(2.5rem, 1.2rem + 4.6vw, 4.75rem)", { lineHeight: "0.96", letterSpacing: "-0.045em", fontWeight: "300" }],
    h2: ["clamp(2.25rem, 1.2rem + 3vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "300" }],
    h3: ["clamp(1.5rem, 1.1rem + 1.2vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "400" }],
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
    figure: ["clamp(3rem, 2rem + 3vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "200" }],
  },
  spacing: { 18: "4.5rem", 22: "5.5rem", 30: "7.5rem", 40: "10rem" },
  maxWidth: { container: "1280px", prose: "60ch" },
  borderRadius: { xs: "6px", sm: "10px", md: "14px", lg: "20px", xl: "28px", pill: "999px" },
  boxShadow: {
    card: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(0,0,0,0.85), 0 12px 24px -12px rgba(0,0,0,0.6)",
    float: "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 50px 100px -40px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.7)",
    pearl: "inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(255,255,255,0.28)",
    "pearl-hover": "inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 -10px 18px -10px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.6), 0 16px 48px -10px rgba(255,255,255,0.45), 0 0 0 1px rgba(255,255,255,0.35)",
    "glow-soft": "0 0 24px rgba(255,255,255,0.18)",
    "glow-thumb": "0 4px 12px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,255,255,0.06), 0 0 24px rgba(255,255,255,0.35)",
    "focus-field": "0 0 0 4px rgba(255,255,255,0.05), 0 0 28px rgba(255,255,255,0.10)",
  },
  transitionTimingFunction: {
    "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
    "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
    "in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)",
    lacquer: "cubic-bezier(0.65, 0, 0.35, 1)",
    "in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
  },
  transitionDuration: { 120: "120ms", 240: "240ms", 400: "400ms", 700: "700ms", 900: "900ms", 1000: "1000ms", 1200: "1200ms", 1400: "1400ms" },
  keyframes: {
    sweep: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
    grain: {
      "0%,100%": { transform: "translate(0,0)" }, "12%": { transform: "translate(-4%,-6%)" }, "25%": { transform: "translate(-9%,3%)" },
      "37%": { transform: "translate(5%,-10%)" }, "50%": { transform: "translate(-6%,8%)" }, "62%": { transform: "translate(8%,2%)" },
      "75%": { transform: "translate(2%,9%)" }, "87%": { transform: "translate(-3%,-3%)" },
    },
    "scroll-cue": { "0%": { transform: "scaleY(0)", transformOrigin: "top" }, "45%": { transform: "scaleY(1)", transformOrigin: "top" }, "55%": { transform: "scaleY(1)", transformOrigin: "bottom" }, "100%": { transform: "scaleY(0)", transformOrigin: "bottom" } },
  },
  animation: {
    sweep: "sweep 900ms cubic-bezier(0.65,0,0.35,1) 1",
    grain: "grain 1s steps(8) infinite",
    "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.83,0,0.17,1) infinite",
  },
},
```
Удалить из конфига: `gradient-ignition`, `gradient-aurora`, `glow-violet`, `glow-teal`, `fontFamily.display/mono`, старые `h1…data` размеры (после миграции компонентов).

---

## 5. Рецепты эффектов (точные)

Все эффекты — только `transform`/`opacity`/CSS-переменные; ни одного `top/left/width` в анимации. Общий гейт для «тяжёлых» эффектов (tilt, cursor-glow, magnetic, параллакс, Lenis):
```ts
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduced  = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fx = canHover && !reduced;  // хук useFx() в src/lib/fx.ts, подписка на change
```

### 5.1 Light sweep (блик по лаку)
- **Где:** pearl-кнопки, glass-кнопки, карточки авто, карточка результата калькулятора (1 раз при изменении значения не нужно — только hover), активный таб каталога при переключении.
- **Слой:** `::after` (или `<span aria-hidden class="sweep">`) внутри элемента с `overflow:hidden; isolation:isolate;` и своим `border-radius`.
- **Геометрия:** `position:absolute; inset:-1px; width:100%;` фон G6 `sweep` с `background-size: 100% 100%` — сам луч ≈ 24% ширины элемента (стопы 38–62%), угол **105°** (почти вертикальный, с наклоном «вперёд», как отражение софтбокса на капоте).
- **Движение:** `transform: translateX(-100%) → translateX(100%)`.
  - Кнопки: **900ms** `cubic-bezier(0.65,0,0.35,1)` (lacquer), `opacity` луча 1, `mix-blend-mode: normal` для pearl; на pearl использовать сниженный луч `rgba(255,255,255,…)` нельзя (белое на белом) → для pearl луч **тёмно-светлый**: стопы `rgba(255,255,255,0) 40%, rgba(255,255,255,0.9) 49%, rgba(160,165,175,0.35) 51%, rgba(255,255,255,0) 60%` + `mix-blend-mode: overlay`, читается как пробегающая искра по жемчугу.
  - Карточки: **1200ms** lacquer, `opacity: 0.18` (поверх фото и стекла), луч на 30% шире (стопы 33–67%).
  - Glass-кнопки: 900ms, `opacity: 0.35`.
- **Триггер:** `pointerenter` (не CSS `:hover`, чтобы проход не обрывался на уходе курсора): добавить класс `is-sweeping` → по `animationend` снять. Повтор — не чаще 1 раза в 1200ms (троттлинг). Клавиатура: тот же проход на `:focus-visible`. Touch: проход на `pointerdown` (это ОК на мобиле — 1 раз, ощущение тактильности), но без повтора чаще 2с.
- **Ambient-проход (только главный CTA в hero):** автоматически 1 раз через 2.4с после окончания intro, затем каждые 7с, пока кнопка в зоне видимости и пользователь не наводился на неё. Отключается при reduced-motion.
- Reduced motion: анимации нет; вместо неё на hover `box-shadow` переход до `pearl-hover` за 240ms.

### 5.2 Cursor glow (фонарь)
**Hero:**
- Слой `div.hero-torch` `position:absolute; inset:0; pointer-events:none; z-index` над фото, под текстом.
- `background: radial-gradient(520px circle at var(--tx) var(--ty), rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0) 70%);`
- `mix-blend-mode: soft-light` (поэтому альфа высокая: soft-light «съедает» ~80% силы). На тёмных зонах фото почти невидим, а на хроме/лаке машины даёт живой блик — ровно то, что нужно. Слой лежит под текстом, текст не подсвечивается.
- Дополнительно — «отражение» на машине: слой `.hero-reflect` с `radial-gradient(260px 120px at var(--tx) var(--ty), rgba(255,255,255,0.35), transparent 70%)`, `mix-blend-mode: overlay`, маска по форме кадра (`mask-image: linear-gradient(180deg, transparent 30%, #000 50%, #000 80%, transparent 95%)` — работает только в полосе, где стоит машина).
- **Сглаживание:** lerp в rAF: `cur += (target - cur) * 0.12` за кадр (≈ 150ms догоняния на 60fps), пишем `style.setProperty('--tx', x+'px')`. Останавливаем rAF, когда `|target-cur| < 0.1px`.
- При уходе курсора из hero: `opacity 1 → 0` за 700ms out-quart. Стартовая позиция (до движения мыши): `--tx: 68%; --ty: 52%` — glow уже стоит на машине, кадр «освещён» в статике.
- На touch (`hover: none` / `pointer: coarse`) и при reduced-motion слои torch/reflect **не рендерятся** (иначе статичное пятно висит в пустом месте кадра).

**Карточки (spotlight):**
- `::before` на карточке, над glass-fill, под контентом: `radial-gradient(380px circle at var(--mx) var(--my), rgba(255,255,255,0.08), rgba(255,255,255,0) 45%)`.
- Кромка-спотлайт: на слое glass-edge (5.6) второй фон: `radial-gradient(240px circle at var(--mx) var(--my), rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)` — кромка «загорается» рядом с курсором.
- Координаты — локальные (`e.clientX - rect.left`), без lerp (карточка маленькая, прямое следование выглядит чётче); `opacity 0→1` за 400ms при входе, `1→0` за 700ms при выходе.
- Один `pointermove` слушатель на `CatalogGrid` (делегирование) + `rect` кэшировать на `pointerenter`, обновлять на scroll/resize.

### 5.3 3D-tilt карточек
- Обёртка `perspective: 1200px`; карточка `transform-style: preserve-3d; will-change: transform` (will-change только на время hover).
- **Макс. угол: 6°** по X и Y (`rotateX = -(py-0.5)*12deg`, `rotateY = (px-0.5)*12deg`), плюс `translateZ(0)` и подъём `translateY(-6px)`.
- Пружина framer-motion: `useSpring(value, { stiffness: 150, damping: 18, mass: 0.6 })`; возврат в 0 той же пружиной при `pointerleave`.
- Слои с глубиной (`translateZ`): фото-окно `24px`, бейдж типа `40px`, цена `16px` → лёгкий параллакс внутри карточки.
- Связь со светом: угол sweep-слоя не меняется, но spotlight (5.2) естественно сдвигается — этого достаточно.
- Фото: `scale 1.0 → 1.06` за **1200ms out-expo** на hover (медленный «наезд камеры»), + грейдинг «свет включили» (раздел 9.3) за 700ms.
- Тень при hover: `shadow-card` → `shadow-float` (кроссфейдом opacity второго слоя тени, а не transition box-shadow).

### 5.4 Магнитные кнопки
- Применяется: pearl CTA (hero, шапка, форма), круглые кнопки (стрелки отзывов, «наверх», закрыть модалку). Не применяется к кнопкам внутри карточек (конфликт с tilt) и к табам.
- **Радиус притяжения:** зона = bounding box кнопки + **48px** со всех сторон (невидимый `::before` с `inset:-48px` ловит `pointermove`).
- **Сила:** смещение кнопки = `(cursor - center) * 0.35`, лейбл/иконка внутри дополнительно `* 0.18` (итого лейбл «опережает» корпус — эффект объёма). Ограничение `max 14px` для кнопки, `max 6px` для лейбла.
- Пружина: `{ stiffness: 220, damping: 16, mass: 0.5 }`; возврат при `pointerleave` — та же пружина (лёгкий overshoot ≤ 2px — это и есть «дорогое» ощущение).
- Hit-area не смещается (магнит двигает только визуальный слой `span.magnet-inner`), чтобы клик не «убегал».

### 5.5 Film grain
- Один `div.grain` на весь сайт: `position:fixed; inset:-50%; width:200%; height:200%; pointer-events:none; z-index:60;` (над контентом, под модалкой 100 и курсором).
- Фон: SVG-шум как data-URI (генерировать один раз, не canvas):
  ```html
  <svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>
  ```
  `background-size: 180px 180px;` **`opacity: 0.045`**, без `mix-blend-mode` (blend на fullscreen-слое дорог).
- Анимация: `animation: grain 1s steps(8) infinite` (переставляет transform — дешёво, композитинг). Reduced motion: статичный шум (animation: none), opacity та же.
- Mobile: opacity `0.035`, без анимации (экономия батареи).

### 5.6 Glass-поверхность (базовый рецепт)
```css
.glass {
  position: relative; isolation: isolate;
  background: linear-gradient(180deg, rgba(255,255,255,0.060), rgba(255,255,255,0.018));
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}
.glass::before { /* светящаяся кромка 1px */
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: var(--edge, linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 32%, rgba(255,255,255,0.03) 70%, rgba(255,255,255,0.10)));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: #141518; } }
```
Blur имеет смысл только над чем-то (glow-пятна, фото). Поэтому каждая секция со стеклом обязана иметь под собой G7-пятна — иначе стекло = серая коробка.

### 5.7 Плавный скролл (Lenis)
- `lenis` (пакет `lenis`, не `@studio-freight/lenis`), провайдер `src/components/motion/SmoothScroll.tsx` (client), монтируется в `layout.tsx`.
- Параметры: `{ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1, syncTouch: false }`.
- rAF: связать с framer-motion (`frame.update` из `framer-motion`) или собственный rAF; `useScroll` framer продолжает работать (Lenis скроллит нативно).
- Якоря: перехват кликов по `a[href^="#"]` → `lenis.scrollTo(target, { offset: -96, duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) })`.
- Модалка открыта → `lenis.stop()`, закрыта → `lenis.start()`. Карусель отзывов и модалка — `data-lenis-prevent`.
- Удалить `* { scroll-behavior: smooth }` из globals.css (конфликтует с Lenis). Reduced motion или touch → Lenis не инициализируется, нативный скролл.

### 5.8 Параллакс hero
- `useScroll({ target: heroRef, offset: ["start start", "end start"] })` → `progress 0..1`.
- Фото (машина): `y: 0 → 18%` высоты, `scale: 1.08 → 1.0` (кадр «отъезжает» назад, машина движется **медленнее** текста).
- Текстовый блок: `y: 0 → -12%`, `opacity: 1 → 0` на `progress 0 → 0.7`.
- Glow-пятна: `y: 0 → 30%` (самый медленный дальний план).
- Спек-тикер (низ hero): `opacity 1 → 0` на `0 → 0.35`.
- Всё через `useTransform` → transform; на touch/reduced — статично.

### 5.9 Split-text и маски (хореография появления)
- **Заголовки h1/h2:** разбивка на **строки** (после layout, по `offsetTop` слов; хелпер `splitLines()` или `SplitType`-подобная утилита своими силами), каждая строка в `span.line{overflow:hidden; display:block; padding-bottom:0.08em}`, внутри `span.line-inner` анимируется `y: 110% → 0%`, `rotate: 2deg → 0` (лёгкий «наклон кулисы»), **1000ms out-expo**, stagger **90ms** между строками. Акцентное слово в той же строке дополнительно: `backgroundPosition` хрома `0 100% → 0 0` за 1400ms (хром «наливается» снизу вверх) — `background-size: 100% 200%`.
  - Доступность: исходный текст в `aria-label` на h-теге, split-спаны `aria-hidden`. Респлит на resize (debounce 150ms) — только если ширина изменилась.
  - Почему строки, а не буквы: у кириллицы длинные слова, побуквенная анимация на 50+ символов шумная и дешевит.
- **Eyebrow:** hairline-линия перед текстом `scaleX 0→1` (origin left) 700ms out-expo, текст — `opacity 0→1, letter-spacing 0.4em→0.24em` 900ms.
- **Абзацы:** `opacity 0→1, y 16px→0, filter: blur(6px)→blur(0)` 900ms out-expo, delay = после последней строки заголовка − 400ms.
- **Карточки/плитки:** `opacity 0→1, y 40px→0, scale .98→1` 1000ms out-expo, stagger **80ms**, max 6 элементов в каскаде (дальше — без задержки).
- **Фото:** маска-шторка `clip-path: inset(100% 0 0 0 round 14px) → inset(0 0 0 0 round 14px)` 1200ms in-out-quint + внутри `scale 1.15 → 1` 1400ms out-expo.
- **Триггер:** `whileInView`, `viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}`.
- **Безопасность первого кадра:** контент, видимый при загрузке (hero), анимируется сразу по таймлайну intro, а не по observer. SSR-разметка рендерится с `opacity:1` — начальное скрытие ставится только после гидрации (класс `js-motion` на `<html>`), чтобы при сбое JS всё было видно.

### 5.10 Intro / прелоадер (≤ 1.3с, 1 раз за сессию)
Таймлайн (t=0 — гидрация):
| t | Что |
|---|---|
| 0–150ms | Чёрный экран `void`, по центру вордмарк NOIR AUTO, `opacity 0→1`, `letter-spacing 0.7em → 0.42em` (за 900ms out-expo) |
| 250–950ms | По вордмарку проходит sweep (5.1) 700ms lacquer — «вспышка софтбокса» |
| 300–1000ms | Под вордмарком hairline 120px `scaleX 0→1` (chrome-sheet) — прогресс-индикатор (декоративный, не связан с реальной загрузкой) |
| 900–1500ms | Занавес уезжает вверх: `clip-path: inset(0 0 0 0) → inset(0 0 100% 0)` 600ms in-out-quint |
| 1000ms → | Параллельно стартует хореография hero (фото: `scale 1.12→1.08`, `opacity 0→1` 1400ms out-expo; строки h1 stagger 90ms; затем лид, CTA, тикер) |

- Показ только если `sessionStorage['noir-intro'] !== '1'`; повторно — сразу hero-хореография без занавеса.
- Скролл заблокирован (`lenis.stop()`) до 1000ms. Клик/клавиша/скролл во время intro → мгновенный skip (занавес 300ms).
- Reduced motion: intro не показывается.
- Занавес — серверный HTML (чтобы не мигал контент до гидрации), скрывается через CSS, если `html:not(.js-motion)`.

### 5.11 Моушн-токены (единый справочник)
| Токен | Значение | Для чего |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | все появления, zoom фото, модалка |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | hover-состояния UI, цвета, тени |
| `ease-in-out-quint` | `cubic-bezier(0.83, 0, 0.17, 1)` | шторки, clip-path, занавес, смена табов-индикатора |
| `ease-lacquer` | `cubic-bezier(0.65, 0, 0.35, 1)` | light sweep |
| `ease-in-quart` | `cubic-bezier(0.5, 0, 0.75, 0)` | исчезновения (exit), всегда короче входа |
| `dur-micro` | 120ms | нажатие (scale .97) |
| `dur-fast` | 240ms | hover цвета/тени, иконки |
| `dur-base` | 400ms | лейблы инпутов, табы, тултипы |
| `dur-slow` | 700ms | индикаторы, линии, glow-fade |
| `dur-reveal` | 1000ms | появление блоков и строк |
| `dur-cinema` | 1200–1400ms | фото, hero, zoom |
| `stagger-lines` | 90ms | строки заголовков |
| `stagger-items` | 80ms | карточки/плитки |
| `stagger-micro` | 50ms | звёзды, чипы |
Framer-пресеты: `export const ease = { outExpo: [0.16,1,0.3,1], outQuart: [0.25,1,0.5,1], inOutQuint: [0.83,0,0.17,1], lacquer: [0.65,0,0.35,1], inQuart: [0.5,0,0.75,0] }` в `src/lib/motion.ts`.
Exit-анимации: длительность × 0.5, `ease-in-quart`.

---

## 6. Компоненты

### 6.1 Кнопки
**Primary «Pearl»** (`<PearlButton>` — заменяет `GradientButton`)
- Размер L: `h-14 (56px) px-8`, M: `h-12 (48px) px-6`, S (шапка/карточка): `h-10 (40px) px-5`. `rounded-pill`, текст Manrope 600 15px/14px, `letter-spacing: -0.005em`, цвет `ink-inverse`. Иконка-стрелка справа 16px в круге 28px `rgba(10,10,12,0.08)` (только L).
- Покой: фон G3 `pearl`, `shadow-pearl`. Внутренний блик сверху — псевдослой `::before` `inset: 1px 1px 50% 1px; border-radius: inherit; background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0)); opacity: .55` — «капля лака» на верхней половине.
- Hover: sweep (5.1, pearl-вариант), `shadow-pearl-hover` (кроссфейд 400ms out-quart), стрелка `translateX(3px)` 400ms out-expo, магнит (5.4).
- Active: `scale(0.97)` 120ms, внутренний блик `opacity .3`, внешнее свечение убрать.
- Focus-visible: `outline: 2px solid #F4F4F2; outline-offset: 4px` + `shadow-pearl-hover`.
- Disabled: фон `onyx-800`, текст `ink-muted`, без теней и эффектов.
- Loading (форма): лейбл `opacity 0`, по центру 3 точки или sweep в цикле (900ms, infinite) — блик «бежит» = идёт отправка.

**Secondary «Glass»** (`<GlassButton>` — заменяет `GhostButton`)
- Рецепт 5.6 с `border-radius: 999px`, фон `rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, текст `ink-primary` 600.
- Hover: фон `rgba(255,255,255,0.08)`, кромка → `glass-edge-active`, sweep (opacity .35). Active: `scale(.97)`.

**Text-link «Смотреть каталог»**: `ink-primary` 500, под текстом hairline 1px `rgba(255,255,255,0.3)`, на hover линия уезжает вправо (`scaleX 1→0` origin right, 300ms) и въезжает слева (`scaleX 0→1` origin left, 400ms, delay 300ms) — «перезарядка» линии; стрелка `→` `translateX(4px)`.

**Icon-circle** (стрелки, закрыть, «наверх»): 48px, glass, иконка 18px stroke 1.5. Hover — магнит + кромка active.

### 6.2 Чипы/бейджи
`h-7 px-3 rounded-pill`, glass (`rgba(10,10,12,0.45)` + blur 12px + кромка), текст `eyebrow` 10px, `ink-primary`. Для типа авто перед текстом точка 5px: Электро — `chrome-sheet` с `glow-soft`; Гибрид — половинка (белая/onyx-600); Бензин — `ink-secondary`. Цвет не используется — различие формой.

### 6.3 Заголовок секции (`SectionHeading`)
- Eyebrow: `[hairline 32px chrome-sheet] [номер раздела, ink-faint] [/] [название]`, напр. `— 02 / Каталог`. Номер = реальный порядок раздела на странице (это навигационная информация, совпадает с порядком в шапке).
- h2 `text-h2`, акцентное слово/фраза `.accent-serif` (по одному на заголовок). Предлагаемые акценты (контент не меняем, только выделение): «Подберите автомобиль под свой *тип поездок*», «Салон, которому доверяют *на годы* вперёд», «Что говорят *наши клиенты*», «Частые *вопросы*», «Рассчитайте *ежемесячный* платёж», «Оставьте заявку — *свяжемся* в ближайшее время».
- Подзаголовок `lead` `ink-secondary`, max-w 52ch. Desktop: заголовок слева (7/12 колонок), подзаголовок + action (табы/стрелки) справа, выровнены по базовой линии последней строки h2.

---

## 7. Глобальное

- `body`: фон `void`. Поверх — `div.grain` (5.5). В `layout.tsx` — `<SmoothScroll>`, `<Intro>`, `<Grain>`.
- Скроллбар: `scrollbar-color: #34363C transparent; scrollbar-width: thin`.
- Фокус: `:focus-visible { outline: 2px solid #F4F4F2; outline-offset: 3px; border-radius: inherit; }` (вместо фиолетового `#9b8cff`).
- Межсекционные переходы: каждая секция начинается с G8 `light-strip` (кроме hero) и имеет свой набор G7-пятен в `::before` (`position:absolute; inset:0; pointer-events:none; z-index:-1`). Фон секций не чередуется резко: `void` ↔ `onyx-950`, а граница маскируется 160px-градиентом `linear-gradient(180deg, #050506, #0A0A0C)` вместо жёсткой линии.

---

## 8. Секции

### 8.1 Header
- **Форма:** плавающая glass-пилюля, `position: fixed; top: 16px; left/right: 16px`, внутри контейнер `max-w-container`, `h-16 (64px)`, `rounded-pill`, `px-3 pl-6`.
- **Состояния:**
  - Над hero (scrollY < 24): фон `rgba(5,5,6,0)`, без кромки, без blur — шапка «растворена» в кадре.
  - После 24px: фон `rgba(12,12,14,0.55)`, `backdrop-filter: blur(18px) saturate(160%)`, кромка G5, `shadow-float`. Переход 500ms out-quart.
  - Скролл вниз > 600px со скоростью > 0 → шапка уезжает `y: -120%` 500ms out-expo; любой скролл вверх → возвращается. В зоне hero и у футера — всегда видна.
- **Лого:** вордмарк `NOIR AUTO` (`wordmark`), «NOIR» — `ink-primary`, «AUTO» — `ink-muted`. Hover: sweep по вордмарку (text-clip хрома + анимированный `background-position`) 900ms.
- **Навигация:** ссылки `small-lg` 500 `ink-muted`, `px-4 h-10 rounded-pill`. Hover: `ink-primary` 240ms.
- **Индикатор активного раздела:** скользящая glass-капсула под активной ссылкой (`motion.span layoutId="nav-pill"`, фон `rgba(255,255,255,0.08)`, inset `0 1px 0 rgba(255,255,255,0.12)`, переход пружиной `{stiffness: 380, damping: 32}`), плюс точка 4px `#F4F4F2` с `glow-soft` под капсулой по центру. Активный текст `ink-primary`. Активный раздел — IntersectionObserver `rootMargin: "-45% 0px -50% 0px"` по `section[id]`. В hero индикатор скрыт.
- **Прогресс:** hairline 1px вдоль нижней кромки пилюли, `scaleX = scrollProgress`, `chrome-sheet`, opacity .5. (Тонко; если покажется лишним — убрать, не критично.)
- **CTA справа:** Pearl S «Оставить заявку» + магнит.
- **Mobile (<1024):** пилюля `top:12px left/right:12px h-14`, справа glass icon-circle 44px «бургер» (две линии 16px). Меню — fullscreen glass-overlay (`rgba(5,5,6,0.86)` + blur 24px), пункты `h2`-кеглем (36px Manrope 300) по левому краю, каждый появляется `y 40→0` stagger 60ms, номер раздела `eyebrow` над пунктом; внизу Pearl L full-width и телефон. Закрытие — крестик (морфинг линий 400ms in-out-quint).

### 8.2 Hero — кинематографичный full-bleed
- **Высота:** `min-height: 100svh` desktop (max 1000px), mobile `min-height: 88svh`. (Здесь 100vh оправдан: это обложка, а следующий раздел намечается спек-тикером и scroll-cue.)
- **Слои (снизу вверх):**
  1. Фото — «окно» без рамки, растворённое в фоне: desktop `position:absolute; top:15%; right:-5%; width:min(76%,1320px); aspect-ratio` исходника, `mask-image: linear-gradient(90deg, transparent 0%, #000 30%, #000 92%, transparent 100%)` (левый край тает под текстом, машина целиком в кадре, а не обрезана cover-ом на весь экран); mobile `top:96px; left:-10%; width:132%` + нижняя маска `linear-gradient(180deg, #000 75%, transparent)`, текст начинается с `padding-top: 380px`. Грейдинг 9.2, параллакс 5.8. Обёртка `inset: -8% 0` для запаса под параллакс. Работает только с фото на чёрном/тёмном фоне (см. 9.1).
  2. Оверлеи: `linear-gradient(90deg, rgba(5,5,6,0.88) 0%, rgba(5,5,6,0.55) 38%, rgba(5,5,6,0) 65%)` (текстовая зона слева) + `linear-gradient(180deg, rgba(5,5,6,0.55) 0%, rgba(5,5,6,0) 22%, rgba(5,5,6,0) 60%, #050506 100%)` (растворение в страницу) + радиальная виньетка `radial-gradient(120% 90% at 65% 55%, transparent 50%, rgba(5,5,6,0.6) 100%)`.
  3. G7-пятно за машиной: `radial-gradient(40% 35% at 66% 58%, rgba(255,255,255,0.10), transparent 70%)` — «софтбокс».
  4. Cursor torch + reflect (5.2).
  5. Горизонт: hairline на уровне колёс (≈ 74% высоты) `light-strip`, opacity .35, ширина 60%, справа — «пол шоурума».
  6. Контент.
- **Контент (desktop):** сетка 12 колонок, текст в колонках 1–8, прижат к нижней трети (`padding-bottom: max(11vh, 88px)`), тикер — колонки 9–12.
  - Eyebrow: `Электро · Гибрид · Бензин` (5.9 eyebrow-анимация).
  - H1 `display`: «Автомобиль, который *соответствует* вашему образу жизни» — акцент «соответствует» Cormorant italic + хром. 3–4 строки на 1440.
  - Лид `lead-lg` `ink-secondary` max 44ch.
  - CTA-ряд: Pearl L «Оставить заявку» (магнит, ambient-sweep) + text-link «Смотреть каталог →». Gap 28px.
- **Спек-тикер** (правый нижний угол, колонки 9–12, desktop): 3 glass-ячейки в ряд без промежутков (одна стеклянная полоса с hairline-разделителями `onyx-700`), в каждой `eyebrow` лейбл и значение `price`-кеглем: «Гарантия / до 5 лет», «Кредит / от 3.9%», «Trade-in / за 1 день» (факты из существующего контента). Появляется последним (delay 1.6с от старта hero), `y 20→0` stagger 80ms.
- **Scroll-cue:** по центру внизу (между CTA и тикером), вертикальная линия 1px × 56px с анимацией `scroll-cue` + `eyebrow` «Листайте» повернутый на -90°. Скрыт на mobile.
- **Mobile:** фото занимает верхние 58% (машина справа обрезана мягко), текст поверх нижней части на градиенте; H1 42px, CTA full-width Pearl L, text-link под ним по центру; тикер — горизонтальный scroll-snap ряд из 3 glass-чипов под CTA.

### 8.3 Каталог
- Фон: `void` + G7 (пятна в 15%/0% и 85%/40%).
- Заголовок по 6.3. Фильтр-табы справа: **сегментный glass-контрол** `h-12 p-1 rounded-pill`, внутри 4 кнопки `px-5 h-10 small-lg 600`. Активный — скользящая **pearl-капсула** (`layoutId="catalog-tab"`, пружина `{stiffness: 400, damping: 34}`) с `shadow-pearl`, текст `ink-inverse`; при переезде капсулы по ней проходит sweep 700ms. Неактивные `ink-muted`, hover `ink-primary`. Счётчик моделей справа от названия таба — `ink-faint` надстрочно (`Электро ⁴`) — реальное число из данных.
- Смена фильтра: `AnimatePresence mode="popLayout"` + `layout`; уходящие карточки `opacity 0, scale .96, filter blur(6px)` 300ms in-quart; приходящие — каскад 5.9 (stagger 60ms); сетка перестраивается `layout` переходом 700ms out-expo.
- Сетка: 3 колонки ≥1024 (gap 24px), 2 колонки ≥640, 1 колонка ниже; на 1 колонке gap 16px.

**Карточка авто (`CarCard`)**
- Корпус: glass (5.6), `rounded-lg (20px)`, `p-1.5 (6px)` вокруг фото-окна, `shadow-card`. Tilt 5.3, spotlight 5.2, sweep 5.1 (карточный вариант).
- **Фото-окно:** `rounded-md (14px)`, `aspect-[3/2]`, фон `onyx-900`, оверлей `photo-fade` снизу + верхний софтбокс `radial-gradient(70% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 70%)` с `mix-blend-mode: soft-light`. Внутри:
  - слева сверху (12px) — чип типа (6.2), `translateZ(40px)`;
  - справа сверху — индекс модели в каталоге `ink-faint` `eyebrow` (`01 / 12`) — порядковый номер в выдаче (реальная позиция);
  - снизу слева, поверх фото-фейда — название модели `title-lg` `ink-primary` и сегмент `small` `ink-secondary` (название переезжает на фото — экономит высоту и делает карточку «обложкой»).
- **Тело** `px-4 pt-4 pb-4`:
  - Спек-строка: 3 равные колонки, разделённые вертикальными hairline `onyx-700`; в каждой лейбл `eyebrow` 10px `ink-muted` и значение `small-lg` 500 `ink-primary` tabular-nums.
  - Hairline `onyx-700` на всю ширину (margin 16px 0).
  - Нижний ряд: слева цена (`eyebrow` «Цена от» над `price` `ink-primary`, ₽ — `ink-muted` 0.6em); справа — Glass M «Подробнее» и Pearl icon-circle 48px со стрелкой ↗ (`aria-label="Оставить заявку на {модель}"`).
- **Hover:** tilt; фото scale 1.06 + «свет включили»; spotlight; кромка → яркая около курсора; цена: `ink-primary` → `chrome-text` кроссфейдом 400ms (текстовый градиент поверх — второй слой opacity); sweep 1200ms; `shadow-float`.
- **Focus-within (клавиатура):** без tilt, кромка `glass-edge-active`, фото «свет включили», outline на сфокусированной кнопке.
- **Active (нажатие на карточку/кнопку):** `scale(.985)` 120ms.
- Вся карточка кликабельна на «Подробнее» (через `::after` у кнопки-ссылки, растянутый на карточку, кроме зоны кнопки-заявки).

**Модалка (`CarDetailsModal`)**
- Backdrop: `rgba(5,5,6,0.72)` + `backdrop-filter: blur(14px)`, fade 500ms out-quart.
- Панель: glass `rounded-xl (28px)`, `max-w-[960px]`, `shadow-float`; desktop — **двухколоночная**: слева фото (5:4, на всю высоту, `rounded-[22px]` внутри `p-1.5`), справа контент. Mobile — bottom-sheet: выезжает снизу `y: 100% → 0` 700ms out-expo, `rounded-t-xl`, ручка-граббер 36×4px, drag-to-close (framer `drag="y"`, порог 120px).
- Вход desktop: `opacity 0→1, y 32→0, scale .97→1` 700ms out-expo; фото — шторка clip-path 1000ms in-out-quint + `scale 1.12→1` 1400ms out-expo. Рекомендуется shared-element: `layoutId={`car-photo-${id}`}` у фото в карточке и модалке (фото «перелетает» из карточки) — если даёт артефакты с tilt, fallback на шторку.
- Контент: чип типа, имя `h3`, сегмент, описание `body` `ink-secondary`, спеки — 3 glass-ячейки (лейбл `eyebrow` / значение `title`), цена `price-lg` хромом, Pearl L full-width «Оставить заявку», рядом icon-circle «закрыть» в правом верхнем углу панели (магнит).
- Стаггер контента: 80ms, начинается через 200ms после старта панели.
- Exit: 350ms in-quart (`opacity 0, y 16, scale .98`).
- Lenis stop, фокус-ловушка, Esc, возврат фокуса на кнопку-источник.

### 8.4 Преимущества
- Фон: `onyx-950` + **текстура**: точечная сетка `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0) 0 0 / 28px 28px`, замаскированная `mask-image: radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 75%)` — сетка «проявляется» в центре и тает к краям (как разметка пола в студии). Плюс G7: одно крупное пятно `radial-gradient(50% 45% at 50% 55%, rgba(154,163,178,0.09), transparent 70%)` за плитками.
- Layout: 4 glass-плитки в ряд ≥1024 (gap 16px), 2×2 ≥640, стопкой ниже. Плитка: `p-8`, `min-h-[300px]`, flex-col, контент прижат вниз, медальон сверху.
- **Медальон иконки:** 64px круг; фон `radial-gradient(circle at 30% 25%, #3A3C42 0%, #17181B 60%, #0C0C0E 100%)`; кромка 1px — conic-хром `conic-gradient(from 210deg, #FFFFFF, #6E727A 25%, #D9DBDF 50%, #5B5F66 75%, #FFFFFF)` через mask (5.6); `box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 30px -10px rgba(0,0,0,0.8)`. Иконка 26px stroke 1.5 `#F4F4F2`, `filter: drop-shadow(0 0 8px rgba(255,255,255,0.45))`. За медальоном — ореол `radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)` 160px, `opacity .6`.
- Текст: заголовок `title-lg`, описание `body` `ink-secondary`. Никаких декоративных стрелок: плитки не кликабельны и не должны выглядеть ссылками.
- **Hover (desktop):** spotlight 5.2, ореол `opacity .6→1` + `scale 1→1.15` 700ms out-expo, conic-кромка медальона вращается `rotate 0→120deg` 1200ms out-expo (блик «обегает» металл), иконка — glow усиливается до `drop-shadow(0 0 14px rgba(255,255,255,0.7))`. Без tilt (плитки не товар).
- Появление: плитки каскадом 80ms; медальон — `scale .6→1, opacity 0→1` 900ms out-expo, затем иконка «рисуется» — `stroke-dasharray/dashoffset` 100%→0 за 1000ms in-out-quint (delay 200ms).

### 8.5 Отзывы
- Фон: `void`, G7 смещены вправо.
- **Аватары → гравированная монограмма.** Круг 52px, фон `#0C0C0E`, кромка 1px conic-хром (как медальон), инициалы — Cormorant Garamond Italic 500 22px `chrome-text`, `letter-spacing: 0.02em`. Выглядит как гравировка на брелоке ключа. Никаких цветных кружков.
- **Карточка отзыва:** glass, `p-8`, `rounded-lg`, ширина: 86% mobile, 48% md, `calc((100%-48px)/3)` lg. Сверху — большая кавычка «“» Cormorant 120px `chrome-text` `opacity .14`, абсолютно в правом верхнем углу (декор, `aria-hidden`).
  - Звёзды: **20px**, gap 4px, заполненные — SVG с `linearGradient` вертикальным хромом (`#FFFFFF → #C9CCD2 → #8A8E96`), `filter: drop-shadow(0 0 6px rgba(255,255,255,0.35))`; пустые — stroke 1.2 `#34363C`. Рядом рейтинг «4.0» `small` `ink-muted`? — только если рейтинг < 5 (честность: показывать число, когда звёзды неполные).
  - Текст: `lead` (17px) `ink-primary` с `opacity .88`, Manrope 400 — отзыв читается как цитата, крупнее v1.
  - Футер карточки: hairline, монограмма + имя `title` + «модель: …» `small` `ink-muted`.
- **Анимация звёзд:** при появлении карточки звёзды по очереди `scale 0.4→1, rotate -40deg→0, opacity 0→1`, пружина `{stiffness: 500, damping: 18}`, stagger 70ms; после последней — по ряду звёзд пробегает sweep 700ms (маска по форме звёзд: sweep-слой с `mask-image` = тот же SVG-спрайт, либо просто анимированный `background-position` хром-градиента внутри `linearGradient` через `<animate>` — проще: CSS-переменная `--shine` двигает stop-offset; допустим упрощённый вариант — проход яркости `filter: brightness(1)→1.6→1` 600ms со stagger 50ms).
- **Карусель:** scroll-snap остаётся (`data-lenis-prevent`), + drag мышью на desktop (pointer events → `scrollLeft`, курсор `grab/grabbing`). Карточки вне центра: `opacity .5`, `scale .97` (вычисляется по позиции в контейнере, 400ms out-quart) — фокус на текущей.
- **Управление:** icon-circle стрелки (магнит). Индикатор вместо точек — трек 1px `onyx-700` шириной 160px с chrome-sheet ползунком (ширина = видимая доля), позиция = scrollProgress, плюс счётчик `01 / 06` `small` tabular (реальный индекс/всего).

### 8.6 FAQ
- Фон `onyx-950` + одно G7-пятно сверху по центру. Колонка `max-w-[860px]`.
- Список — единая glass-панель `rounded-xl` с hairline-разделителями `onyx-700` между вопросами (не отдельные карточки — тише).
- Строка вопроса: `py-7 px-8`, слева номер `eyebrow` `ink-faint` («01»… — порядок вопросов, помогает ссылаться при звонке), вопрос `title-lg` 500, справа icon-circle 40px (glass) с «+».
- Hover строки: фон `rgba(255,255,255,0.025)` 240ms, `+` — магнит не нужен, лишь кромка кружка active.
- **Открыто:** фон строки `rgba(255,255,255,0.035)`; слева — вертикальная хром-полоска 1px (`chrome-sheet`, `scaleY 0→1` 700ms out-expo, origin top) с `glow-soft`; иконка `rotate(45deg)` 500ms out-expo, кружок становится pearl (фон `pearl`, иконка `ink-inverse`) кроссфейдом 300ms.
- Ответ: `grid-template-rows: 0fr → 1fr` **500ms out-expo**; текст `body-lg` `ink-secondary` max 64ch, `opacity 0→1, y 8→0, blur(4px)→0` 500ms delay 120ms. Закрытие: 350ms in-out-quint, текст сначала гаснет (200ms).
- Один открытый одновременно (как сейчас).

### 8.7 Калькулятор
- Фон `void`, G7 крупное пятно за карточкой результата (`rgba(255,255,255,0.08)` at 75% 50%).
- Layout desktop: 7/5 колонок; слева — glass-панель параметров `p-10 rounded-xl`, справа — **панель результата**, `position: sticky; top: 112px`.
- **Кастомный слайдер** (`<RangeField>`; нативный `<input type=range>` остаётся сверху прозрачным, `opacity:0; height: 44px` — ради клавиатуры, скринридеров и тача; визуальные слои под ним, `pointer-events:none`):
  - Шапка поля: лейбл `eyebrow` `ink-muted` слева; справа текущее значение `title-lg` tabular-nums `ink-primary` (+ «₽»). Значение меняется с лёгким rolling-эффектом: каждая изменившаяся цифра `y 40%→0, opacity 0→1` 240ms out-expo (только при отпускании; во время drag — мгновенно).
  - **Трек:** высота **8px**, `rounded-pill`, фон `#1B1C20`, `box-shadow: inset 0 1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)` — «паз в металле».
  - **Заливка:** ширина `var(--p)` (0–100%), фон `linear-gradient(90deg, #5B5F66 0%, #B9BCC2 60%, #FFFFFF 100%)`, `box-shadow: 0 0 16px rgba(255,255,255,0.22)`; на конце заливки — «раскалённая точка» `radial-gradient(circle at right, rgba(255,255,255,0.9), transparent 70%)` 24px. Обновление через CSS-переменную `--p` (transform `scaleX` у заливки, `transform-origin: left` — дешевле, чем width).
  - **Thumb:** **28px** круг, фон `radial-gradient(circle at 35% 30%, #FFFFFF 0%, #ECEDEF 35%, #9A9EA6 100%)` (жемчужный шар), `border: 1px solid rgba(0,0,0,0.35)`, `shadow-glow-thumb`. Внутри — точка 6px `#0A0A0C` `opacity .6` (захват).
    - Hover: `scale 1.08`, glow `0 0 32px rgba(255,255,255,0.45)` 240ms.
    - Active/drag: `scale 1.18`, ring `0 0 0 10px rgba(255,255,255,0.08)`.
    - Focus-visible: ring `0 0 0 4px #050506, 0 0 0 6px #F4F4F2`.
  - **Тултип-значение:** glass-пузырь над thumb (`bottom: calc(100% + 14px)`), `px-3 h-8 rounded-pill`, `small-lg` 600 tabular, хвостик 8px (rotate 45° квадрат с той же стеклянной заливкой). Появляется на hover/drag/focus: `opacity 0→1, y 6→0, scale .9→1` 240ms out-expo; исчезает через 600ms после отпускания. Позиция `left: var(--p)` с коррекцией у краёв (clamp, чтобы не вылезал за трек).
  - Под треком — шкала: min / max значения `small` `ink-faint` + 5 тиков 1×6px `onyx-600` (визуальные ориентиры, не шаги).
  - Первый взнос: дополнительно чип `%` справа от значения (glass, `small`).
- **Срок:** сегментный glass-контрол (как табы каталога) с pearl-капсулой `layoutId="term"`.
- **Панель результата:** glass `rounded-xl p-10`, кромка `glass-edge-active`; сверху `eyebrow` «Ежемесячный платёж»; число `figure` (72px Manrope 200) `chrome-text`, анимированный счётчик (framer `animate(from, to, {duration: .6, ease: outExpo})`, tabular-nums, `aria-live="polite"` на финальном значении с debounce 400ms). Под числом — мини-визуализация: горизонтальная полоса 6px, разделённая на «Тело кредита» (`chrome-sheet`) и «Переплата» (`onyx-600` с диагональной штриховкой `repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)`), пропорции — реальные; легенда под ней. Затем разбивка строками (`small-lg`, лейбл `ink-muted` / значение `ink-primary` tabular), hairline-разделители. Внизу Pearl M «Оформить заявку» full-width (ведёт к форме).
- Mobile: панель результата после параметров; дополнительно sticky-бар снизу экрана (glass, `h-16`, safe-area) с текущим платежом и стрелкой «к форме», появляется пока секция калькулятора в зоне видимости и панель результата вне экрана.

### 8.8 Контакты и форма
- Фон `void` → снизу переход в `onyx-950` к футеру. G7: пятно за формой слева.
- Layout: 7/5, слева форма в glass-панели `p-10 rounded-xl`, справа — контактная колонка (без отдельной панели — меньше коробок): телефон `h3` tabular-nums с хромом на hover, адрес/режим/email в двух колонках (`eyebrow` лейбл + `body-lg` значение), соцсети — icon-circle 48px с магнитом; ниже — «карта»-плейсхолдер как glass-панель 16:10 с монохромной стилизованной схемой (тонкие линии улиц SVG `onyx-700`, точка салона — пульсирующий белый маркер: кольцо `scale 1→2.4, opacity .5→0` 2.4s infinite out-quart; reduced — статичное кольцо).
- **Поле с floating label (`<Field>`):**
  - Контейнер: `h-16 (64px)`, `rounded-md (14px)`, фон `rgba(255,255,255,0.03)`, кромка через mask (5.6) с `--edge: rgba(255,255,255,0.10)` равномерной.
  - Инпут: `pt-6 pb-2 px-5`, `body-lg` `ink-primary`, `caret-color: #F4F4F2`, placeholder пустой (`placeholder=" "` — для `:placeholder-shown`).
  - **Лейбл:** абсолютный, `left: 20px; top: 0; transform-origin: left top`, `body-lg` (16px) 400 `ink-muted`.
    - Покой: `transform: translateY(21px) scale(1)`.
    - Поднятый (`:focus` или `:not(:placeholder-shown)`): `transform: translateY(11px) scale(0.75)` (= 12px), `font-weight` не меняется, цвет `ink-secondary`; `letter-spacing` 0.02em (не uppercase — регистр не анимируется и прыгает).
    - Анимируется **только transform и color**, 400ms out-expo. Никаких `top`/`font-size` в transition.
  - Пример-подсказка («+7 900 123-45-67») появляется как placeholder только в фокусе, `ink-faint` → `opacity 0→1` 240ms delay 150ms.
  - **Focus:** кромка → **градиент-хром** `--edge: linear-gradient(115deg, rgba(255,255,255,0.65), rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0.2))` (кроссфейд второго слоя 400ms); фон `rgba(255,255,255,0.05)`; `shadow-focus-field` (мягкое свечение); снизу внутри — «световая линия» 1px `light-strip`, `scaleX 0→1` от центра 600ms out-expo.
  - **Заполнено, не в фокусе:** кромка `rgba(255,255,255,0.16)`, справа иконка ✓ 14px `ink-secondary` (только после валидного blur), `scale .6→1` 300ms.
  - **Ошибка:** кромка `rgba(229,72,77,0.6)`, фон `rgba(229,72,77,0.05)`, сообщение `small` `error-text` под полем, появляется `height` grid-трюком + `y -4→0` 300ms; поле один раз «вздрагивает» `x: 0,-6,5,-3,0` 400ms (reduced — без).
  - **Select «Тип авто»:** не нативный выпадающий список, а **сегментный выбор** из 4 glass-чипов (Гибрид / Бензин / Электро / Не определился(ась)) — `role="radiogroup"`, выбранный — pearl-капсула. Меньше ввода, премиальнее, чем нативный select. Лейбл над группой `eyebrow`.
  - Поля Имя + Телефон в 2 колонки ≥768, ниже группа типа авто, затем Pearl L full-width «Отправить заявку» (sweep, магнит выключен для full-width кнопок — слишком крупный объект). Под кнопкой — `small` `ink-muted` «Перезвоним в течение 30 минут в рабочее время».
  - **Успех:** форма схлопывается (`height` 600ms out-expo, поля `opacity 0` stagger 40ms), на её месте: хромовое кольцо 64px с ✓, которое «рисуется» (`stroke-dashoffset` 800ms in-out-quint), по кольцу проходит sweep, заголовок `h3` «Заявка принята, мы свяжемся с вами» + текст + text-link «Отправить ещё одну заявку».

### 8.9 Футер
- Фон `onyx-950`, сверху `light-strip` + G7-пятно снизу по центру (`rgba(255,255,255,0.06)` at 50% 120%).
- Верх: 4 колонки ≥1024 — (1) вордмарк + одна строка позиционирования (`BRAND_TAGLINE`) + Pearl S «Оставить заявку»; (2) «Разделы» — ссылки навигации; (3) «Контакты» — телефон tabular, email, адрес; (4) «Режим работы» + соцсети icon-circle 40px. Заголовки колонок `eyebrow` `ink-faint`, ссылки `small-lg` `ink-secondary` → hover `ink-primary` + hairline-подчёркивание `scaleX 0→1` 400ms out-expo.
- **Гигантский вордмарк:** `NOIR AUTO` на всю ширину контейнера (`font-size: clamp(3.5rem, 16vw, 15rem)`, Manrope 200, `letter-spacing: -0.05em`, `line-height: .8`), `chrome-text`, `opacity .9`, нижние ~30% букв обрезаны краем страницы, `mask-image: linear-gradient(180deg, #000 40%, transparent 100%)` — уходит «в пол». На desktop по вордмарку медленно ходит отражение: курсор-glow по X (lerp 0.06), а в покое — ambient sweep раз в 9с (2400ms lacquer, opacity .4). Вордмарк `aria-hidden` (бренд уже назван выше).
- Низ: hairline, `small` `ink-muted` — «© {год} {brandName}. Все права защищены.» слева, «Название и автомобили в каталоге — демонстрационные.» по центру, справа icon-circle «Наверх ↑» с магнитом (Lenis `scrollTo(0, {duration: 1.8})`).
- Mobile: колонки стопкой с gap 40px, вордмарк `16vw`, кнопка «наверх» над копирайтом.

---

## 9. Правила подачи фотографий

### 9.1 Отбор (для агента по фото и контент-менеджера)
- Только **реальные автомобили** (никаких абстракций — текущие «диски крупным планом», «паркинг», «световые блики» вместо машины недопустимы для карточки модели).
- Тёмный, студийный или ночной фон; машина освещена контурным/верхним светом (софтбокс), видны блики на кузове.
- Ракурс: **3/4 спереди** (приоритет) или профиль; единое направление в выдаче — **капот вправо**, как у текущего hero-фото (движение «вперёд» по ходу чтения). Зеркалить нельзя, если в кадре номера/надписи.
- Машина занимает **65–80% ширины кадра**, по вертикали — нижняя треть/центр: колёса на линии ≈ 70–75% высоты кадра. Свободное пространство над машиной ≥ 20% (там живут бейдж и софтбокс-оверлей).
- Без людей, логотипов дилеров, водяных знаков, текста; номера — размытые/отсутствуют. Источник ≥ 2000px по длинной стороне (hero ≥ 2800px).

### 9.2 Грейдинг (CSS, единый для всех, чтобы разнородные фото стали серией)
```css
.photo-grade        { filter: grayscale(1) contrast(1.14) brightness(0.84); transition: filter 700ms cubic-bezier(0.25,1,0.5,1), transform 1200ms cubic-bezier(0.16,1,0.3,1); }
.group:hover .photo-grade,
.group:focus-within .photo-grade { filter: grayscale(1) contrast(1.2) brightness(1.0); }   /* «в шоуруме включили свет» */
.photo-grade--hero  { filter: grayscale(1) contrast(1.18) brightness(0.78); }
```
Сайт полностью монохромный, поэтому цвет на фото не возвращается даже на hover (частичная десатурация выглядит грязно). Вместо цвета — свет. Если конкретное фото после грейдинга слишком светлое (средняя яркость > 35%), в `cars.ts` задаётся `imageBrightness` (0.7–0.9) — переопределение через CSS-переменную `--photo-b`.

### 9.3 Оверлеи (всегда в этом порядке, снизу вверх)
1. Фото (грейдинг).
2. `photo-fade` снизу (`rgba(5,5,6,0)` 40% → `.55` 75% → `.92` 100%) — под название модели.
3. Софтбокс сверху: `radial-gradient(70% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 70%)`, `mix-blend-mode: soft-light`.
4. Виньетка: `radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(5,5,6,0.5) 100%)`.
5. Внутренняя кромка фото-окна: `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06)` — фото «вставлено в раму», а не наклеено.
6. Spotlight/sweep карточки (над всем).

### 9.4 Соотношения сторон и кадрирование
| Место | Ratio | `object-position` по умолчанию |
|---|---|---|
| Hero desktop | full-bleed (≈16:9 и шире) | `62% 60%` |
| Hero mobile | верх 58% экрана (≈ 3:4 зона) | `70% 55%` |
| Карточка каталога | **3:2** | `50% 62%` |
| Модалка desktop | 5:4 | `50% 58%` |
| Модалка mobile | 16:10 | `50% 60%` |
Поле `imagePosition` в `cars.ts` (опционально) переопределяет `object-position` для конкретного фото. `next/image` с `sizes` по сетке; `placeholder="blur"` с тёмным `blurDataURL` (однотонный `#0F1012` 8×8 base64), чтобы не было белых вспышек.

### 9.5 Поведение фото внутри карточки
- Покой: `scale(1)`, грейдинг «тёмный».
- Hover: `scale(1.06)` 1200ms out-expo + «свет включили» 700ms; лёгкий параллакс от tilt (translateZ 24px).
- Появление: шторка clip-path снизу вверх (5.9) + `scale 1.15→1`.
- Загрузка: skeleton = `onyx-900` + медленный sweep 1600ms infinite opacity .06 (пока `onLoad` не сработал), затем фото `opacity 0→1` 600ms.

---

## 10. Мобильные и touch

- Гейт `fx` (5.0) = false → **нет**: tilt, cursor glow/spotlight, магнитов, Lenis, параллакса hero (заменяется статичным кадром со `scale 1.04`), анимированного grain.
- **Остаётся:** split-text появления (но stagger 60ms, длительность ×0.8), шторки фото, sweep на `pointerdown` (5.1), счётчики, floating labels, все состояния.
- Hover-состояния карточек на touch не «залипают»: стили hover только внутри `@media (hover: hover)`. «Свет включили» на карточках для touch — когда карточка в центре экрана (IntersectionObserver `rootMargin: "-40% 0px -40% 0px"`), 700ms — живой каталог при скролле.
- Тап-зоны ≥ 44px. Ряд кнопок карточки на <380px: Glass «Подробнее» flex-1 + pearl icon-circle 48px.
- `backdrop-filter` на Android low-end: если `navigator.hardwareConcurrency <= 4` — blur снижается до 10px.
- Типографика — fluid-шкала из 2.2 (никаких отдельных `-mobile` токенов).

## 11. Reduced motion (`prefers-reduced-motion: reduce`)
- Отключить: Lenis, intro, параллакс, tilt, магниты, cursor-glow, sweep (заменить на смену тени), grain-анимацию, rolling-цифры (сразу финальное значение), drag-sheet жест модалки остаётся, но без инерции.
- Появления: только `opacity 0→1` 300ms без смещений и blur; шторки → fade.
- Аккордеон/лейблы/табы: переходы ≤ 150ms (не 0 — состояние должно считываться).
- Глобальное правило из v1 (`transition-duration: 0.001ms !important`) **заменить** точечным: компоненты сами читают `useReducedMotion()` (framer) — глобальный kill ломает floating labels и делает интерфейс «рваным».

## 12. Зависимости и структура для разработчика

**npm:**
- `lenis` (^1.1) — плавный скролл. Единственная новая обязательная зависимость.
- `framer-motion` — уже есть (springs, layoutId, useScroll, AnimatePresence).
- Split-text — **без зависимостей** (своя утилита по словам/строкам); GSAP/SplitText не нужны.
- Шрифты — `next/font/google` (Manrope, Cormorant Garamond), без пакетов.

**Новые файлы (предложение):**
```
src/lib/motion.ts            — ease/duration константы, варианты reveal
src/lib/fx.ts                — useFx() (hover+fine pointer+!reduced), useLerpPointer()
src/components/motion/SmoothScroll.tsx  — Lenis provider + anchor interception
src/components/motion/Intro.tsx         — прелоадер (5.10)
src/components/motion/Grain.tsx         — 5.5
src/components/motion/SplitHeading.tsx  — 5.9
src/components/motion/Magnetic.tsx      — 5.4
src/components/motion/Sweep.tsx         — 5.1 (обёртка/хук useSweep)
src/components/motion/TiltCard.tsx      — 5.3 + spotlight
src/components/ui/PearlButton.tsx, GlassButton.tsx, IconCircle.tsx, Chip.tsx, Segmented.tsx, Field.tsx, RangeField.tsx
```
`GradientButton`/`GhostButton` — заменить, `Reveal` — переписать под 5.9 (маски/blur вместо простого fade).

**Бюджет производительности:** одновременно анимируемых `backdrop-filter`-слоёв в вьюпорте ≤ 6; rAF-циклы (torch, lerp) останавливаются, когда эффект неактивен; `will-change` только на время hover/анимации; LCP — hero-фото с `priority` + `fetchPriority="high"`; intro не блокирует LCP (фото грузится под занавесом).

## 13. Чек-лист приёмки (дизайн-ревью)
1. На всём сайте нет ни одного фиолетового/бирюзового пикселя (поиск по `#6C5CE7`, `#0E7C73`, `#9B8CFF`, `#2FD8C4` = 0 результатов).
2. Каждый h2 имеет ровно один акцентный фрагмент в Cormorant italic хроме; кириллица везде рендерится нужным шрифтом (не fallback).
3. Sweep на pearl-кнопке виден и не обрывается при быстром уходе курсора.
4. Tilt ≤ 6°, возвращается пружиной без рывка; на touch tilt отсутствует.
5. Lenis: якорные ссылки шапки ведут с отступом под плавающую шапку; модалка не скроллит страницу.
6. Reduced motion: нет движения, кроме opacity; floating labels работают.
7. Контраст: весь читаемый текст ≥ 4.5:1 (кроме `display/h2/figure` с хромом — ≥ 3:1 как large text).
8. Lighthouse Performance mobile ≥ 85, CLS < 0.05 (intro и split-text не сдвигают layout).
