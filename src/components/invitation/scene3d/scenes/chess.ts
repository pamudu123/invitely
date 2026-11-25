import * as THREE from "three";
import { ball, box, easeIn, easeInOut, extrude, gloss, group, lathe, mat, mesh, span, V, type BuiltScene } from "../kit";

const base: [number, number][] = [[0, 0], [0.17, 0], [0.175, 0.04], [0.15, 0.075], [0.155, 0.1], [0.11, 0.14]];

function queen(m: THREE.Material) {
  const g = group(
    mesh(lathe([...base, [0.075, 0.28], [0.062, 0.48], [0.11, 0.55], [0.075, 0.58], [0.09, 0.64], [0.135, 0.76], [0.1, 0.775], [0.05, 0.81], [0, 0.82]]), m),
    mesh(ball(0.04, 20, 14), m, [0, 0.85, 0]),
  );
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.add(mesh(ball(0.024, 12, 10), m, [Math.cos(a) * 0.125, 0.775, Math.sin(a) * 0.125]));
  }
  return g;
}

function king(m: THREE.Material) {
  return group(
    mesh(lathe([...base, [0.08, 0.3], [0.066, 0.52], [0.115, 0.59], [0.08, 0.62], [0.09, 0.68], [0.125, 0.8], [0.11, 0.82], [0.04, 0.87], [0, 0.875]]), m),
    mesh(box(0.035, 0.15, 0.035, 0.008), m, [0, 0.95, 0]),
    mesh(box(0.1, 0.035, 0.035, 0.008), m, [0, 0.96, 0]),
  );
}

function bishop(m: THREE.Material) {
  return group(
    mesh(lathe([...base, [0.07, 0.24], [0.055, 0.4], [0.1, 0.46], [0.06, 0.49], [0.095, 0.56], [0.07, 0.65], [0, 0.71]]), m),
    mesh(ball(0.028, 14, 10), m, [0, 0.72, 0]),
  );
}

function pawn(m: THREE.Material) {
  return group(
    mesh(lathe([[0, 0], [0.14, 0], [0.145, 0.035], [0.12, 0.07], [0.07, 0.15], [0.055, 0.26], [0.09, 0.3], [0.05, 0.33], [0, 0.34]]), m),
    mesh(ball(0.085, 28, 20), m, [0, 0.38, 0]),
  );
}

function rook(m: THREE.Material) {
  const g = group(mesh(lathe([...base, [0.095, 0.24], [0.085, 0.4], [0.12, 0.44], [0.125, 0.5], [0.1, 0.5], [0, 0.49]]), m));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(mesh(box(0.05, 0.07, 0.075, 0.01), m, [Math.cos(a) * 0.1, 0.52, Math.sin(a) * 0.1], [0, -a, 0]));
  }
  return g;
}

function knight(m: THREE.Material) {
  const s = new THREE.Shape();
  s.moveTo(-0.11, 0);
  s.bezierCurveTo(-0.16, 0.16, -0.15, 0.36, -0.05, 0.46);
  s.lineTo(-0.035, 0.53);
  s.lineTo(0.015, 0.47);
  s.bezierCurveTo(0.08, 0.45, 0.13, 0.37, 0.19, 0.29);
  s.bezierCurveTo(0.21, 0.25, 0.18, 0.21, 0.14, 0.21);
  s.bezierCurveTo(0.1, 0.25, 0.06, 0.26, 0.02, 0.24);
  s.bezierCurveTo(0.06, 0.16, 0.12, 0.1, 0.11, 0);
  s.closePath();
  return group(
    mesh(lathe([[0, 0], [0.17, 0], [0.175, 0.04], [0.15, 0.075], [0.155, 0.1], [0.12, 0.13], [0, 0.135]]), m),
    mesh(extrude(s, 0.09, 0.025), m, [0, 0.12, 0]),
  );
}

export function build(): BuiltScene {
  const ivory = gloss("#EFE0C2", 0.3);
  const ebony = gloss("#1B1718", 0.22);
  const light = mat("#E3C79A", 0.45);
  const dark = mat("#6B3D22", 0.45);
  const root = group();
  const board = group(mesh(box(2.24, 0.14, 2.24, 0.04), gloss("#2E1A10", 0.35), [0, -0.085, 0]));
  for (let x = 0; x < 5; x++)
    for (let z = 0; z < 5; z++)
      board.add(mesh(new THREE.BoxGeometry(0.4, 0.03, 0.4), (x + z) % 2 ? dark : light, [(x - 2) * 0.4, -0.015, (z - 2) * 0.4]));
  root.add(board);

  const put = (p: THREE.Group, x: number, z: number, turn = 0) => {
    p.position.set(x * 0.4, 0, z * 0.4);
    p.rotation.y = turn;
    root.add(p);
    return p;
  };
  put(king(ivory), -2, 0);
  put(pawn(ivory), -1, 2);
  put(pawn(ivory), 0, 2);
  put(knight(ivory), 2, 2, 0.5);
  put(rook(ivory), -2, -2);
  put(pawn(ebony), 2, 0);
  put(pawn(ebony), 1, -2);
  put(bishop(ebony), 0, -2);
  put(rook(ebony), 2, -2);
  const q = put(queen(ivory), -1, 1);
  const k = put(king(ebony), 1, -1);

  const d = V(1, 0, -1).normalize();
  const axis = V(0, 1, 0).cross(d).normalize();
  const from = V(-0.4, 0, 0.4);
  const to = V(0.4, 0, -0.4);

  return {
    root,
    duration: 1.9,
    radius: 1.32,
    view: [0.18, 0.62, 1],
    look: [0, 0.26, 0],
    floor: -0.156,
    update: ({ play }) => {
      const t = easeInOut(span(play, 0.05, 0.55));
      q.position.copy(from).lerp(to, t * 0.94);
      q.position.y = Math.sin(t * Math.PI) * 0.3;
      const f = span(play, 0.46, 0.8);
      const fall = easeIn(f) * 1.5 + Math.sin(span(play, 0.8, 1) * Math.PI * 2) * 0.05 * (1 - span(play, 0.8, 1));
      k.quaternion.setFromAxisAngle(axis, fall);
      k.position.copy(to).addScaledVector(d, f * 0.2);
      k.position.y = Math.sin(Math.min(fall, 1.57)) * 0.16;
    },
  };
}
