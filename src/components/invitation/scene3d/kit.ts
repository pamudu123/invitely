import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/* Small modelling helpers shared by every scene. Scenes are built from code, so
   there are no model or texture files to download on a phone. */

export interface Frame {
  /** Seconds since the scene started */
  time: number;
  /** The scene's own action, 0 to 1 */
  play: number;
  /** How far the cover has been scrolled away, 0 to 1 */
  scroll: number;
}

export interface BuiltScene {
  root: THREE.Object3D;
  /** Length of the action in seconds */
  duration: number;
  /** Camera direction, normalised by the engine */
  view?: [number, number, number];
  /** Point the camera looks at */
  look?: [number, number, number];
  /** Radius that has to stay inside the frame */
  radius?: number;
  /** Guests can spin it all the way round, or only lean it */
  turn?: "full" | "lean";
  /** Height of the ground that catches the shadow. Leave out for objects in the air. */
  floor?: number;
  update: (f: Frame) => void;
}

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const TAU = Math.PI * 2;

/* ------------------------------ easing ------------------------------ */

export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of t inside the window a to b */
export const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeIn = (t: number) => t * t * t;
export const backOut = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
export const bounceOut = (t: number) => {
  if (t < 0.36) return 7.5625 * t * t;
  if (t < 0.73) return 7.5625 * (t - 0.545) ** 2 + 0.75;
  if (t < 0.9) return 7.5625 * (t - 0.818) ** 2 + 0.9375;
  return 7.5625 * (t - 0.955) ** 2 + 0.984;
};

/* ----------------------------- materials ---------------------------- */

type MatOpts = THREE.MeshStandardMaterialParameters;

export const mat = (color: THREE.ColorRepresentation, roughness = 0.5, metalness = 0, more: MatOpts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...more });

export const gloss = (color: THREE.ColorRepresentation, roughness = 0.35, more: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness, clearcoat: 0.8, clearcoatRoughness: 0.2, ...more });

export const metals = {
  gold: () => mat("#FFC247", 0.2, 1),
  brass: () => mat("#E3B45E", 0.28, 1),
  chrome: () => mat("#F7F9FB", 0.12, 1),
  steel: () => mat("#AEB6C0", 0.32, 1),
  dark: () => mat("#2A2D33", 0.35, 0.8),
};

/* ----------------------------- geometry ----------------------------- */

type Triple = [number, number, number];

export function mesh<M extends THREE.Material | THREE.Material[]>(geo: THREE.BufferGeometry, material: M, pos?: Triple, rot?: Triple) {
  const m = new THREE.Mesh(geo, material);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group();
  if (children.length) g.add(...children);
  return g;
}

/** Turned shape from [radius, height] pairs, smoothed between points. */
export function lathe(points: [number, number][], segments = 48, smooth = true) {
  const pts = points.map(([x, y]) => new THREE.Vector2(x, y));
  const profile = smooth ? new THREE.SplineCurve(pts).getPoints(points.length * 6).map((p) => p.setX(Math.max(0, p.x))) : pts;
  return new THREE.LatheGeometry(profile, segments);
}

export const box = (w: number, h: number, d: number, r = 0.02) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));
export const cyl = (rt: number, rb: number, h: number, seg = 40) => new THREE.CylinderGeometry(rt, rb, h, seg);
export const ball = (r: number, w = 48, h = 32) => new THREE.SphereGeometry(r, w, h);
export const torus = (r: number, tubeR: number, arc = TAU, seg = 64) => new THREE.TorusGeometry(r, tubeR, 14, seg, arc);

export function tube(points: THREE.Vector3[], radius: number, closed = false, seg = points.length * 8) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed, "centripetal"), seg, radius, 10, closed);
}

export function extrude(shape: THREE.Shape, depth: number, bevel = 0.02, curveSegments = 24) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, curveSegments, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** Cylinder running from a to b. */
export function rod(a: THREE.Vector3, b: THREE.Vector3, r: number, material: THREE.Material, seg = 10) {
  const m = mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), seg), material);
  m.position.copy(a).lerp(b, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}

/** Many thin rods in one draw call. */
export function rods(pairs: [THREE.Vector3, THREE.Vector3][], r: number, material: THREE.Material) {
  const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(r, r, 1, 6), material, pairs.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  pairs.forEach(([a, b], i) => {
    const d = b.clone().sub(a);
    q.setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
    im.setMatrixAt(i, m.compose(a.clone().lerp(b, 0.5), q, V(1, d.length(), 1)));
  });
  im.castShadow = true;
  return im;
}

/* ------------------------------ textures ---------------------------- */

export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const hexRgb = (hex: string): Triple => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Paint a sphere point by point. The painter gets a unit direction and returns a colour and a height from 0 to 1. */
export function paintSphere(w: number, h: number, paint: (x: number, y: number, z: number) => [string, number]) {
  const cache = new Map<string, Triple>();
  const color = new ImageData(w, h);
  const bump = new ImageData(w, h);
  for (let j = 0; j < h; j++) {
    const th = ((j + 0.5) / h) * Math.PI;
    for (let i = 0; i < w; i++) {
      const ph = ((i + 0.5) / w) * TAU;
      const [hex, height] = paint(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th));
      let rgb = cache.get(hex);
      if (!rgb) cache.set(hex, (rgb = hexRgb(hex)));
      const k = (j * w + i) * 4;
      const b = Math.round(clamp(height) * 255);
      color.data[k] = rgb[0];
      color.data[k + 1] = rgb[1];
      color.data[k + 2] = rgb[2];
      bump.data[k] = bump.data[k + 1] = bump.data[k + 2] = b;
      color.data[k + 3] = bump.data[k + 3] = 255;
    }
  }
  const tex = (d: ImageData, srgb: boolean) => canvasTexture(w, h, (ctx) => ctx.putImageData(d, 0, 0), srgb);
  return { map: tex(color, true), bumpMap: tex(bump, false) };
}

/** Repeatable random numbers, so a scene looks the same every time. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
