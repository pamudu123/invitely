import * as THREE from "three";
import { ball, cyl, easeInOut, easeOut, gloss, group, lerp, mesh, paintSphere, rod, span, V, type BuiltScene } from "../kit";

/** The 32 panel directions of the classic stitched ball: 12 pentagons, 20 hexagons. */
function panels() {
  const p = (1 + Math.sqrt(5)) / 2;
  const pent: THREE.Vector3[] = [];
  for (const a of [-1, 1]) for (const b of [-p, p]) pent.push(V(0, a, b), V(a, b, 0), V(b, 0, a));
  pent.forEach((v) => v.normalize());
  const hex: THREE.Vector3[] = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++)
      for (let k = j + 1; k < 12; k++)
        if (pent[i].dot(pent[j]) > 0.4 && pent[j].dot(pent[k]) > 0.4 && pent[i].dot(pent[k]) > 0.4)
          hex.push(pent[i].clone().add(pent[j]).add(pent[k]).normalize());
  return { pent, hex };
}

export function build(): BuiltScene {
  const root = group();
  const floor = -0.82;
  const white = gloss("#FFFFFF", 0.3);

  // Goal
  const W = 1.12;
  const H = 1.3;
  const z0 = -0.5;
  const top = floor + H;
  root.add(mesh(cyl(0.05, 0.05, H, 24), white, [-W, floor + H / 2, z0]), mesh(cyl(0.05, 0.05, H, 24), white, [W, floor + H / 2, z0]));
  root.add(rod(V(-W - 0.05, top, z0), V(W + 0.05, top, z0), 0.05, white, 24));
  for (const s of [-1, 1]) {
    root.add(rod(V(s * W, top, z0), V(s * W, top, z0 - 0.25), 0.018, white));
    root.add(rod(V(s * W, top, z0 - 0.25), V(s * W, floor, z0 - 0.7), 0.018, white));
  }

  // Net, moved by the ball
  const nx = 28;
  const ny = 18;
  const pos = new Float32Array((nx + 1) * (ny + 1) * 3);
  const idx: number[] = [];
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++) {
      const k = j * (nx + 1) + i;
      if (i < nx) idx.push(k, k + 1);
      if (j < ny) idx.push(k, k + nx + 1);
    }
  const geo = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(pos, 3);
  geo.setAttribute("position", attr);
  geo.setIndex(idx);
  const net = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.62 }));
  net.frustumCulled = false;
  root.add(net);
  const shapeNet = (bulge: number, bx: number, by: number) => {
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++) {
        const u = (i / nx) * 2 - 1;
        const v = j / ny;
        const x = u * W;
        const y = top - v * H;
        const sag = Math.sin(v * Math.PI) * 0.1 * (1 - u * u);
        const d2 = (x - bx) ** 2 + (y - by) ** 2;
        pos.set([x, y, z0 - 0.25 - v * 0.45 - sag - bulge * Math.exp(-d2 * 7)], (j * (nx + 1) + i) * 3);
      }
    attr.needsUpdate = true;
  };

  const { pent, hex } = panels();
  // Plane distances of the two panel kinds, so the edges meet where they should.
  const dp = 0.9393;
  const dh = 0.9149;
  const skin = paintSphere(640, 320, (x, y, z) => {
    let a = -2;
    let b = -2;
    let dark = false;
    for (const v of pent) {
      const d = (v.x * x + v.y * y + v.z * z) / dp;
      if (d > a) {
        b = a;
        a = d;
        dark = true;
      } else if (d > b) b = d;
    }
    for (const v of hex) {
      const d = (v.x * x + v.y * y + v.z * z) / dh;
      if (d > a) {
        b = a;
        a = d;
        dark = false;
      } else if (d > b) b = d;
    }
    const edge = a - b;
    if (edge < 0.008) return ["#8A8A88", 0];
    return [dark ? "#15161A" : "#FAFAF7", Math.min(1, 0.4 + edge * 9)];
  });
  const b = mesh(ball(0.4, 64, 48), gloss("#FFFFFF", 0.36, { map: skin.map, bumpMap: skin.bumpMap, bumpScale: 2, clearcoat: 0.5 }));
  root.add(b);

  return {
    root,
    duration: 1.7,
    radius: 1.22,
    view: [0.12, 0.2, 1],
    look: [0, -0.12, 0],
    floor,
    update: ({ time, play }) => {
      const fly = span(play, 0.08, 0.52);
      const e = fly * 0.8 + easeInOut(fly) * 0.2;
      const drop = span(play, 0.58, 1);
      // Bends out, then into the top corner
      b.position.set(
        lerp(-0.12, 0.66, e) - Math.sin(e * Math.PI) * 0.55,
        lerp(floor + 0.4, 0.22, easeOut(e)) - drop * drop * 0.62,
        lerp(0.55, z0 - 0.42, e),
      );
      const k = lerp(1, 0.62, e);
      b.scale.setScalar(k);
      b.rotation.set(0.5 - play * 10, 0.3 + time * (play ? 0 : 0.35) + play * 12, 0.2);
      const hit = span(play, 0.48, 0.58) * (1 - span(play, 0.58, 1));
      shapeNet(hit * 0.34 + Math.sin(span(play, 0.58, 1) * 18) * 0.05 * (1 - span(play, 0.58, 1)) * (play > 0.58 ? 1 : 0), 0.66, 0.22);
    },
  };
}
