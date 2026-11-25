import * as THREE from "three";
import { ball, backOut, box, cyl, easeInOut, gloss, group, lerp, mat, mesh, span, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const white = mat("#F7F5EF", 0.6);
  const concrete = mat("#C9C5BB", 0.85);
  const timber = mat("#B2713C", 0.6);
  const dark = mat("#26282C", 0.5);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#A9D3E4", roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1 });
  const warm = new THREE.MeshStandardMaterial({ color: "#FFD58A", emissive: "#FFB648", emissiveIntensity: 0.9 });
  const parts: { o: THREE.Object3D; y: number; lift: number; at: number }[] = [];
  const part = (o: THREE.Object3D, lift: number, at: number) => {
    root.add(o);
    parts.push({ o, y: o.position.y, lift, at });
    return o;
  };

  // Site
  root.add(mesh(box(2.3, 0.12, 1.9, 0.05), mat("#EDE9DF", 0.9), [0, -0.66, 0]));
  root.add(mesh(box(2.1, 0.02, 1.7, 0.01), mat("#93AE72", 0.95), [0, -0.595, 0]));
  root.add(mesh(box(0.42, 0.024, 0.8, 0.01), concrete, [0.62, -0.588, 0.52]));
  root.add(mesh(box(0.66, 0.03, 0.4, 0.02), new THREE.MeshPhysicalMaterial({ color: "#3BA8C9", roughness: 0.08, clearcoat: 1 }), [-0.55, -0.584, 0.56]));

  // Ground floor
  const ground = group(
    mesh(box(1.6, 0.06, 1, 0.015), concrete, [0, 0, 0]),
    mesh(box(0.06, 0.44, 0.96, 0.01), white, [-0.77, 0.25, 0]),
    mesh(box(1.6, 0.44, 0.06, 0.01), white, [0, 0.25, -0.46]),
    mesh(box(0.5, 0.44, 0.06, 0.01), timber, [0.54, 0.25, 0.42]),
    mesh(box(0.16, 0.34, 0.07, 0.01), dark, [0.54, 0.2, 0.425]),
    mesh(box(1, 0.42, 0.025, 0.005), glass, [-0.24, 0.25, 0.44]),
    mesh(box(0.5, 0.22, 0.05, 0.01), warm, [-0.3, 0.16, -0.38]),
    mesh(box(0.06, 0.44, 0.96, 0.01), white, [0.77, 0.25, 0]),
  );
  for (const x of [-0.72, -0.4, -0.08, 0.26]) ground.add(mesh(box(0.025, 0.44, 0.04, 0.005), dark, [x, 0.25, 0.445]));
  ground.position.set(0, -0.55, -0.16);
  part(ground, 0.18, 0);

  const slab = group(mesh(box(1.8, 0.07, 1.2, 0.015), white));
  slab.position.set(0, -0.05, -0.12);
  part(slab, 0.55, 0.14);

  // Upper floor, turned to overhang the entrance
  const upper = group(
    mesh(box(1.1, 0.05, 1.1, 0.012), white, [0, 0, 0]),
    mesh(box(0.06, 0.42, 1.06, 0.01), timber, [-0.52, 0.23, 0]),
    mesh(box(1.1, 0.42, 0.06, 0.01), timber, [0, 0.23, -0.52]),
    mesh(box(0.06, 0.42, 1.06, 0.01), white, [0.52, 0.23, 0]),
    mesh(box(0.98, 0.4, 0.025, 0.005), glass, [0, 0.23, 0.48]),
    mesh(box(0.4, 0.2, 0.05, 0.01), warm, [0.12, 0.18, -0.44]),
  );
  for (const x of [-0.48, -0.16, 0.16, 0.48]) upper.add(mesh(box(0.025, 0.42, 0.04, 0.005), dark, [x, 0.23, 0.49]));
  for (let i = 0; i < 7; i++) upper.add(mesh(box(0.02, 0.4, 0.03, 0.005), timber, [0.56, 0.23, -0.42 + i * 0.14]));
  upper.position.set(0.24, 0.02, 0.06);
  part(upper, 0.9, 0.28);

  const roof = group(
    mesh(box(1.32, 0.07, 1.36, 0.015), white),
    mesh(box(1.2, 0.02, 1.2, 0.005), concrete, [0, 0.04, 0]),
  );
  for (let i = 0; i < 3; i++) roof.add(mesh(box(0.28, 0.015, 0.42, 0.005), gloss("#1E2B52", 0.2), [-0.34 + i * 0.34, 0.09, -0.22], [0.28, 0, 0]));
  roof.position.set(0.24, 0.49, 0.06);
  part(roof, 1.25, 0.42);

  // Trees grow in last
  const trees: THREE.Group[] = [];
  for (const [x, z, s] of [[-0.94, 0.1, 1], [0.95, -0.2, 0.8], [-0.9, -0.6, 1.2], [0.98, 0.68, 0.55], [-0.98, 0.72, 0.5]] as const) {
    const t = group(
      mesh(cyl(0.018, 0.026, 0.3, 8), timber, [0, 0.15, 0]),
      mesh(ball(0.17, 18, 14), mat("#5E8F4A", 0.9), [0, 0.38, 0]),
      mesh(ball(0.12, 16, 12), mat("#6FA257", 0.9), [0.08, 0.5, 0.03]),
    );
    t.position.set(x, -0.59, z);
    t.userData.s = s;
    trees.push(t);
    root.add(t);
  }

  return {
    root,
    duration: 2.4,
    radius: 1.26,
    view: [0.7, 0.55, 1],
    look: [0, -0.06, 0],
    floor: -0.725,
    update: ({ play, scroll }) => {
      for (const p of parts) {
        const t = backOut(span(play, p.at * 0.9, p.at * 0.9 + 0.5));
        p.o.position.y = p.y + p.lift * (1 - t) * 0.85 + scroll * p.lift * 0.5;
        p.o.rotation.y = lerp(0.5 * p.lift, 0, easeInOut(span(play, p.at * 0.9, p.at * 0.9 + 0.5)));
      }
      trees.forEach((t, i) => t.scale.setScalar(Math.max(0.001, backOut(span(play, 0.62 + i * 0.05, 0.82 + i * 0.045)) * t.userData.s)));
    },
  };
}
