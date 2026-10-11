import type { Car, CarPhoto } from "@/types/car";

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/**
 * Catalog photos — low-key studio series (design/images.md).
 * One line per model: to swap a photo, edit only that model's line here
 * (`src` may be a full URL; keep `alt` describing what is in the frame).
 * mirror → scaleX(-1) so every car faces right; position/brightness/
 * contrast/shadeBottom are per-shot corrections from images.md.
 */
const PHOTOS: Record<string, CarPhoto> = {
  "solace-hx": { src: unsplash("photo-1563191848-b01d0258f1f9"), alt: "Седан Solace HX в профиль на чёрном фоне, блик по линии крыши", mirror: true },
  "meridian-gt": { src: unsplash("photo-1712517272422-9c5d78e0a954"), alt: "Передняя фара кроссовера Meridian GT в темноте" },
  "lumen-cross": { src: unsplash("photo-1677522375397-b7a40324dfb3"), alt: "Лифтбек Lumen Cross в профиль, контурный свет по крыше и борту", mirror: true },
  "horizon-wagon": { src: unsplash("photo-1627280052756-cc5e080c8458"), alt: "Horizon Wagon, вид три четверти сзади, свет скользит по задней двери" },
  "vantis-sport": { src: unsplash("photo-1643220387714-7fb97854425e"), alt: "Спорт-купе Vantis Sport, вид три четверти спереди в тёмной студии, свет по капоту и боковине", mirror: true, position: "50% 40%" },
  "orion-turbo": { src: unsplash("photo-1771261799195-466eb30d9669"), alt: "Внедорожник Orion Turbo анфас, горят только фары", position: "50% 55%" },
  "centurion-sedan": { src: "https://images.unsplash.com/photo-1711523164285-71e1dbb948ca?auto=format&fit=crop&rect=300,700,2360,1573&w=1200&q=80", alt: "Седан Centurion в профиль в тёмной студии, контурный свет по линии плеча" },
  "stratus-coupe": { src: unsplash("photo-1722011865035-c32d53dfc543"), alt: "Низкая стойка и линия окна купе Stratus, чёрно-белый кадр", mirror: true, brightness: 0.72, contrast: 1.05 },
  "onyx-one": { src: unsplash("photo-1565211604225-09a53ff9cc4e"), alt: "Линия крыши и лобового стекла кроссовера Onyx One в контровом свете", mirror: true },
  "velloc-gt": { src: unsplash("photo-1685594496584-23198309c37a"), alt: "Электроседан Velloc GT, вид три четверти в чёрной студии", mirror: true },
  "drev-urban": { src: unsplash("photo-1620930469263-23663c1d517a"), alt: "Хэтчбек Drev Urban сзади сверху: крыша и задний фонарь в тёмном паркинге", position: "50% 35%" },
  "aerin-gt": { src: unsplash("photo-1744968845367-a8c11c74eb7c"), alt: "Электрофастбек Aerin GT в профиль, чёрный силуэт на фоне облачного неба", mirror: true, brightness: 0.6 },
};

/**
 * Mock catalog data. Model names are intentionally invented (no references
 * to real manufacturers) — see design/spec.md and the task brief.
 */
export const CARS: Car[] = [
  // ─── Гибрид ────────────────────────────────────────────────────────────
  {
    id: "solace-hx",
    name: "Solace HX Hybrid",
    type: "hybrid",
    segment: "Седан",
    price: 3_120_000,
    photo: PHOTOS["solace-hx"],
    specs: [
      { label: "Двигатель", value: "1.8 + электро" },
      { label: "Расход", value: "4.3 л/100км" },
      { label: "Мощность", value: "122 л.с." },
    ],
    description:
      "Спокойный семейный седан для города и трассы: электромотор берёт на себя разгон с места, бензиновый агрегат подключается на скорости — расход остаётся на уровне 4.3 л/100км даже в пробках.",
  },
  {
    id: "meridian-gt",
    name: "Meridian GT Hybrid",
    type: "hybrid",
    segment: "Кроссовер",
    price: 3_680_000,
    photo: PHOTOS["meridian-gt"],
    specs: [
      { label: "Двигатель", value: "2.0 + электро" },
      { label: "Расход", value: "4.9 л/100км" },
      { label: "Мощность", value: "184 л.с." },
    ],
    description:
      "Полноприводный гибридный кроссовер с увеличенным клиренсом: уверенно держит дорогу в межсезонье, а система рекуперации экономит до 20% топлива в смешанном цикле.",
  },
  {
    id: "lumen-cross",
    name: "Lumen Cross Hybrid",
    type: "hybrid",
    segment: "Плагин-гибрид, лифтбек",
    price: 3_990_000,
    photo: PHOTOS["lumen-cross"],
    specs: [
      { label: "Двигатель", value: "1.6 + электро" },
      { label: "Запас хода (эл.)", value: "62 км" },
      { label: "Мощность", value: "245 л.с." },
    ],
    description:
      "Плагин-гибрид для тех, кто хочет ездить на электротяге по городу и не думать о запасе хода за его пределами: 62 км на чистом электричестве и полный бак в запасе.",
  },
  {
    id: "horizon-wagon",
    name: "Horizon Wagon Hybrid",
    type: "hybrid",
    segment: "Универсал",
    price: 3_450_000,
    photo: PHOTOS["horizon-wagon"],
    specs: [
      { label: "Двигатель", value: "2.0 + электро" },
      { label: "Расход", value: "5.1 л/100км" },
      { label: "Мощность", value: "160 л.с." },
    ],
    description:
      "Универсал с большим багажником и гибридной силовой установкой — для семей, которым важны и пространство, и экономичность на дальних поездках.",
  },

  // ─── Бензин ────────────────────────────────────────────────────────────
  {
    id: "vantis-sport",
    name: "Vantis Sport",
    type: "gasoline",
    segment: "Купе",
    price: 4_990_000,
    photo: PHOTOS["vantis-sport"],
    specs: [
      { label: "Двигатель", value: "2.0 Turbo" },
      { label: "Разгон 0-100", value: "6.4 с" },
      { label: "Мощность", value: "249 л.с." },
    ],
    description:
      "Заряженное купе с турбированным двигателем и спортивной подвеской — для тех, кому важен характер автомобиля не меньше, чем его практичность.",
  },
  {
    id: "orion-turbo",
    name: "Orion Turbo",
    type: "gasoline",
    segment: "Внедорожник",
    price: 5_690_000,
    photo: PHOTOS["orion-turbo"],
    specs: [
      { label: "Двигатель", value: "2.3 Turbo" },
      { label: "Разгон 0-100", value: "8.1 с" },
      { label: "Мощность", value: "280 л.с." },
    ],
    description:
      "Полноразмерный внедорожник с полным приводом и турбомотором — уверенно идёт по бездорожью и так же комфортно чувствует себя на трассе с прицепом.",
  },
  {
    id: "centurion-sedan",
    name: "Centurion Sedan",
    type: "gasoline",
    segment: "Бизнес-седан",
    price: 3_210_000,
    photo: PHOTOS["centurion-sedan"],
    specs: [
      { label: "Двигатель", value: "2.5 л" },
      { label: "Разгон 0-100", value: "7.8 с" },
      { label: "Мощность", value: "190 л.с." },
    ],
    description:
      "Классический бизнес-седан с просторным салоном и тихим ходом — выбор тех, кто ценит комфорт и статус в ежедневных поездках.",
  },
  {
    id: "stratus-coupe",
    name: "Stratus Coupe",
    type: "gasoline",
    segment: "Купе",
    price: 6_190_000,
    photo: PHOTOS["stratus-coupe"],
    specs: [
      { label: "Двигатель", value: "3.0 V6" },
      { label: "Разгон 0-100", value: "5.2 с" },
      { label: "Мощность", value: "320 л.с." },
    ],
    description:
      "Флагманское купе с V6 под капотом: 320 л.с. и разгон до сотни за 5.2 секунды — для тех, кто выбирает эмоции за рулём в первую очередь.",
  },

  // ─── Электро ───────────────────────────────────────────────────────────
  {
    id: "onyx-one",
    name: "Onyx One",
    type: "electric",
    segment: "Кроссовер",
    price: 4_290_000,
    photo: PHOTOS["onyx-one"],
    specs: [
      { label: "Мощность", value: "150 кВт" },
      { label: "Запас хода", value: "480 км" },
      { label: "Разгон 0-100", value: "7.1 с" },
    ],
    description:
      "Электрический кроссовер с запасом хода 480 км — хватает на неделю городских поездок без подзарядки, а быстрая зарядка восполняет 80% батареи за 30 минут.",
  },
  {
    id: "velloc-gt",
    name: "Velloc GT",
    type: "electric",
    segment: "Электроседан",
    price: 6_890_000,
    photo: PHOTOS["velloc-gt"],
    specs: [
      { label: "Мощность", value: "320 кВт" },
      { label: "Запас хода", value: "520 км" },
      { label: "Разгон 0-100", value: "3.9 с" },
    ],
    description:
      "Флагманский электроседан: 320 кВт позволяют разогнаться до сотни за 3.9 секунды, а запас хода в 520 км снимает тревогу о дальних поездках.",
  },
  {
    id: "drev-urban",
    name: "Drev Urban",
    type: "electric",
    segment: "Городской хэтчбек",
    price: 2_990_000,
    photo: PHOTOS["drev-urban"],
    specs: [
      { label: "Мощность", value: "90 кВт" },
      { label: "Запас хода", value: "320 км" },
      { label: "Разгон 0-100", value: "9.8 с" },
    ],
    description:
      "Компактный электромобиль для города: минимальный радиус разворота, доступная цена входа в электромобильность и 320 км запаса хода на каждый день.",
  },
  {
    id: "aerin-gt",
    name: "Aerin GT",
    type: "electric",
    segment: "Электрофастбек",
    price: 5_190_000,
    photo: PHOTOS["aerin-gt"],
    specs: [
      { label: "Мощность", value: "200 кВт" },
      { label: "Запас хода", value: "440 км" },
      { label: "Разгон 0-100", value: "5.6 с" },
    ],
    description:
      "Электрофастбек с полным приводом на два мотора — мощность 200 кВт даёт запас для уверенных обгонов, а 440 км хода хватает на поездку за город и обратно.",
  },
];
