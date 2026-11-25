import * as THREE from "three";
import { bounceOut, box, cyl, easeOut, gloss, group, lathe, lerp, mat, mesh, span, TAU, tube, V, type BuiltScene } from "../kit";

function book(w: number, h: number, d: number, cover: string, band: string) {
  const c = mat(cover, 0.55);
  const pages = mat("#F6EEDC", 0.9);
  const g = group(
    mesh(box(w, 0.035, d, 0.012), c, [0, h / 2 - 0.0175, 0]),
    mesh(box(w, 0.035, d, 0.012), c, [0, -h / 2 + 0.0175, 0]),
    mesh(box(w - 0.07, h - 0.06, d - 0.08, 0.005), pages, [0.0, 0, -0.02]),
  );
  // Rounded spine faces the guest
  const spine = mesh(cyl(h / 2, h / 2, w, 32), c, [0, 0, d / 2 - 0.03], [0, 0, Math.PI / 2]);
  spine.scale.z = 0.45;
  g.add(spine);
  const gold = mat(band, 0.35, 0.6);
  for (const x of [-w * 0.36, w * 0.36]) g.add(mesh(box(0.035, h * 0.98, 0.012, 0.004), gold, [x, 0, d / 2 - 0.028 + h * 0.225]));
  g.add(mesh(box(w * 0.38, h * 0.3, 0.012, 0.004), gold, [0, 0, d / 2 - 0.028 + h * 0.222]));
  return g;
}

export function build(): BuiltScene {
  const root = group();
  const floor = -0.82;
  const specs = [
    { w: 1.7, h: 0.3, d: 1.2, c: "#1F5FA8", b: "#E7C35A", r: 0.08 },
    { w: 1.5, h: 0.24, d: 1.1, c: "#D9432F", b: "#F3E2B4", r: -0.14 },
    { w: 1.56, h: 0.28, d: 1.06, c: "#F0B429", b: "#7A3E12", r: 0.2 },
    { w: 1.32, h: 0.22, d: 1, c: "#6B3FA0", b: "#E9D8FF", r: -0.1 },
  ];
  let y = floor;
  const books = specs.map((s) => {
    const g = book(s.w, s.h, s.d, s.c, s.b);
    const rest = y + s.h / 2;
    y += s.h;
    root.add(g);
    return { g, rest, r: s.r };
  });
  const top = y;

  // Apple
  const apple = group(
    mesh(lathe([[0, 0.02], [0.1, 0], [0.2, 0.06], [0.27, 0.22], [0.25, 0.38], [0.15, 0.46], [0.06, 0.42], [0, 0.38]], 48), gloss("#C9202B", 0.2, { clearcoat: 1 })),
    mesh(tube([V(0, 0.38, 0), V(0.01, 0.47, 0), V(0.045, 0.54, 0)], 0.016, false, 14), mat("#5A3A1E", 0.8)),
  );
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(0.08, 0.07, 0.2, 0.08, 0.25, 0.02);
  leaf.bezierCurveTo(0.18, -0.06, 0.07, -0.06, 0, 0);
  const lm = mesh(new THREE.ShapeGeometry(leaf, 10), mat("#4C9A3F", 0.5, 0, { side: THREE.DoubleSide }), [0.03, 0.47, 0], [-0.5, 0.3, 0.35]);
  apple.add(lm);
  root.add(apple);

  // Pencil
  const pencil = group(
    mesh(cyl(0.05, 0.05, 1, 6), gloss("#F2B632", 0.4)),
    mesh(new THREE.ConeGeometry(0.05, 0.16, 6), mat("#E9C999", 0.8), [0, 0.58, 0]),
    mesh(new THREE.ConeGeometry(0.018, 0.058, 8), mat("#26262A", 0.6), [0, 0.632, 0]),
    mesh(cyl(0.052, 0.052, 0.08, 20), mat("#C9CDD3", 0.3, 0.9), [0, -0.53, 0]),
    mesh(cyl(0.05, 0.045, 0.1, 20), mat("#E58AA0", 0.7), [0, -0.61, 0]),
  );
  root.add(pencil);

  return {
    root,
    duration: 2.2,
    radius: 1.22,
    view: [0.28, 0.3, 1],
    look: [0, -0.08, 0],
    turn: "full",
    floor,
    update: ({ time, play, scroll }) => {
      books.forEach((b, i) => {
        const t = bounceOut(span(play, i * 0.13, i * 0.13 + 0.42));
        b.g.position.set(lerp(i % 2 ? 0.28 : -0.28, 0, t), b.rest + (1 - t) * (0.2 + i * 0.17) + scroll * i * 0.14, 0);
        b.g.rotation.set((1 - t) * (i % 2 ? 0.3 : -0.25), b.r + (1 - t) * (i % 2 ? 1 : -1), (1 - t) * (i % 2 ? -0.25 : 0.25));
      });
      const a = bounceOut(span(play, 0.56, 0.98));
      apple.position.set(-0.12, top + (1 - a) * 0.85 + scroll * 0.7, 0.05);
      apple.rotation.y = time * 0.15;
      const p = easeOut(span(play, 0.5, 0.95));
      pencil.position.set(lerp(1.15, 0.86, p), floor + 0.52 + Math.sin(time) * 0.01, 0.5);
      pencil.rotation.set(-0.22, TAU * 0.1, lerp(-1.4, 0.16, p));
    },
  };
}
