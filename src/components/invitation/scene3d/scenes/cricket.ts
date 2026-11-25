import * as THREE from "three";
import { ball, box, cyl, easeIn, easeOut, gloss, group, lathe, lerp, mat, mesh, paintSphere, span, TAU, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const wood = gloss("#E5BE84", 0.38);
  const floor = -0.8;

  // Pitch with its crease
  root.add(mesh(box(1.5, 0.08, 2, 0.03), mat("#C9A873", 0.9), [0, floor - 0.04, 0.1]));
  const chalk = mat("#FFFFFF", 0.9);
  root.add(mesh(new THREE.BoxGeometry(1.36, 0.012, 0.035), chalk, [0, floor + 0.004, 0.42]));
  root.add(mesh(new THREE.BoxGeometry(1.1, 0.012, 0.035), chalk, [0, floor + 0.004, -0.4]));
  for (const x of [-0.55, 0.55]) root.add(mesh(new THREE.BoxGeometry(0.035, 0.012, 0.82), chalk, [x, floor + 0.004, 0.02]));

  const stumps = [-0.24, 0, 0.24].map((x) => {
    const g = group(
      mesh(lathe([[0, 0], [0.04, 0.05], [0.052, 0.14], [0.052, 1.3], [0.042, 1.36], [0, 1.37]], 24, false), wood),
      mesh(cyl(0.054, 0.054, 0.04, 24), mat("#B8322A", 0.5), [0, 1.14, 0]),
      mesh(cyl(0.054, 0.054, 0.04, 24), mat("#20438C", 0.5), [0, 1.06, 0]),
    );
    g.position.set(x, floor - 0.02, -0.4);
    root.add(g);
    return g;
  });
  const bails = [-0.12, 0.12].map((x) => {
    const b = mesh(lathe([[0, -0.15], [0.016, -0.145], [0.016, -0.1], [0.026, -0.08], [0.028, 0.08], [0.016, 0.1], [0.016, 0.145], [0, 0.15]], 16, false), gloss("#B8322A", 0.35));
    root.add(b);
    return { b, x };
  });

  // Leather ball with a raised, stitched seam
  const skin = paintSphere(512, 256, (x, y, z) => {
    const a = Math.atan2(z, x);
    const d = Math.abs(y);
    if (d < 0.02) return ["#E9D9B8", 1];
    const dash = Math.sin(a * 46) > -0.1;
    if (d > 0.04 && d < 0.066 && dash) return ["#F2E6CE", 0.9];
    if (d > 0.09 && d < 0.112 && dash) return ["#F2E6CE", 0.85];
    if (d < 0.13) return ["#9E1418", 0.6];
    if (Math.abs(z) < 0.006) return ["#6E0A0E", 0.2];
    return ["#A9161B", 0.5];
  });
  const cherry = mesh(ball(0.3, 64, 48), gloss("#FFFFFF", 0.3, { map: skin.map, bumpMap: skin.bumpMap, bumpScale: 1.4, clearcoat: 1, clearcoatRoughness: 0.15 }));
  const spinner = group(cherry);
  cherry.rotation.z = 1.15;
  root.add(spinner);

  return {
    root,
    duration: 1.8,
    radius: 1.12,
    view: [0.22, 0.26, 1],
    look: [0, -0.1, 0],
    floor: floor - 0.085,
    update: ({ time, play }) => {
      // A short run up towards the camera, then the delivery.
      const back = easeOut(span(play, 0, 0.18));
      const fly = span(play, 0.2, 0.46);
      const after = span(play, 0.46, 1);
      const bounce = fly < 0.55 ? 1 - (fly / 0.55) ** 2 : Math.sin(((fly - 0.55) / 0.45) * 1.6) * 0.5;
      spinner.position.set(
        lerp(lerp(-0.34, -0.5, back), 0, fly) + after * 0.35,
        lerp(lerp(-0.36, 0.5, back), lerp(floor + 0.3, 0.7, Math.max(0, bounce)), fly > 0 ? 1 : 0) + (fly === 0 ? Math.sin(time * 1.4) * 0.03 * (1 - back) : 0),
        lerp(lerp(0.6, 1.5, back), -0.22, easeIn(fly) * 0.4 + fly * 0.6) + easeOut(after) * 0.4,
      );
      if (after > 0) spinner.position.y = lerp(spinner.position.y, floor + 0.3, easeIn(after));
      spinner.rotation.y = 0.5 + Math.sin(time * 0.7) * 0.35;
      spinner.rotation.x = -play * 14;

      const hit = easeOut(span(play, 0.45, 0.85));
      stumps[1].rotation.x = -hit * 1.05;
      stumps[1].position.z = -0.4 - hit * 0.5;
      stumps[0].rotation.set(-hit * 0.22, 0, hit * 0.2);
      stumps[2].rotation.set(-hit * 0.14, 0, -hit * 0.16);
      const f = span(play, 0.45, 1);
      bails.forEach(({ b, x }, i) => {
        const s = i ? 1 : -1;
        b.position.set(x + s * f * 0.75, 0.585 + f * 2 - f * f * 2.6, -0.4 + f * (i ? 0.5 : -0.2));
        b.rotation.set(f * 9 * s, f * 5, Math.PI / 2 + f * TAU * s * 1.4);
      });
    },
  };
}
