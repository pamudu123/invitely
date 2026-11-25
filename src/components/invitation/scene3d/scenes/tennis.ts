import * as THREE from "three";
import { ball, clamp, cyl, easeIn, easeInOut, easeOut, gloss, group, lerp, mat, mesh, paintSphere, rng, rods, span, TAU, tube, V, type BuiltScene } from "../kit";

export function racket(opts: { rx: number; ry: number; frame: THREE.Material; accent: THREE.Material; strings: THREE.Material; grip: THREE.Material; gap: number; tube: number; shaft: number; handle: number; handleR: number; open: boolean }) {
  const g = group();
  const { rx, ry } = opts;
  const loop = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * TAU;
    return V(Math.cos(a) * rx, Math.sin(a) * ry, 0);
  });
  g.add(mesh(tube(loop, opts.tube, true, 120), opts.frame));
  const arc = loop.slice(4, 17);
  g.add(mesh(tube(arc.map((p) => p.clone().multiplyScalar(1.004)), opts.tube * 1.06, false, 60), opts.accent));
  const pairs: [THREE.Vector3, THREE.Vector3][] = [];
  for (let x = -rx + opts.gap * 0.7; x < rx; x += opts.gap) {
    const y = ry * Math.sqrt(1 - (x / rx) ** 2);
    pairs.push([V(x, -y, 0.004), V(x, y, 0.004)]);
  }
  for (let y = -ry + opts.gap * 0.7; y < ry; y += opts.gap) {
    const x = rx * Math.sqrt(1 - (y / ry) ** 2);
    pairs.push([V(-x, y, -0.004), V(x, y, -0.004)]);
  }
  g.add(rods(pairs, 0.005, opts.strings));
  const end = -ry - opts.shaft;
  if (opts.open) {
    for (const s of [-1, 1])
      g.add(mesh(tube([V(s * rx * 0.72, -ry * 0.72, 0), V(s * rx * 0.36, -ry * 1.08, 0), V(s * 0.05, end * 0.96, 0), V(s * 0.03, end - 0.06, 0)], opts.tube * 0.95), opts.frame));
  } else {
    g.add(mesh(cyl(opts.handleR * 0.4, opts.handleR * 0.4, opts.shaft, 16), opts.frame, [0, -ry - opts.shaft / 2, 0]));
  }
  g.add(mesh(cyl(opts.handleR, opts.handleR * 1.06, opts.handle, 8), opts.grip, [0, end - opts.handle / 2, 0]));
  g.add(mesh(cyl(opts.handleR * 1.2, opts.handleR * 1.25, 0.05, 8), opts.accent, [0, end - opts.handle, 0]));
  return g;
}

/** Curve that runs round a tennis ball, on a unit sphere */
const seamPoint = (t: number) => V(0.75 * Math.cos(t) + 0.25 * Math.cos(3 * t), 0.75 * Math.sin(t) - 0.25 * Math.sin(3 * t), 0.866 * Math.sin(2 * t));

export function build(): BuiltScene {
  const root = group();
  const bat = racket({
    rx: 0.48, ry: 0.6, gap: 0.075, tube: 0.038, shaft: 0.34, handle: 0.56, handleR: 0.058, open: true,
    frame: gloss("#14171C", 0.25), accent: gloss("#FF4B2B", 0.3), strings: mat("#F4F2E8", 0.5), grip: mat("#F2EFE8", 0.75),
  });
  bat.position.y = 1.5;
  const arm = group(bat);
  root.add(arm);

  const noise = rng(7);
  const felt = paintSphere(256, 128, () => [noise() > 0.5 ? "#D3EA3C" : "#C6DF2E", noise()]);
  const seam = Array.from({ length: 64 }, (_, i) => seamPoint((i / 64) * TAU).multiplyScalar(0.996));
  const b = group(
    mesh(ball(1, 48, 32), mat("#FFFFFF", 0.95, 0, { map: felt.map, bumpMap: felt.bumpMap, bumpScale: 2 })),
    mesh(tube(seam, 0.032, true, 200), mat("#F3F4EA", 0.8)),
  );
  b.scale.setScalar(0.3);
  root.add(b);

  return {
    root,
    duration: 1.7,
    radius: 1.16,
    view: [0, 0.12, 1],
    look: [0, 0, 0],
    update: ({ time, play }) => {
      const wind = easeInOut(span(play, 0, 0.36));
      const swing = easeIn(span(play, 0.38, 0.54));
      const follow = easeOut(span(play, 0.54, 0.9));
      arm.position.set(0.02 + wind * 0.1, -1.12, 0);
      arm.rotation.set(-wind * 0.55 + swing * 1.1 + follow * 0.3, -0.5 + swing * 0.35, -0.3 - wind * 0.4 + swing * 0.75 + follow * 0.5);
      // Toss, then off the strings and past the camera.
      const toss = span(play, 0, 0.5);
      const fly = span(play, 0.52, 0.86);
      const up = Math.sin(clamp(toss) * Math.PI * 0.62);
      b.position.set(
        lerp(lerp(-0.34, 0.08, toss), -0.5, fly),
        lerp(-0.46, 0.66, up) + (toss === 0 ? Math.sin(time * 1.5) * 0.03 : 0) - fly * 0.4,
        lerp(lerp(0.4, 0.3, toss), 7.6, easeIn(fly) * 0.5 + fly * 0.5),
      );
      b.visible = fly < 1;
      b.rotation.set(time * 0.5 + play * 9, time * 0.7, 0.4);
    },
  };
}
