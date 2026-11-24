/**
 * Silhouettes for printed cards. Each shape is built from straight lines and
 * cubic curves only, so the same outline can clip the preview on screen and be
 * written as a vector cut line in the print PDF.
 */

export type ShapeId = "rect" | "arch" | "ogee" | "plaque" | "circle" | "scallop" | "moonstone" | "hexagon" | "leaf" | "tag" | "pill" | "ticket" | "petal";

export type Segment =
  | { c: "M" | "L"; x: number; y: number }
  | { c: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { c: "Z" };

export interface ShapeDef {
  id: ShapeId;
  label: string;
  /** Where words can safely sit, as fractions of the card's width and height */
  safe: { top: number; right: number; bottom: number; left: number };
  /** Outline for a card of the given width and height */
  outline: (w: number, h: number) => Segment[];
  /** Punched holes, as fractions of width and height, with radius as a fraction of width */
  holes?: { x: number; y: number; r: number }[];
}

const K = 0.5523; // control point distance that makes a cubic curve trace a quarter circle

const M = (x: number, y: number): Segment => ({ c: "M", x, y });
const L = (x: number, y: number): Segment => ({ c: "L", x, y });
const C = (x1: number, y1: number, x2: number, y2: number, x: number, y: number): Segment => ({ c: "C", x1, y1, x2, y2, x, y });
const Z: Segment = { c: "Z" };

/** Full circle as four curves. Also used for holes. */
export function circleSegments(cx: number, cy: number, r: number): Segment[] {
  const k = r * K;
  return [
    M(cx, cy - r),
    C(cx + k, cy - r, cx + r, cy - k, cx + r, cy),
    C(cx + r, cy + k, cx + k, cy + r, cx, cy + r),
    C(cx - k, cy + r, cx - r, cy + k, cx - r, cy),
    C(cx - r, cy - k, cx - k, cy - r, cx, cy - r),
    Z,
  ];
}

export const shapes: ShapeDef[] = [
  {
    id: "rect",
    label: "Classic rectangle",
    safe: { top: 0.07, right: 0.08, bottom: 0.07, left: 0.08 },
    outline: (w, h) => [M(0, 0), L(w, 0), L(w, h), L(0, h), Z],
  },
  {
    id: "arch",
    label: "Arch top",
    safe: { top: 0.2, right: 0.1, bottom: 0.07, left: 0.1 },
    outline: (w, h) => {
      const r = w / 2;
      const k = r * K;
      return [M(0, h), L(0, r), C(0, r - k, r - k, 0, r, 0), C(r + k, 0, w, r - k, w, r), L(w, h), Z];
    },
  },
  {
    id: "ogee",
    label: "Temple arch",
    safe: { top: 0.24, right: 0.1, bottom: 0.07, left: 0.1 },
    outline: (w, h) => [
      M(0, h),
      L(0, h * 0.3),
      C(0, h * 0.17, w * 0.37, h * 0.15, w * 0.5, 0),
      C(w * 0.63, h * 0.15, w, h * 0.17, w, h * 0.3),
      L(w, h),
      Z,
    ],
  },
  {
    id: "plaque",
    label: "Deco plaque",
    safe: { top: 0.1, right: 0.11, bottom: 0.1, left: 0.11 },
    outline: (w, h) => {
      const r = w * 0.09;
      const k = r * K;
      return [
        M(r, 0), L(w - r, 0), C(w - r, k, w - k, r, w, r),
        L(w, h - r), C(w - k, h - r, w - r, h - k, w - r, h),
        L(r, h), C(r, h - k, k, h - r, 0, h - r),
        L(0, r), C(k, r, r, k, r, 0), Z,
      ];
    },
  },
  {
    id: "circle",
    label: "Round",
    safe: { top: 0.16, right: 0.16, bottom: 0.16, left: 0.16 },
    outline: (w, h) => circleSegments(w / 2, h / 2, Math.min(w, h) / 2),
  },
  {
    id: "scallop",
    label: "Scalloped flower",
    safe: { top: 0.19, right: 0.19, bottom: 0.19, left: 0.19 },
    outline: (w, h) => {
      // A circle whose edge swells into sixteen soft petals.
      const n = 16;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 2;
      const inner = r * 0.93;
      const bulge = r * 1.045;
      const at = (radius: number, angle: number) => [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)] as const;
      const out: Segment[] = [M(...at(inner, 0))];
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2;
        const a1 = ((i + 1) / n) * Math.PI * 2;
        const step = (a1 - a0) / 3;
        const [x1, y1] = at(bulge, a0 + step * 0.6);
        const [x2, y2] = at(bulge, a1 - step * 0.6);
        const [x, y] = at(inner, a1);
        out.push(C(x1, y1, x2, y2, x, y));
      }
      out.push(Z);
      return out;
    },
  },
  {
    id: "moonstone",
    label: "Moonstone half circle",
    safe: { top: 0.3, right: 0.2, bottom: 0.1, left: 0.2 },
    outline: (w, h) => {
      const r = w / 2;
      const kx = r * K;
      const ky = h * K;
      return [M(0, h), C(0, h - ky, r - kx, 0, r, 0), C(r + kx, 0, w, h - ky, w, h), Z];
    },
  },
  {
    id: "hexagon",
    label: "Hexagon",
    safe: { top: 0.16, right: 0.11, bottom: 0.16, left: 0.11 },
    outline: (w, h) => [M(w / 2, 0), L(w, h * 0.25), L(w, h * 0.75), L(w / 2, h), L(0, h * 0.75), L(0, h * 0.25), Z],
  },
  {
    id: "leaf",
    label: "Betel leaf",
    safe: { top: 0.17, right: 0.2, bottom: 0.3, left: 0.2 },
    outline: (w, h) => [
      M(w * 0.5, h * 0.07),
      C(w * 0.42, -h * 0.01, w * 0.13, -h * 0.01, w * 0.04, h * 0.2),
      C(0, h * 0.42, w * 0.17, h * 0.73, w * 0.5, h),
      C(w * 0.83, h * 0.73, w, h * 0.42, w * 0.96, h * 0.2),
      C(w * 0.87, -h * 0.01, w * 0.58, -h * 0.01, w * 0.5, h * 0.07),
      Z,
    ],
  },
  {
    id: "petal",
    label: "Lotus petal",
    safe: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
    outline: (w, h) => [
      M(w * 0.5, 0),
      C(w * 0.86, h * 0.2, w, h * 0.42, w, h * 0.58),
      C(w, h * 0.82, w * 0.76, h, w * 0.5, h),
      C(w * 0.24, h, 0, h * 0.82, 0, h * 0.58),
      C(0, h * 0.42, w * 0.14, h * 0.2, w * 0.5, 0),
      Z,
    ],
  },
  {
    id: "tag",
    label: "Luggage tag",
    safe: { top: 0.2, right: 0.1, bottom: 0.06, left: 0.1 },
    outline: (w, h) => [M(w * 0.24, 0), L(w * 0.76, 0), L(w, h * 0.13), L(w, h), L(0, h), L(0, h * 0.13), Z],
    holes: [{ x: 0.5, y: 0.075, r: 0.04 }],
  },
  {
    id: "pill",
    label: "Ola leaf strip",
    safe: { top: 0.14, right: 0.08, bottom: 0.14, left: 0.08 },
    outline: (w, h) => {
      const r = h * 0.32;
      const k = r * K;
      return [
        M(r, 0), L(w - r, 0), C(w - r + k, 0, w, r - k, w, r),
        L(w, h - r), C(w, h - r + k, w - r + k, h, w - r, h),
        L(r, h), C(r - k, h, 0, h - r + k, 0, h - r),
        L(0, r), C(0, r - k, r - k, 0, r, 0), Z,
      ];
    },
    holes: [
      { x: 0.27, y: 0.5, r: 0.014 },
      { x: 0.73, y: 0.5, r: 0.014 },
    ],
  },
  {
    id: "ticket",
    label: "Ticket",
    safe: { top: 0.1, right: 0.05, bottom: 0.1, left: 0.05 },
    outline: (w, h) => {
      const x = w * 0.74;
      const n = h * 0.06;
      const k = n * K;
      return [
        M(0, 0), L(x - n, 0), C(x - n, k, x - k, n, x, n), C(x + k, n, x + n, k, x + n, 0),
        L(w, 0), L(w, h), L(x + n, h), C(x + n, h - k, x + k, h - n, x, h - n), C(x - k, h - n, x - n, h - k, x - n, h),
        L(0, h), Z,
      ];
    },
  },
];

export function getShape(id: ShapeId): ShapeDef {
  return shapes.find((s) => s.id === id) ?? shapes[0];
}

/** Outline plus holes, moved by an offset (the bleed) on both axes. */
export function shapeSegments(id: ShapeId, w: number, h: number, offset = 0): Segment[] {
  const def = getShape(id);
  const all = [...def.outline(w, h)];
  for (const hole of def.holes ?? []) all.push(...circleSegments(hole.x * w, hole.y * h, hole.r * w));
  if (!offset) return all;
  return all.map((s) => {
    if (s.c === "Z") return s;
    if (s.c === "C") return { ...s, x1: s.x1 + offset, y1: s.y1 + offset, x2: s.x2 + offset, y2: s.y2 + offset, x: s.x + offset, y: s.y + offset };
    return { ...s, x: s.x + offset, y: s.y + offset };
  });
}

const f = (n: number) => Number(n.toFixed(2));

export function toSvgPath(segments: Segment[]): string {
  return segments
    .map((s) => {
      if (s.c === "Z") return "Z";
      if (s.c === "C") return `C${f(s.x1)} ${f(s.y1)} ${f(s.x2)} ${f(s.y2)} ${f(s.x)} ${f(s.y)}`;
      return `${s.c}${f(s.x)} ${f(s.y)}`;
    })
    .join("");
}

/** PDF drawing operators for the outline. PDF measures from the bottom left, so the y axis is flipped. */
export function toPdfPath(segments: Segment[], scale: number, pageHeight: number): string {
  const y = (v: number) => f(pageHeight - v * scale);
  const x = (v: number) => f(v * scale);
  return segments
    .map((s) => {
      if (s.c === "Z") return "h";
      if (s.c === "C") return `${x(s.x1)} ${y(s.y1)} ${x(s.x2)} ${y(s.y2)} ${x(s.x)} ${y(s.y)} c`;
      return `${x(s.x)} ${y(s.y)} ${s.c === "M" ? "m" : "l"}`;
    })
    .join(" ");
}
