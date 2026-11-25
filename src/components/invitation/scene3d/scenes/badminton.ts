import * as THREE from "three";
import { cyl, easeIn, easeInOut, easeOut, gloss, group, lerp, mat, mesh, span, TAU, torus, type BuiltScene } from "../kit";
import { racket } from "./tennis";

function shuttle() {
  const g = group();
  g.add(mesh(new THREE.SphereGeometry(0.17, 36, 18, 0, TAU, Math.PI / 2, Math.PI / 2), mat("#F3E7CF", 0.6)));
  g.add(mesh(cyl(0.172, 0.172, 0.1, 36), mat("#F3E7CF", 0.6), [0, 0.05, 0]));
  g.add(mesh(cyl(0.176, 0.176, 0.05, 36), gloss("#D8343A", 0.4), [0, 0.06, 0]));
  // One feather, bent slightly along its quill, repeated round the skirt.
  const s = new THREE.Shape();
  s.moveTo(0, 0.22);
  s.bezierCurveTo(-0.1, 0.3, -0.105, 0.6, -0.085, 0.74);
  s.quadraticCurveTo(0, 0.82, 0.085, 0.74);
  s.bezierCurveTo(0.105, 0.6, 0.1, 0.3, 0, 0.22);
  const vane = new THREE.ShapeGeometry(s, 10);
  const quill = cyl(0.008, 0.013, 0.74, 8);
  quill.translate(0, 0.39, 0);
  const n = 16;
  const white = mat("#FFFFFF", 0.7, 0, { side: THREE.DoubleSide });
  const vanes = new THREE.InstancedMesh(vane, white, n);
  const quills = new THREE.InstancedMesh(quill, mat("#EDE6D6", 0.5), n);
  const o = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    o.position.set(Math.sin(a) * 0.12, 0.08, Math.cos(a) * 0.12);
    o.rotation.set(0.36, a, 0, "YXZ");
    o.updateMatrix();
    quills.setMatrixAt(i, o.matrix);
    o.rotateY(0.22);
    o.updateMatrix();
    vanes.setMatrixAt(i, o.matrix);
  }
  vanes.castShadow = vanes.receiveShadow = quills.castShadow = true;
  g.add(vanes, quills);
  g.add(mesh(torus(0.19, 0.008, TAU, 48), mat("#E9E2D0", 0.6), [0, 0.28, 0], [Math.PI / 2, 0, 0]));
  g.add(mesh(torus(0.235, 0.008, TAU, 48), mat("#E9E2D0", 0.6), [0, 0.4, 0], [Math.PI / 2, 0, 0]));
  return g;
}

export function build(): BuiltScene {
  const root = group();
  const bat = racket({
    rx: 0.46, ry: 0.56, gap: 0.062, tube: 0.026, shaft: 0.62, handle: 0.5, handleR: 0.05, open: false,
    frame: gloss("#0E5F8C", 0.25), accent: gloss("#FFC531", 0.3), strings: mat("#FFFFFF", 0.5), grip: mat("#1B1E24", 0.8),
  });
  bat.position.y = 1.6;
  const arm = group(bat);
  root.add(arm);
  const bird = shuttle();
  const holder = group(bird);
  bird.position.y = -0.28;
  root.add(holder);

  return {
    root,
    duration: 1.7,
    radius: 1.16,
    view: [0, 0.1, 1],
    update: ({ time, play }) => {
      const wind = easeInOut(span(play, 0, 0.34));
      const swing = easeIn(span(play, 0.38, 0.54));
      const after = easeOut(span(play, 0.54, 0.95));
      arm.position.set(-0.1, -1.16, -0.2);
      arm.rotation.set(-wind * 0.6 + swing * 1.2 + after * 0.25, 0.45 - swing * 0.4, 0.3 + wind * 0.4 - swing * 0.7 - after * 0.4);
      const rise = span(play, 0, 0.5);
      const fly = span(play, 0.52, 0.86);
      holder.position.set(
        lerp(lerp(0.38, 0, rise), 0.6, fly),
        lerp(-0.22, 0.6, Math.sin(rise * Math.PI * 0.55)) + (rise === 0 ? Math.sin(time * 1.5) * 0.03 : 0) - fly * 0.7,
        lerp(lerp(0.42, 0.45, rise), 7.2, easeIn(fly) * 0.5 + fly * 0.5),
      );
      holder.scale.setScalar(lerp(1.05, 0.9, rise));
      // Cork leads: pointing down at rest, then at the guest.
      holder.rotation.set(lerp(0.5, -0.9, rise) + fly * -0.5, time * 0.3 + play * 6, lerp(-0.45, 0, rise));
      holder.visible = fly < 1;
    },
  };
}
