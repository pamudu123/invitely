import { box, canvasTexture, cyl, easeInOut, easeOut, gloss, group, lathe, lerp, mat, mesh, metals, span, TAU, torus, tube, V, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const floor = -0.36;
  const wood = gloss("#7B4426", 0.35);

  root.add(mesh(box(2.3, 0.26, 1.8, 0.08), wood, [0, floor + 0.2, 0]));
  root.add(mesh(box(2.2, 0.04, 1.7, 0.03), gloss("#16151A", 0.3), [0, floor + 0.335, 0]));
  for (const x of [-0.95, 0.95]) for (const z of [-0.7, 0.7]) root.add(mesh(cyl(0.12, 0.1, 0.1, 24), metals.dark(), [x, floor + 0.04, z]));
  const cx = -0.28;
  const top = floor + 0.36;
  root.add(mesh(cyl(0.8, 0.8, 0.06, 80), metals.steel(), [cx, top + 0.02, 0]));

  // Record
  const grooves = canvasTexture(512, 512, (ctx, w) => {
    ctx.fillStyle = "#101013";
    ctx.fillRect(0, 0, w, w);
    for (let r = 90; r < 250; r += 2) {
      ctx.strokeStyle = r % 34 < 4 ? "rgba(0,0,0,0.9)" : `rgba(255,255,255,${0.04 + (r % 6) * 0.018})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, w / 2, r, 0, TAU);
      ctx.stroke();
    }
    ctx.fillStyle = "#FF6F91";
    ctx.beginPath();
    ctx.arc(w / 2, w / 2, 86, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#FFD166";
    ctx.beginPath();
    ctx.arc(w / 2, w / 2, 86, -0.5, 1.1);
    ctx.lineTo(w / 2, w / 2);
    ctx.fill();
    ctx.fillStyle = "#3D0A2B";
    ctx.fillRect(w / 2 - 56, w / 2 - 46, 70, 7);
    ctx.fillRect(w / 2 - 56, w / 2 - 34, 46, 5);
    ctx.beginPath();
    ctx.arc(w / 2, w / 2, 9, 0, TAU);
    ctx.fill();
  });
  const face = mat("#FFFFFF", 0.34, 0.1, { map: grooves });
  const edge = gloss("#0E0E11", 0.2);
  const disc = mesh(cyl(0.77, 0.77, 0.025, 96), [edge, face, face]);
  const record = group(disc);
  root.add(record);
  root.add(mesh(cyl(0.018, 0.018, 0.16, 14), metals.chrome(), [cx, top + 0.1, 0]));

  // Tone arm
  const chrome = metals.chrome();
  const base = V(0.82, top, -0.58);
  root.add(mesh(lathe([[0, 0], [0.18, 0], [0.18, 0.04], [0.1, 0.06], [0.09, 0.2], [0, 0.22]], 40, false), metals.dark(), [base.x, base.y, base.z]));
  const arm = group(
    mesh(tube([V(0, 0, -0.2), V(0, 0, 0.1), V(0, 0, 0.7), V(-0.03, -0.01, 0.88), V(-0.1, -0.03, 1)], 0.024, false, 60), chrome),
    mesh(cyl(0.075, 0.075, 0.14, 28), metals.dark(), [0, 0, -0.22], [Math.PI / 2, 0, 0]),
    mesh(box(0.09, 0.05, 0.16, 0.015), gloss("#FF6F91", 0.3), [-0.13, -0.05, 1.06], [0.12, 0.35, 0]),
  );
  arm.position.set(base.x, base.y + 0.2, base.z);
  root.add(arm);

  // Controls
  root.add(mesh(cyl(0.09, 0.1, 0.06, 32), chrome, [0.92, top + 0.03, 0.6]), mesh(cyl(0.05, 0.05, 0.04, 24), gloss("#FF6F91", 0.3), [0.68, top + 0.02, 0.68]));
  root.add(mesh(box(0.05, 0.02, 0.4, 0.01), metals.dark(), [0.96, top, 0.14]), mesh(box(0.1, 0.05, 0.06, 0.015), chrome, [0.96, top + 0.02, 0.1]));

  // Sound, drawn as rings lifting off the record
  const rings = [0, 1, 2].map(() => {
    const m = mesh(torus(0.5, 0.012, TAU, 80), mat("#FFD166", 0.4, 0, { transparent: true, opacity: 0, emissive: "#FF6F91", emissiveIntensity: 0.4 }), [cx, top, 0], [Math.PI / 2, 0, 0]);
    m.castShadow = m.receiveShadow = false;
    root.add(m);
    return m;
  });

  let spin = 0;
  let lastT = 0;
  return {
    root,
    duration: 2.3,
    radius: 1.3,
    view: [0.1, 0.78, 1],
    look: [0, 0.06, 0],
    floor,
    update: ({ time, play, scroll }) => {
      const land = easeInOut(span(play, 0.02, 0.45));
      record.position.set(lerp(cx - 0.3, cx, land), top + 0.065 + (1 - land) * 0.85 + scroll * 0.5, lerp(0.1, 0, land));
      record.rotation.set((1 - land) * 0.85, 0, (1 - land) * 0.25);
      const dt = Math.min(0.1, Math.max(0, time - lastT));
      lastT = time;
      spin += dt * 3.4 * span(play, 0.5, 0.75);
      disc.rotation.y = -spin;
      const drop = easeOut(span(play, 0.5, 0.85));
      arm.rotation.set(-0.05 * (1 - drop) + 0.03 * drop, lerp(0.02, -0.62, drop), 0);
      rings.forEach((r, i) => {
        const k = (time * 0.45 + i / 3) % 1;
        const on = span(play, 0.8, 1);
        r.position.y = top + 0.1 + k * 0.75;
        r.scale.setScalar(0.8 + k * 0.7);
        r.material.opacity = on * Math.sin(k * Math.PI) * 0.7;
        r.visible = on > 0;
      });
    },
  };
}
