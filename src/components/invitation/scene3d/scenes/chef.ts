import * as THREE from "three";
import { ball, box, cyl, easeInOut, gloss, group, lathe, lerp, mat, mesh, metals, rng, span, TAU, tube, V, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const floor = -0.62;

  // Plate on a charger
  root.add(mesh(lathe([[0, 0], [0.9, 0], [1.12, 0.05], [1.16, 0.08], [1.1, 0.085], [0.84, 0.03], [0, 0.03]], 80), metals.brass(), [0, floor, 0]));
  root.add(mesh(lathe([[0, 0.02], [0.6, 0.02], [0.95, 0.09], [1, 0.12], [0.95, 0.13], [0.66, 0.07], [0, 0.065]], 80), gloss("#FBF8F1", 0.18), [0, floor + 0.04, 0]));

  // The dish: a glazed tart with fruit
  const dish = group();
  dish.add(mesh(lathe([[0, 0], [0.42, 0], [0.5, 0.17], [0.47, 0.19], [0.44, 0.14], [0, 0.14]], 64), mat("#C98A45", 0.65)));
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * TAU;
    dish.add(mesh(ball(0.052, 12, 10), mat("#CF944F", 0.65), [Math.cos(a) * 0.485, 0.175, Math.sin(a) * 0.485]));
  }
  dish.add(mesh(cyl(0.45, 0.45, 0.04, 56), gloss("#F6D98A", 0.2), [0, 0.15, 0]));
  const berry = gloss("#B3122F", 0.18, { clearcoat: 1 });
  const blue = gloss("#33407F", 0.4);
  const place = (n: number, radius: number, m: THREE.Material, r: number, off = 0) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + off;
      dish.add(mesh(ball(r, 22, 16), m, [Math.cos(a) * radius, 0.17 + r * 0.6, Math.sin(a) * radius]));
    }
  };
  place(10, 0.33, berry, 0.085);
  place(6, 0.17, blue, 0.075, 0.3);
  dish.add(mesh(ball(0.1, 24, 18), berry, [0, 0.27, 0]));
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(0.08, 0.04, 0.09, 0.14, 0, 0.22);
  leaf.bezierCurveTo(-0.09, 0.14, -0.08, 0.04, 0, 0);
  const mint = mat("#3E8E41", 0.6, 0, { side: THREE.DoubleSide });
  for (const [a, t] of [[0.2, 0.9], [2.2, 0.7], [4.3, 0.8]]) {
    const l = mesh(new THREE.ShapeGeometry(leaf, 10), mint, [0, 0.34, 0]);
    l.rotation.set(t, a, 0, "YXZ");
    dish.add(l);
  }
  dish.position.y = floor + 0.1;
  root.add(dish);
  // Sauce dots round the plate
  for (let i = 0; i < 7; i++) {
    const a = 0.5 + i * 0.22;
    const d = mesh(ball(0.05 - i * 0.005, 18, 12), berry, [Math.cos(a) * 0.68, floor + 0.12, Math.sin(a) * 0.68]);
    d.scale.y = 0.35;
    root.add(d);
  }

  // Cloche
  const cloche = group();
  const chrome = metals.chrome();
  const dome: [number, number][] = [];
  for (let i = 0; i <= 18; i++) {
    const a = (i / 18) * (Math.PI / 2);
    dome.push([Math.cos(a) * 0.78, 0.06 + Math.sin(a) * 0.74]);
  }
  const shell = mesh(lathe([[0.82, 0], [0.83, 0.03], [0.79, 0.05], ...dome], 80, false), new THREE.MeshStandardMaterial({ color: "#EDF0F4", roughness: 0.09, metalness: 1, side: THREE.DoubleSide }));
  cloche.add(shell);
  cloche.add(mesh(cyl(0.03, 0.05, 0.08, 20), chrome, [0, 0.83, 0]), mesh(ball(0.085, 28, 20), metals.brass(), [0, 0.92, 0]));
  root.add(cloche);

  // Cutlery
  const steel = metals.steel();
  const fork = group(mesh(box(0.05, 0.02, 0.8, 0.01), steel, [0, 0, 0.24]), mesh(box(0.16, 0.02, 0.06, 0.01), steel, [0, 0, -0.2]));
  for (const x of [-0.066, -0.022, 0.022, 0.066]) fork.add(mesh(box(0.022, 0.018, 0.24, 0.008), steel, [x, 0, -0.32]));
  fork.position.set(-1.12, floor + 0.02, 0.3);
  fork.rotation.y = 0.12;
  root.add(fork);
  const knife = group(mesh(box(0.06, 0.03, 0.5, 0.014), steel, [0, 0, 0.36]), mesh(box(0.09, 0.015, 0.58, 0.007), steel, [0.01, 0, -0.16]));
  knife.position.set(1.16, floor + 0.02, 0.3);
  knife.rotation.y = -0.12;
  root.add(knife);

  // Steam
  const r = rng(9);
  const steamMat = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0, depthWrite: false });
  const steam = Array.from({ length: 3 }, (_, i) => {
    const pts = Array.from({ length: 7 }, (_, k) => V(Math.sin(k * 1.1 + r() * 2) * 0.05, k * 0.1, 0));
    const m = new THREE.Mesh(tube(pts, 0.016, false, 40), steamMat);
    m.position.set((i - 1) * 0.2, floor + 0.55, 0.1);
    root.add(m);
    return m;
  });

  return {
    root,
    duration: 2,
    radius: 1.3,
    view: [0, 0.42, 1],
    look: [0, 0, 0],
    floor,
    update: ({ time, play, scroll }) => {
      const t = easeInOut(span(play, 0.06, 0.8));
      cloche.position.set(lerp(0, 0.26, t), floor + 0.14 + t * 0.94 + (t === 1 ? Math.sin(time * 1.1) * 0.03 : 0) + scroll * 0.3, lerp(0, -0.2, t));
      cloche.rotation.set(-t * 0.2, 0, -t * 0.42);
      dish.rotation.y = time * 0.12;
      steamMat.opacity = span(play, 0.35, 0.8) * 0.3;
      steam.forEach((s, i) => {
        s.position.y = floor + 0.5 + Math.sin(time * 0.9 + i * 2) * 0.05;
        s.scale.set(1 + Math.sin(time * 1.6 + i) * 0.4, 1 + Math.sin(time * 1.1 + i * 2) * 0.15, 1);
      });
    },
  };
}
