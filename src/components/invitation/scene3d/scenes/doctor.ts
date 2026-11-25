import * as THREE from "three";
import { ball, cyl, easeInOut, easeOut, gloss, group, lathe, lerp, mat, mesh, metals, span, torus, tube, V, type BuiltScene } from "../kit";

function heart(s: number) {
  const p = new THREE.Shape();
  p.moveTo(0, -0.62 * s);
  p.bezierCurveTo(-0.5 * s, -0.24 * s, -0.72 * s, 0.02 * s, -0.66 * s, 0.3 * s);
  p.bezierCurveTo(-0.58 * s, 0.6 * s, -0.16 * s, 0.62 * s, 0, 0.3 * s);
  p.bezierCurveTo(0.16 * s, 0.62 * s, 0.58 * s, 0.6 * s, 0.66 * s, 0.3 * s);
  p.bezierCurveTo(0.72 * s, 0.02 * s, 0.5 * s, -0.24 * s, 0, -0.62 * s);
  return p;
}

export function build(): BuiltScene {
  const root = group();
  const rubber = gloss("#12324A", 0.42);
  const chrome = metals.chrome();

  const geo = new THREE.ExtrudeGeometry(heart(0.62), { depth: 0.1, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.15, bevelSegments: 10, curveSegments: 32 });
  geo.translate(0, 0, -0.05);
  const core = mesh(geo, gloss("#E0223A", 0.22, { clearcoat: 1 }));
  core.position.set(0, -0.06, 0.05);
  root.add(core);

  // Yoke and ear tubes, then one long tube that loops round the heart to the chest piece
  for (const s of [-1, 1]) {
    root.add(mesh(tube([V(s * 0.05, 0.6, -0.1), V(s * 0.16, 0.8, -0.1), V(s * 0.34, 0.95, -0.08), V(s * 0.4, 1.1, -0.02)], 0.03, false, 40), chrome));
    root.add(mesh(ball(0.06, 20, 16), mat("#12324A", 0.5), [s * 0.41, 1.14, -0.01]));
  }
  const end = V(0.62, -0.62, 0.34);
  const hose = mesh(tube([
    V(0, 0.6, -0.1), V(-0.06, 0.5, -0.16), V(-0.42, 0.44, -0.2), V(-0.78, 0.16, -0.1), V(-0.8, -0.34, 0.02), V(-0.46, -0.78, 0.12), V(0.06, -0.94, 0.2), V(0.46, -0.84, 0.3), V(end.x - 0.04, end.y - 0.14, end.z - 0.02),
  ], 0.052, false, 140), rubber);
  root.add(hose);
  root.add(mesh(ball(0.085, 24, 18), rubber, [0, 0.58, -0.1]));

  const piece = group(
    mesh(lathe([[0, -0.03], [0.2, -0.03], [0.235, 0], [0.235, 0.05], [0.2, 0.07], [0.09, 0.1], [0.07, 0.16], [0.1, 0.18], [0.13, 0.2], [0.12, 0.23], [0, 0.24]], 56), chrome),
    mesh(cyl(0.2, 0.2, 0.02, 48), mat("#F4F6F8", 0.5), [0, -0.036, 0]),
    mesh(torus(0.21, 0.02), rubber, [0, -0.02, 0], [Math.PI / 2, 0, 0]),
    mesh(cyl(0.035, 0.035, 0.12, 16), chrome, [0, 0.11, 0.1], [Math.PI / 2, 0, 0]),
  );
  root.add(piece);

  // Beats ripple outwards while the guest listens
  const ripples = [0, 1].map(() => {
    const m = mesh(torus(0.6, 0.012, Math.PI * 2, 80), new THREE.MeshBasicMaterial({ color: "#E0223A", transparent: true, opacity: 0, depthWrite: false }), [0, -0.02, -0.16]);
    m.castShadow = m.receiveShadow = false;
    root.add(m);
    return m;
  });

  return {
    root,
    duration: 2.2,
    radius: 1.12,
    view: [0, 0.08, 1],
    look: [0, 0.06, 0],
    update: ({ time, play }) => {
      // A slow double beat at rest, quicker and stronger during the action.
      const listening = play > 0 && play < 1;
      const beat = listening ? (play * 2.2 * 1.7) % 1 : (time * 0.85) % 1;
      const pulse = Math.max(0, Math.sin(beat * Math.PI * 5)) * Math.exp(-beat * 5);
      core.scale.setScalar(1 + pulse * (listening ? 0.22 : 0.09));
      ripples.forEach((m, i) => {
        const k = (beat + i * 0.5) % 1;
        m.visible = listening;
        m.scale.setScalar(0.8 + k * 0.95);
        m.material.opacity = (1 - k) * 0.55 * span(play, 0, 0.15) * (1 - span(play, 0.85, 1));
      });
      const near = easeInOut(span(play, 0, 0.25)) - easeOut(span(play, 0.85, 1));
      piece.position.set(lerp(end.x, 0.58, near), lerp(end.y, -0.57, near), lerp(end.z, 0.38, near));
      piece.rotation.set(1.25 + pulse * 0.1, 0.25, 0.35 - near * 0.3);
    },
  };
}
