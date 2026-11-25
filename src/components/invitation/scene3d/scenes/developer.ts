import * as THREE from "three";
import { box, canvasTexture, cyl, easeInOut, gloss, group, mat, mesh, rng, span, torus, TAU, V, tube, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const floor = -0.6;
  const alu = mat("#C4C8CE", 0.34, 0.85);
  const key = mat("#1C1E23", 0.55);

  const baseW = 1.9;
  const baseD = 1.26;
  const base = group(mesh(box(baseW, 0.08, baseD, 0.035), alu));
  base.add(mesh(box(1.62, 0.012, 0.58, 0.02), mat("#AEB3BA", 0.5, 0.7), [0, 0.037, -0.2]));
  const keys = new THREE.InstancedMesh(box(0.112, 0.03, 0.094, 0.018), key, 13 * 4 + 1);
  const o = new THREE.Object3D();
  let k = 0;
  for (let row = 0; row < 4; row++)
    for (let c = 0; c < 13; c++) {
      o.position.set(-0.744 + c * 0.124, 0.052, -0.42 + row * 0.11);
      o.updateMatrix();
      keys.setMatrixAt(k++, o.matrix);
    }
  o.position.set(0, 0.052, 0.02);
  o.scale.set(5.4, 1, 1);
  o.updateMatrix();
  keys.setMatrixAt(k, o.matrix);
  base.add(keys);
  base.add(mesh(box(0.66, 0.012, 0.34, 0.03), mat("#B7BCC3", 0.28, 0.7), [0, 0.037, 0.36]));
  base.position.set(0, floor + 0.05, 0.16);
  root.add(base);

  // Screen, drawn as an editor
  const r = rng(21);
  const tints = ["#FF9D3C", "#F4F1EA", "#7FD6C2", "#C9A7FF", "#8E95A3"];
  const screenTex = canvasTexture(640, 420, (ctx, w, h) => {
    ctx.fillStyle = "#11141A";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1B2028";
    ctx.fillRect(0, 0, w, 36);
    ctx.fillRect(0, 36, 104, h);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(24 + i * 22, 18, 6, 0, TAU);
      ctx.fill();
    });
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i === 2 ? "#FF9D3C" : "#39414E";
      ctx.fillRect(18 + (i % 3 ? 12 : 0), 62 + i * 26, 44 + r() * 22, 8);
    }
    const indent = [0, 1, 2, 2, 3, 3, 2, 1, 1, 2, 2, 1, 0, 0];
    indent.forEach((n, i) => {
      let x = 148 + n * 30;
      const y = 60 + i * 25;
      ctx.fillStyle = "#39414E";
      ctx.fillRect(118, y + 1, 12, 8);
      const words = 2 + Math.floor(r() * 3);
      for (let j = 0; j < words; j++) {
        const len = 34 + r() * 76;
        ctx.fillStyle = tints[Math.floor(r() * tints.length)];
        ctx.fillRect(x, y, len, 10);
        x += len + 12;
      }
    });
  });
  const lid = group();
  lid.add(mesh(box(baseW, 1.24, 0.05, 0.03), alu, [0, 0.62, 0]));
  lid.add(mesh(box(baseW - 0.05, 1.19, 0.012, 0.02), gloss("#08090B", 0.15), [0, 0.62, 0.024]));
  const display = new THREE.Mesh(new THREE.PlaneGeometry(baseW - 0.14, 1.1), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  display.position.set(0, 0.63, 0.0315);
  lid.add(display);
  const cursor = new THREE.Mesh(new THREE.PlaneGeometry(0.026, 0.06), new THREE.MeshBasicMaterial({ color: "#FF9D3C", toneMapped: false }));
  cursor.position.set(-0.4, 0.19, 0.034);
  lid.add(cursor);
  const hinge = group(lid);
  hinge.position.set(0, floor + 0.135, 0.16 - baseD / 2 + 0.03);
  root.add(hinge);

  // A cup of coffee
  const mug = group(
    mesh(cyl(0.13, 0.11, 0.26, 36), gloss("#FF9D3C", 0.3)),
    mesh(cyl(0.112, 0.112, 0.01, 32), mat("#3A1E0E", 0.3), [0, 0.128, 0]),
    mesh(torus(0.075, 0.02, TAU, 32), gloss("#FF9D3C", 0.3), [0.15, 0, 0]),
  );
  mug.position.set(1.12, floor + 0.14, 0.42);
  root.add(mug);

  // Brackets that float either side of the screen
  const amber = gloss("#FF9D3C", 0.25);
  const br = (s: number) => {
    const g = group(mesh(tube([V(0.12, 0.3, 0), V(0, 0.26, 0), V(0, 0.07, 0), V(-0.1, 0, 0), V(0, -0.07, 0), V(0, -0.26, 0), V(0.12, -0.3, 0)], 0.035, false, 60), amber));
    g.scale.x = s;
    root.add(g);
    return g;
  };
  const left = br(1);
  const right = br(-1);

  return {
    root,
    duration: 1.9,
    radius: 1.28,
    view: [-0.32, 0.36, 1],
    look: [0, -0.02, 0],
    floor,
    update: ({ time, play, scroll }) => {
      const open = easeInOut(span(play, 0.04, 0.7));
      hinge.rotation.x = Math.PI / 2 - open * (Math.PI / 2 + 0.26) + scroll * 0.9;
      const on = span(play, 0.45, 0.7);
      (display.material as THREE.MeshBasicMaterial).color.setScalar(on);
      cursor.visible = on > 0.9 && Math.floor(time * 1.8) % 2 === 0;
      const pop = easeInOut(span(play, 0.6, 1));
      [left, right].forEach((b, i) => {
        const s = i ? 1 : -1;
        b.position.set(s * (0.5 + pop * 0.66), 0.2 + pop * 0.36 + Math.sin(time * 1.2 + i * 2) * 0.03, 0.1);
        b.scale.set(-s * pop, pop, pop);
        b.rotation.y = s * -0.35;
        b.visible = pop > 0.01;
      });
    },
  };
}
