/** Motion tokens — design/spec-v2.md §5.11. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
  lacquer: [0.65, 0, 0.35, 1],
  inQuart: [0.5, 0, 0.75, 0],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const springs = {
  tilt: { stiffness: 150, damping: 18, mass: 0.6 },
  magnet: { stiffness: 220, damping: 16, mass: 0.5 },
  navPill: { type: "spring", stiffness: 380, damping: 32 },
  segPill: { type: "spring", stiffness: 400, damping: 34 },
} as const;
