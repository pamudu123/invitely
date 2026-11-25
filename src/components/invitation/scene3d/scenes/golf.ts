import * as THREE from "three";
import { ball, canvasTexture, cyl, easeIn, gloss, group, lathe, lerp, mat, mesh, rng, span, TAU, V, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const r = rng(11);
  const turf = canvasTexture(512, 512, (ctx, w, h) => {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "#63B049" : "#56A23E";
      ctx.fillRect((i / 8) * w, 0, w / 8 + 1, h);
    }
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = r() > 0.5 ? "rgba(255,255,190,0.10)" : "rgba(10,60,10,0.10)";
      ctx.fillRect(r() * w, r() * h, 2, 3);
    }
  });
  // The green sits on a cut piece of ground.
  root.add(mesh(lathe([[0, -0.34], [0.86, -0.3], [1.1, -0.16], [1.2, -0.02], [1.18, 0.005], [0, 0.005]], 72, false), mat("#7A5230", 0.95)));
  root.add(mesh(lathe([[1.205, -0.06], [1.2, 0.012], [1.1, 0.016]], 72, false), mat("#3E7F2E", 0.9)));
  const top = mesh(new THREE.CircleGeometry(1.14, 72), mat("#FFFFFF", 0.9, 0, { map: turf }), [0, 0.018, 0], [-Math.PI / 2, 0, 0]);
  top.castShadow = false;
  root.add(top);

  // Bunker
  const sand = mesh(new THREE.CircleGeometry(0.3, 40), mat("#EAD6A4", 1), [-0.62, 0.022, 0.5], [-Math.PI / 2, 0, 0.5]);
  sand.scale.set(1.25, 0.72, 1);
  sand.castShadow = false;
  root.add(sand);

  // Hole, pin and flag
  const hole = V(0.34, 0, -0.34);
  const cup = mesh(new THREE.CircleGeometry(0.1, 36), new THREE.MeshBasicMaterial({ color: "#12200E" }), [hole.x, 0.024, hole.z], [-Math.PI / 2, 0, 0]);
  cup.castShadow = false;
  root.add(cup);
  root.add(mesh(cyl(0.016, 0.016, 1.5, 14), gloss("#FFFFFF", 0.3), [hole.x, 0.75, hole.z]));
  root.add(mesh(ball(0.03, 18, 12), gloss("#FFFFFF", 0.3), [hole.x, 1.51, hole.z]));
  const cloth = new THREE.PlaneGeometry(0.62, 0.36, 16, 4);
  const flat = cloth.attributes.position.array.slice();
  const flag = mesh(cloth, mat("#E33A2C", 0.7, 0, { side: THREE.DoubleSide }), [hole.x + 0.32, 1.29, hole.z]);
  root.add(flag);

  // Trees at the back
  const leaf = mat("#2F7A3B", 0.85);
  const leaf2 = mat("#3F9148", 0.85);
  const bark = mat("#6B4424", 0.9);
  for (const [x, z, s] of [[-0.62, -0.62, 1], [-0.32, -0.88, 0.75], [0.86, 0.1, 0.62], [-0.95, -0.22, 0.66]] as const) {
    const t = group(mesh(cyl(0.03, 0.045, 0.2, 10), bark, [0, 0.1, 0]));
    for (let i = 0; i < 3; i++) t.add(mesh(new THREE.ConeGeometry(0.24 - i * 0.055, 0.34, 14), i % 2 ? leaf2 : leaf, [0, 0.3 + i * 0.19, 0]));
    t.position.set(x, 0, z);
    t.scale.setScalar(s);
    root.add(t);
  }

  // Ball with dimples
  const dimples = canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    const rows = 13;
    for (let j = 1; j < rows; j++) {
      const th = (j / rows) * Math.PI;
      const n = Math.max(3, Math.round(26 * Math.sin(th)));
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = "#777";
        ctx.beginPath();
        ctx.ellipse(((i + (j % 2) * 0.5) / n) * w, (j / rows) * h, 7 / Math.max(0.25, Math.sin(th)), 7, 0, 0, TAU);
        ctx.fill();
      }
    }
  }, false);
  const b = mesh(ball(0.12, 40, 28), gloss("#FFFFFF", 0.35, { bumpMap: dimples, bumpScale: 1.4 }));
  root.add(b);
  const path = new THREE.QuadraticBezierCurve3(V(-0.2, 0, 0.78), V(0.62, 0, 0.5), hole);

  return {
    root,
    duration: 2.1,
    radius: 1.32,
    view: [0.1, 0.5, 1],
    look: [0, 0.42, 0],
    floor: -0.35,
    update: ({ time, play }) => {
      const k0 = span(play, 0.05, 0.72);
      const roll = 1 - (1 - k0) ** 1.7;
      const sink = easeIn(span(play, 0.7, 0.86));
      path.getPoint(roll, b.position);
      b.position.y = lerp(0.135, -0.12, sink);
      b.visible = sink < 1;
      b.rotation.set(-roll * 14, 0, roll * 5);
      const p = cloth.attributes.position;
      const gust = 0.06 + Math.sin(span(play, 0.8, 1) * Math.PI) * 0.06;
      for (let i = 0; i < p.count; i++) {
        const x = flat[i * 3] + 0.31;
        const k = x / 0.62;
        p.setY(i, flat[i * 3 + 1] * (1 - k * 0.45));
        p.setZ(i, Math.sin(x * 9 - time * 4.5) * gust * k);
      }
      p.needsUpdate = true;
      cloth.computeVertexNormals();
    },
  };
}
