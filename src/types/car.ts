export type CarType = "hybrid" | "gasoline" | "electric";

export interface CarSpec {
  label: string;
  value: string;
}

/** One catalog photo + its per-shot treatment (design/images.md, spec-v2 §9). */
export interface CarPhoto {
  src: string;
  alt: string;
  /** Mirror horizontally so the series faces right (hood → right). */
  mirror?: boolean;
  /** CSS object-position override; default "50% 62%" (card) / "50% 58%" (modal). */
  position?: string;
  /** Grade override (§9.2): base brightness, default 0.84. */
  brightness?: number;
  /** Grade override: base contrast, default 1.14. */
  contrast?: number;
  /** Extra dark band at the bottom edge (hides hubcaps / plates). */
  shadeBottom?: boolean;
}

export interface Car {
  id: string;
  name: string;
  type: CarType;
  /** One-line body style / segment shown under the name, e.g. "Седан", "Кроссовер". */
  segment: string;
  price: number;
  photo: CarPhoto;
  specs: CarSpec[];
  description: string;
}

export const CAR_TYPE_LABELS: Record<CarType, string> = {
  hybrid: "Гибрид",
  gasoline: "Бензин",
  electric: "Электро",
};
