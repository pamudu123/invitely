import { ball, cyl, easeInOut, easeOut, gloss, group, lathe, lerp, mat, mesh, paintSphere, rod, span, V, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const floor = -0.95;
  const white = gloss("#FFFFFF", 0.3);

  // Posts with padded bases
  const z = -0.45;
  const w = 0.62;
  const pad = mat("#D92B3A", 0.6);
  for (const s of [-1, 1]) {
    root.add(mesh(cyl(0.044, 0.054, 1.95, 20), white, [s * w, floor + 0.975, z]));
    root.add(mesh(lathe([[0, 0], [0.13, 0], [0.14, 0.04], [0.14, 0.42], [0.13, 0.46], [0.04, 0.47]], 28, false), pad, [s * w, floor, z]));
  }
  root.add(rod(V(-w, floor + 0.82, z), V(w, floor + 0.82, z), 0.044, white, 20));

  const skin = paintSphere(512, 256, (x, y, z2) => {
    const grain = Math.sin(x * 90) * Math.sin(y * 90) * Math.sin(z2 * 90) * 0.4;
    if (Math.abs(x) < 0.012 || Math.abs(z2) < 0.012) return ["#C9CDD6", 0];
    const d = Math.abs(y);
    if (d > 0.86) return ["#F2B632", 0.5 + grain];
    if (d > 0.72) return ["#14327A", 0.5 + grain];
    if (d < 0.1) return ["#D92B3A", 0.5 + grain];
    return ["#FBFBF8", 0.5 + grain];
  });
  const shell = mesh(ball(0.31, 56, 40), mat("#FFFFFF", 0.5, 0, { map: skin.map, bumpMap: skin.bumpMap, bumpScale: 1.2 }));
  shell.scale.set(1, 1.5, 1);
  const b = group(shell);
  root.add(b);
  root.add(mesh(lathe([[0.16, 0], [0.18, 0.02], [0.1, 0.1], [0.13, 0.17], [0.1, 0.16], [0, 0.09]], 32), gloss("#F2B632", 0.4), [-0.1, floor, 0.55]));

  return {
    root,
    duration: 2,
    radius: 1.2,
    view: [0.16, 0.14, 1],
    look: [0, 0.02, 0],
    floor,
    update: ({ time, play }) => {
      const fly = span(play, 0.1, 0.85);
      const e = lerp(fly, easeInOut(fly), 0.4);
      const dip = Math.sin(span(play, 0, 0.1) * Math.PI) * 0.06;
      b.position.set(
        lerp(-0.1, 0.04, e) + Math.sin(e * Math.PI) * 0.1,
        lerp(floor + 0.54, 0.34, easeOut(e)) + Math.sin(e * Math.PI) * 0.62 - dip,
        lerp(0.55, -3.6, e),
      );
      b.rotation.set(0.12 - e * 15, time * (fly ? 0 : 0.2), 0.16 * (1 - e));
    },
  };
}
