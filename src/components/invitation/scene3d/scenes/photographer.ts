import * as THREE from "three";
import { ball, box, canvasTexture, cyl, easeInOut, gloss, group, lathe, lerp, mat, mesh, metals, rng, span, TAU, torus, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const r = rng(13);
  const grainTex = canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5200; i++) {
      ctx.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)";
      ctx.fillRect(r() * w, r() * h, 2.4, 2.4);
    }
  }, false);
  grainTex.repeat.set(3, 1.4);
  const leather = mat("#1A1B1E", 0.75, 0, { bumpMap: grainTex, bumpScale: 2.4 });
  const silver = mat("#CBCED3", 0.28, 0.95);
  const black = gloss("#0F1012", 0.3);

  const body = group(
    mesh(box(1.9, 0.78, 0.5, 0.12), leather),
    mesh(box(1.9, 0.26, 0.5, 0.1), silver, [0, 0.46, 0]),
    mesh(box(1.9, 0.12, 0.5, 0.06), silver, [0, -0.42, 0]),
    mesh(box(0.6, 0.26, 0.42, 0.06), silver, [0, 0.66, 0]),
    mesh(box(0.3, 0.16, 0.04, 0.03), black, [0, 0.66, 0.2]),
    mesh(box(0.24, 0.05, 0.22, 0.015), metals.dark(), [0, 0.81, 0]),
    mesh(cyl(0.15, 0.15, 0.12, 40), silver, [0.64, 0.64, 0]),
    mesh(cyl(0.155, 0.155, 0.06, 40), metals.dark(), [0.64, 0.64, 0]),
    mesh(cyl(0.13, 0.13, 0.1, 40), silver, [-0.66, 0.63, 0]),
  );
  for (let i = 0; i < 2; i++) body.add(mesh(box(0.14, 0.12, 0.04, 0.02), black, [i ? 0.72 : -0.72, 0.46, 0.25]));
  // A small red mark
  body.add(mesh(cyl(0.045, 0.045, 0.02, 28), gloss("#D5261E", 0.3), [0.66, 0.2, 0.25], [Math.PI / 2, 0, 0]));
  const button = mesh(cyl(0.06, 0.07, 0.07, 28), gloss("#D5261E", 0.3), [-0.66, 0.71, 0]);
  body.add(button);
  root.add(body);

  // Lens, pointing along +z
  const lens = group(
    mesh(lathe([[0.36, 0], [0.5, 0.02], [0.51, 0.12], [0.47, 0.14], [0.47, 0.2], [0.49, 0.21], [0.49, 0.42], [0.47, 0.44], [0.46, 0.58], [0.43, 0.6], [0.36, 0.5], [0.33, 0.36]], 72, false), black, [0, 0, 0], [Math.PI / 2, 0, 0]),
    mesh(torus(0.505, 0.022), silver, [0, 0, 0.06]),
    mesh(torus(0.452, 0.014), silver, [0, 0, 0.585]),
  );
  const ridges = new THREE.InstancedMesh(box(0.022, 0.04, 0.17, 0.008), mat("#26282C", 0.6), 60);
  const o = new THREE.Object3D();
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * TAU;
    o.position.set(Math.cos(a) * 0.492, Math.sin(a) * 0.492, 0.315);
    o.rotation.set(0, 0, a - Math.PI / 2);
    o.updateMatrix();
    ridges.setMatrixAt(i, o.matrix);
  }
  const ring = group(ridges);
  lens.add(ring);
  lens.position.set(0, -0.02, 0.22);
  root.add(lens);

  // Aperture blades behind the glass
  const back = mesh(new THREE.CircleGeometry(0.36, 48), new THREE.MeshBasicMaterial({ color: "#1B1026" }), [0, 0, 0.3]);
  lens.add(back);
  // A ring with a seven sided hole that opens and closes
  const sides = 7;
  const iris = new THREE.BufferGeometry();
  const ip = new Float32Array(sides * 6 * 3);
  const ic = new Float32Array(sides * 6 * 3);
  for (let k = 0; k < sides; k++) for (let v = 0; v < 6; v++) ic.fill(k % 2 ? 0.16 : 0.24, (k * 6 + v) * 3, (k * 6 + v) * 3 + 3);
  iris.setAttribute("position", new THREE.BufferAttribute(ip, 3));
  iris.setAttribute("color", new THREE.BufferAttribute(ic, 3));
  const setIris = (r: number, turn: number) => {
    for (let k = 0; k < sides; k++) {
      const a = (k / sides) * TAU + turn;
      const b = ((k + 1) / sides) * TAU + turn;
      const pts = [[r, a], [0.4, a - 0.5], [0.4, b - 0.5], [r, a], [0.4, b - 0.5], [r, b]];
      pts.forEach(([q, t], v) => ip.set([Math.cos(t) * q, Math.sin(t) * q, 0], (k * 6 + v) * 3));
    }
    iris.attributes.position.needsUpdate = true;
  };
  setIris(0.2, 0);
  const irisMesh = new THREE.Mesh(iris, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  irisMesh.position.z = 0.34;
  irisMesh.frustumCulled = false;
  lens.add(irisMesh);
  const front = mesh(ball(0.6, 48, 24), new THREE.MeshPhysicalMaterial({
    color: "#25124A", roughness: 0.03, metalness: 0.2, transparent: true, opacity: 0.42, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.8,
  }));
  front.geometry.dispose();
  front.geometry = new THREE.SphereGeometry(0.62, 48, 16, 0, TAU, 0, 0.62);
  front.rotation.x = Math.PI / 2;
  front.position.z = -0.06;
  front.castShadow = false;
  lens.add(front);

  const flash = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({
    transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    map: canvasTexture(128, 128, (ctx) => {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(255,250,235,0.7)");
      g.addColorStop(1, "rgba(255,240,210,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }),
  }));
  flash.position.set(0, 0.66, 0.5);
  root.add(flash);

  return {
    root,
    duration: 1.7,
    radius: 1.16,
    view: [0.16, 0.16, 1],
    look: [0, 0.1, 0],
    update: ({ time, play }) => {
      body.position.y = lens.position.y = 0;
      const press = Math.sin(span(play, 0.18, 0.5) * Math.PI);
      button.position.y = 0.71 - press * 0.035;
      ring.rotation.z = easeInOut(span(play, 0, 0.35)) * 0.9 + Math.sin(time * 0.4) * 0.15;
      const close = Math.sin(span(play, 0.3, 0.6) * Math.PI);
      setIris(lerp(0.22 + Math.sin(time * 0.7) * 0.02, 0.004, close), close * 0.9 + Math.sin(time * 0.4) * 0.1);
      const f = span(play, 0.46, 0.95);
      (flash.material as THREE.MeshBasicMaterial).opacity = f > 0 ? Math.exp(-f * 4.5) * (1 - f) * 1.4 : 0;
      flash.scale.setScalar(1 + f * 3.4);
    },
  };
}
