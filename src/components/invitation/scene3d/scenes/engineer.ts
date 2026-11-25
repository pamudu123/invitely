import * as THREE from "three";
import { cyl, easeInOut, extrude, group, lerp, mat, mesh, metals, span, TAU, type BuiltScene } from "../kit";

/** Gear outline. All gears share one tooth size, so they mesh. */
function gear(teeth: number, hub: number, spokes: number) {
  const pitch = teeth * 0.052;
  const out = pitch + 0.055;
  const inn = pitch - 0.06;
  const s = new THREE.Shape();
  const step = TAU / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pt = (r: number, k: number) => [Math.cos(a + k * step) * r, Math.sin(a + k * step) * r] as const;
    if (i === 0) s.moveTo(...pt(inn, -0.3));
    else s.lineTo(...pt(inn, -0.3));
    s.lineTo(...pt(out, -0.14));
    s.lineTo(...pt(out, 0.14));
    s.lineTo(...pt(inn, 0.3));
  }
  s.closePath();
  const holeShape = (x: number, y: number, r: number) => {
    const h = new THREE.Path();
    h.absarc(x, y, r, 0, TAU, true);
    s.holes.push(h);
  };
  holeShape(0, 0, hub * 0.5);
  const mid = (hub + inn) / 2;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU;
    holeShape(Math.cos(a) * mid, Math.sin(a) * mid, Math.min((inn - hub) * 0.4, (mid * Math.PI) / spokes - 0.035));
  }
  return { geo: extrude(s, 0.2, 0.018, 18), pitch };
}

export function build(): BuiltScene {
  const root = group();
  const make = (teeth: number, hub: number, spokes: number, m: THREE.Material) => {
    const { geo, pitch } = gear(teeth, hub, spokes);
    const g = group(
      mesh(geo, m),
      mesh(cyl(hub * 0.5, hub * 0.5, 0.42, 32), metals.chrome(), [0, 0, 0], [Math.PI / 2, 0, 0]),
      mesh(new THREE.TorusGeometry(hub * 0.72, 0.03, 12, 48), m, [0, 0, 0.12]),
    );
    const bolt = mesh(cyl(hub * 0.3, hub * 0.3, 0.06, 6), metals.dark(), [0, 0, 0.23], [Math.PI / 2, 0, 0]);
    g.add(bolt);
    root.add(g);
    return { g, pitch, teeth };
  };
  const a = make(16, 0.28, 6, mat("#D7DCE2", 0.26, 1));
  const b = make(10, 0.2, 5, metals.brass());
  const c = make(8, 0.17, 4, mat("#2F333A", 0.32, 0.9));

  const at = (from: { x: number; y: number; pitch: number }, pitch: number, angle: number) => ({
    x: from.x + Math.cos(angle) * (from.pitch + pitch),
    y: from.y + Math.sin(angle) * (from.pitch + pitch),
    pitch,
  });
  const pa = { x: -0.3, y: 0.24, pitch: a.pitch };
  const angB = -0.62;
  const pb = at(pa, b.pitch, angB);
  const angC = -2.25;
  const pc = at(pa, c.pitch, angC);

  // Turned so a tooth of one meets a gap of the other.
  const phase = (angle: number, teeth: number) => {
    const ratio = a.teeth / teeth;
    return (t: number) => angle + Math.PI + Math.PI / teeth + (angle - t) * ratio;
  };
  const phB = phase(angB, b.teeth);
  const phC = phase(angC, c.teeth);

  let turn = 0;
  let lastT = 0;
  return {
    root,
    duration: 2.2,
    radius: 1.34,
    view: [0.5, 0.14, 1],
    look: [0, -0.1, 0],
    turn: "full",
    update: ({ time, play, scroll }) => {
      const dt = Math.min(0.1, Math.max(0, time - lastT));
      lastT = time;
      const meshIn = easeInOut(span(play, 0, 0.5));
      const boost = span(play, 0.5, 0.65) * (1 - span(play, 0.8, 1));
      turn += dt * (0.35 * span(play, 0.5, 0.6) + boost * 2.6);
      const gap = (1 - meshIn) + scroll * 0.7;
      a.g.position.set(pa.x, pa.y, gap * -0.5);
      a.g.rotation.z = turn;
      b.g.position.set(pb.x + gap * 0.04, pb.y, gap * 0.4);
      b.g.rotation.z = phB(turn);
      c.g.position.set(pc.x - gap * 0.04, pc.y - gap * 0.06, gap * 0.3);
      c.g.rotation.z = phC(turn);
      root.rotation.y = lerp(0.5, 0, meshIn);
    },
  };
}
