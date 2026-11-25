import * as THREE from "three";
import { ball, box, easeIn, easeOut, extrude, gloss, group, lerp, mat, mesh, span, torus, TAU, type BuiltScene } from "../kit";

function blade(r: number) {
  const s = new THREE.Shape();
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + 0.5 + (i / n) * (TAU - 1);
    s[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r * 1.05);
  }
  s.closePath();
  return s;
}

function bat(face: string) {
  const g = group();
  g.add(mesh(extrude(blade(0.62), 0.06, 0.012), gloss("#D9A868", 0.4)));
  g.add(mesh(extrude(blade(0.605), 0.03, 0.008), mat(face, 0.55), [0, 0, 0.055]));
  g.add(mesh(extrude(blade(0.605), 0.03, 0.008), mat("#17181B", 0.6), [0, 0, -0.055]));
  g.add(mesh(box(0.5, 0.13, 0.16, 0.06), gloss("#C68F4E", 0.4), [0, -0.6, 0]));
  g.add(mesh(box(0.19, 0.74, 0.17, 0.07), gloss("#C68F4E", 0.35), [0, -0.98, 0]));
  g.add(mesh(box(0.195, 0.4, 0.05, 0.02), mat("#8C2230", 0.5), [0, -0.94, 0.072]));
  return g;
}

export function build(): BuiltScene {
  const root = group();
  const front = bat("#D4242F");
  const back = bat("#1E57C9");
  root.add(front, back);
  const b = group(
    mesh(ball(0.19, 40, 28), gloss("#FF8A1F", 0.35)),
    mesh(torus(0.19, 0.004, TAU, 80), mat("#D96C0C", 0.5), [0, 0, 0], [0.5, 0.3, 0]),
  );
  root.add(b);

  return {
    root,
    duration: 1.8,
    radius: 1.28,
    view: [0, 0.14, 1],
    look: [0, -0.08, 0],
    update: ({ time, play }) => {
      // Two taps between the bats, then straight at the guest.
      const a = span(play, 0.05, 0.3);
      const c = span(play, 0.3, 0.55);
      const fly = span(play, 0.57, 0.9);
      const hop = Math.sin(a * Math.PI) * 0.5 + Math.sin(c * Math.PI) * 0.7;
      const x = a < 1 ? lerp(-0.5, 0.55, a) : lerp(0.55, -0.42, c);
      b.position.set(
        x + fly * 0.3,
        lerp(-0.42, 0.1, easeOut(a)) + hop + (play === 0 ? Math.abs(Math.sin(time * 1.6)) * 0.12 : 0),
        lerp(0.5, 7.4, easeIn(fly) * 0.5 + fly * 0.5),
      );
      b.rotation.set(time, time * 1.4 + play * 10, 0);
      b.visible = fly < 1;
      const hitR = Math.sin(span(play, 0.22, 0.36) * Math.PI);
      const hitL = Math.sin(span(play, 0.48, 0.66) * Math.PI);
      back.position.set(0.36, 0.22, -0.22 + hitR * 0.2);
      back.rotation.set(0.1 - hitR * 0.5, -0.5 - hitR * 0.3, 0.5 - hitR * 0.25);
      front.position.set(-0.32, 0.2, 0.08 + hitL * 0.25);
      front.rotation.set(0.05 + hitL * 0.5, 0.42 + hitL * 0.2, -0.48 + hitL * 0.3);
    },
  };
}
