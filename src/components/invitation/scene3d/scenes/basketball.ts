import * as THREE from "three";
import { ball, box, easeIn, easeInOut, gloss, group, lerp, mat, mesh, metals, paintSphere, rods, span, TAU, torus, V, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const rimY = 0.18;
  const rimZ = 0.16;

  // Backboard
  root.add(mesh(box(1.7, 1.12, 0.06, 0.05), gloss("#F6F7F9", 0.2), [0, 0.62, -0.46]));
  const red = mat("#E4461F", 0.45);
  const frame = (w: number, h: number, t: number, y: number) => {
    for (const s of [-1, 1]) {
      root.add(mesh(new THREE.BoxGeometry(w, t, 0.012), red, [0, y + (s * h) / 2, -0.426]));
      root.add(mesh(new THREE.BoxGeometry(t, h + t, 0.012), red, [(s * w) / 2, y, -0.426]));
    }
  };
  frame(0.66, 0.46, 0.045, 0.46);
  frame(1.58, 1, 0.03, 0.62);

  // Hoop and net
  root.add(mesh(torus(0.4, 0.026), gloss("#F04A16", 0.3), [0, rimY, rimZ], [Math.PI / 2, 0, 0]));
  root.add(mesh(box(0.22, 0.12, 0.24, 0.03), metals.steel(), [0, rimY - 0.02, -0.34]));
  const net = group();
  net.position.set(0, rimY, rimZ);
  const n = 12;
  const rows = [[0.4, 0], [0.36, -0.16], [0.31, -0.32], [0.27, -0.47], [0.25, -0.6]];
  const pairs: [THREE.Vector3, THREE.Vector3][] = [];
  for (let r = 0; r < rows.length - 1; r++)
    for (let i = 0; i < n; i++) {
      const at = (row: number, k: number) => {
        const a = ((k + (row % 2) * 0.5) / n) * TAU;
        return V(Math.cos(a) * rows[row][0], rows[row][1], Math.sin(a) * rows[row][0]);
      };
      pairs.push([at(r, i), at(r + 1, i)], [at(r, i + (r % 2)), at(r + 1, i - 1 + (r % 2))]);
    }
  net.add(rods(pairs, 0.011, mat("#FFFFFF", 0.8)));
  root.add(net);

  const skin = paintSphere(512, 256, (x, y, z) => {
    const line = Math.abs(x) < 0.02 || Math.abs(y) < 0.02 || Math.abs(Math.abs(z) - 0.42 - y * y * 0.46) < 0.02;
    if (line) return ["#1A1210", 0];
    const grain = Math.sin(x * 120) * Math.sin(y * 120) * Math.sin(z * 120);
    return [grain > 0.15 ? "#E06A1E" : "#D9621A", 0.55 + grain * 0.5];
  });
  const b = mesh(ball(0.33, 56, 40), mat("#FFFFFF", 0.62, 0, { map: skin.map, bumpMap: skin.bumpMap, bumpScale: 1.6 }));
  root.add(b);

  return {
    root,
    duration: 1.9,
    radius: 1.2,
    view: [0.2, 0.16, 1],
    look: [0, 0.08, 0],
    update: ({ time, play }) => {
      const arc = span(play, 0.06, 0.5);
      const drop = easeIn(span(play, 0.5, 0.95));
      const e = lerp(arc, easeInOut(arc), 0.35);
      b.position.set(
        lerp(-0.62, 0, e),
        lerp(-0.66, rimY + 0.36, e) + Math.sin(e * Math.PI) * 0.75 - drop * 1.6 + (arc === 0 ? Math.sin(time * 1.5) * 0.04 : 0),
        lerp(0.75, rimZ, e),
      );
      b.rotation.set(0.4 - play * 9, 0.5 + time * 0.4, 0.3);
      const through = span(play, 0.56, 0.72);
      const wobble = Math.sin(through * Math.PI);
      net.scale.set(1 + wobble * 0.16, 1 + wobble * 0.22 - Math.sin(span(play, 0.72, 1) * 12) * 0.1 * (1 - span(play, 0.72, 1)), 1 + wobble * 0.16);
    },
  };
}
