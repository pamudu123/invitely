import * as THREE from "three";
import { ball, box, cyl, easeIn, easeInOut, extrude, gloss, group, lathe, mat, mesh, metals, rng, span, type BuiltScene } from "../kit";

function wing(root: number, tip: number, len: number, sweep: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(len, -sweep);
  s.quadraticCurveTo(len + 0.03, -sweep - tip * 0.5, len, -sweep - tip);
  s.lineTo(0, -root);
  s.closePath();
  return extrude(s, 0.02, 0.014, 8);
}

export function build(): BuiltScene {
  const root = group();
  const white = gloss("#FBFCFE", 0.22);
  const navy = gloss("#0B4FA8", 0.25);
  const red = gloss("#E8372C", 0.3);
  const glass = gloss("#10253F", 0.08);

  // Aeroplane, nose along +z
  const plane = group();
  const body = mesh(lathe([[0, -1.02], [0.03, -1], [0.1, -0.72], [0.185, -0.3], [0.2, 0.1], [0.2, 0.5], [0.185, 0.74], [0.13, 0.93], [0.06, 1.02], [0, 1.04]], 48), white, [0, 0, 0], [Math.PI / 2, 0, 0]);
  plane.add(body);
  const stripe = mesh(lathe([[0.2005, -0.2], [0.2025, 0.1], [0.2025, 0.5], [0.189, 0.72]], 48), navy, [0, -0.004, 0], [Math.PI / 2, 0, 0]);
  stripe.scale.set(1.004, 1, 0.16);
  plane.add(stripe);
  // Windows and cockpit
  const win = new THREE.InstancedMesh(ball(0.021, 12, 10), glass, 22);
  const o = new THREE.Object3D();
  for (let i = 0; i < 22; i++) {
    const s = i < 11 ? -1 : 1;
    o.position.set(s * 0.188, 0.062, -0.36 + (i % 11) * 0.094);
    o.scale.set(0.5, 1.2, 1);
    o.updateMatrix();
    win.setMatrixAt(i, o.matrix);
  }
  plane.add(win);
  const cockpit = mesh(ball(0.12, 28, 18), glass, [0, 0.085, 0.84]);
  cockpit.scale.set(0.92, 0.52, 0.85);
  plane.add(cockpit);

  const w = wing(0.46, 0.17, 1.02, 0.42);
  for (const s of [-1, 1]) {
    // Wings are drawn flat, then laid down so their leading edge faces the nose.
    const m = mesh(w, white, [s * 0.14, -0.06, 0.3], [Math.PI / 2, 0, 0]);
    m.scale.x = s;
    plane.add(m);
    plane.add(mesh(box(0.028, 0.2, 0.16, 0.012), red, [s * 1.18, 0.03, -0.24], [-0.35, 0, -s * 0.28]));
    const eng = group(
      mesh(lathe([[0.06, -0.2], [0.085, -0.1], [0.095, 0.08], [0.09, 0.16], [0.078, 0.17], [0.07, 0.14]], 32), navy, [0, 0, 0], [Math.PI / 2, 0, 0]),
      mesh(cyl(0.076, 0.076, 0.02, 28), metals.dark(), [0, 0, 0.13], [Math.PI / 2, 0, 0]),
      mesh(ball(0.028, 14, 10), metals.chrome(), [0, 0, 0.145]),
    );
    eng.position.set(s * 0.48, -0.16, 0.24);
    plane.add(eng);
    const tail = mesh(wing(0.24, 0.11, 0.4, 0.17), white, [s * 0.04, 0.03, -0.68], [Math.PI / 2, 0, 0]);
    tail.scale.x = s;
    plane.add(tail);
  }
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(-0.18, 0.5);
  finShape.lineTo(-0.36, 0.5);
  finShape.lineTo(-0.34, 0);
  finShape.closePath();
  plane.add(mesh(extrude(finShape, 0.02, 0.014, 4), red, [0, 0.1, -0.56], [0, -Math.PI / 2, 0]));
  root.add(plane);

  // Clouds
  const cloudMat = mat("#FFFFFF", 1);
  const r = rng(4);
  const clouds = ([[-0.72, -0.62, 0.42, 1], [0.66, -0.74, 0.1, 1.15], [0.05, -0.86, 0.7, 0.8], [0.85, 0.66, -0.7, 0.55], [-0.82, 0.62, -0.6, 0.5]] as const).map(([x, y, z, s]) => {
    const c = group();
    for (let i = 0; i < 6; i++) {
      const b = mesh(ball(0.15 + r() * 0.1, 20, 16), cloudMat, [(i - 2.5) * 0.14, Math.sin(i * 1.2) * 0.05 + r() * 0.05, r() * 0.14]);
      b.scale.y = 0.8;
      b.castShadow = false;
      c.add(b);
    }
    c.position.set(x, y, z);
    c.scale.setScalar(s);
    c.userData.x = x;
    root.add(c);
    return c;
  });

  return {
    root,
    duration: 2.1,
    radius: 1.22,
    view: [0, 0.16, 1],
    update: ({ time, play }) => {
      const roll = easeInOut(span(play, 0, 0.4));
      const away = easeIn(span(play, 0.3, 1));
      plane.position.set(away * 2.4, Math.sin(time * 1.1) * 0.04 + away * 2.6 - roll * 0.1, away * 1.4);
      plane.rotation.set(-0.22 - away * 0.5, -0.82 + roll * 0.2 + away * 1.4, -0.16 + Math.sin(time * 0.8) * 0.04 + roll * -0.1, "YXZ");
      clouds.forEach((c, i) => {
        c.position.x = c.userData.x + Math.sin(time * 0.3 + i * 2) * 0.05 - away * (0.5 + i * 0.1);
      });
    },
  };
}
