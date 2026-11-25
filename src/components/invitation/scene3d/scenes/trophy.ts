import * as THREE from "three";
import { box, cyl, easeInOut, extrude, gloss, group, lathe, mesh, metals, rng, span, TAU, tube, V, type BuiltScene } from "../kit";

function star(r: number) {
  const s = new THREE.Shape();
  for (let i = 0; i <= 10; i++) {
    const a = (i / 10) * TAU + Math.PI / 2;
    const k = i % 2 ? r * 0.45 : r;
    s[i ? "lineTo" : "moveTo"](Math.cos(a) * k, Math.sin(a) * k);
  }
  return s;
}

export function build(): BuiltScene {
  const root = group();
  const floor = -1.02;
  const gold = metals.gold();
  const cup = group();
  cup.add(mesh(lathe([
    [0.02, -0.3], [0.1, -0.28], [0.09, -0.12], [0.16, -0.04], [0.12, 0.02], [0.3, 0.14], [0.46, 0.42], [0.52, 0.82], [0.56, 0.96], [0.53, 0.97], [0.48, 0.82], [0.42, 0.46], [0.26, 0.2], [0, 0.14],
  ], 72), gold));
  cup.add(mesh(lathe([[0, -0.52], [0.34, -0.52], [0.34, -0.48], [0.2, -0.44], [0.11, -0.34], [0.1, -0.26]], 56), gold));
  for (const s of [-1, 1])
    cup.add(mesh(tube([V(s * 0.47, 0.8, 0), V(s * 0.74, 0.86, 0), V(s * 0.84, 0.6, 0), V(s * 0.68, 0.34, 0), V(s * 0.42, 0.26, 0), V(s * 0.36, 0.18, 0)], 0.045, false, 60), gold));
  const st = mesh(extrude(star(0.19), 0.04, 0.015), gold, [0, 0.58, 0.5], [-0.14, 0, 0]);
  cup.add(st);
  const ring = mesh(lathe([[0.5, 0.75], [0.525, 0.77], [0.53, 0.8], [0.51, 0.82]], 64), metals.brass());
  cup.add(ring);
  root.add(cup);

  const plinth = group(
    mesh(cyl(0.44, 0.5, 0.22, 56), gloss("#17131C", 0.2), [0, floor + 0.36, 0]),
    mesh(cyl(0.54, 0.58, 0.25, 56), gloss("#17131C", 0.2), [0, floor + 0.125, 0]),
    mesh(box(0.42, 0.12, 0.04, 0.015), gold, [0, floor + 0.125, 0.555], [-0.12, 0, 0]),
  );
  root.add(plinth);

  // Confetti, only seen once the cup is lifted
  const n = 90;
  const bits = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.06, 0.1), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6 }), n);
  const r = rng(5);
  const seeds = Array.from({ length: n }, () => ({ a: r() * TAU, v: 0.4 + r() * 1.1, up: 1.2 + r() * 1.7, spin: r() * 9, d: r() * 0.12 }));
  const colors = ["#F25C3F", "#F2B632", "#37B6A6", "#6C63F0", "#FFFFFF"].map((c) => new THREE.Color(c));
  seeds.forEach((_, i) => bits.setColorAt(i, colors[i % colors.length]));
  bits.frustumCulled = false;
  root.add(bits);
  const o = new THREE.Object3D();

  return {
    root,
    duration: 2.1,
    radius: 1.16,
    view: [0, 0.22, 1],
    turn: "full",
    floor,
    update: ({ play }) => {
      const lift = easeInOut(span(play, 0.02, 0.4)) - easeInOut(span(play, 0.72, 1));
      cup.position.y = 0.06 + lift * 0.3;
      cup.rotation.y = easeInOut(span(play, 0.02, 0.95)) * TAU;
      bits.visible = play > 0.3 && play < 1;
      if (!bits.visible) return;
      seeds.forEach((s, i) => {
        const t = Math.max(0, span(play, 0.32 + s.d, 1)) * 1.5;
        o.position.set(Math.cos(s.a) * s.v * t, 0.8 + s.up * t - 1.9 * t * t, Math.sin(s.a) * s.v * t);
        o.rotation.set(s.spin * t * 2, s.spin + t * 5, s.spin * t);
        o.scale.setScalar(t > 0 ? 1 - span(play, 0.85, 1) : 0);
        o.updateMatrix();
        bits.setMatrixAt(i, o.matrix);
      });
      bits.instanceMatrix.needsUpdate = true;
    },
  };
}
