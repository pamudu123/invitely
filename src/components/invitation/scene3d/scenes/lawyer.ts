import * as THREE from "three";
import { canvasTexture, cyl, easeIn, easeInOut, easeOut, gloss, group, lathe, mesh, metals, rng, span, torus, type BuiltScene } from "../kit";

export function build(): BuiltScene {
  const root = group();
  const floor = -0.62;
  const r = rng(3);
  const grain = canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#7A3A1E";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      ctx.strokeStyle = r() > 0.5 ? "rgba(40,14,4,0.25)" : "rgba(210,130,80,0.16)";
      ctx.lineWidth = 0.6 + r() * 1.6;
      const x = r() * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + r() * 12 - 6, h * 0.3, x + r() * 12 - 6, h * 0.7, x, h);
      ctx.stroke();
    }
  });
  const wood = gloss("#FFFFFF", 0.26, { map: grain, clearcoat: 1, clearcoatRoughness: 0.12 });
  const brass = metals.brass();

  // Sound block
  const block = group(
    mesh(lathe([[0, 0], [0.6, 0], [0.63, 0.03], [0.6, 0.1], [0.52, 0.13], [0.54, 0.17], [0.5, 0.21], [0, 0.215]], 72), wood),
    mesh(torus(0.53, 0.014), brass, [0, 0.152, 0], [Math.PI / 2, 0, 0]),
  );
  block.position.set(-0.36, floor, 0.1);
  root.add(block);

  // Gavel, built with its handle along x and head at the origin
  const gavel = group();
  const head = group(
    mesh(lathe([
      [0, -0.4], [0.2, -0.4], [0.235, -0.37], [0.235, -0.28], [0.21, -0.25], [0.22, -0.22], [0.19, -0.16], [0.2, 0], [0.19, 0.16], [0.22, 0.22], [0.21, 0.25], [0.235, 0.28], [0.235, 0.37], [0.2, 0.4], [0, 0.4],
    ], 56), wood),
    mesh(cyl(0.212, 0.212, 0.1, 48), brass),
  );
  gavel.add(head);
  gavel.add(mesh(lathe([[0.05, 0], [0.055, 0.2], [0.04, 0.34], [0.05, 0.6], [0.06, 0.9], [0.075, 1.1], [0.06, 1.22], [0.03, 1.27], [0, 1.28]], 32), wood, [0.1, 0, 0], [0, 0, -Math.PI / 2]));
  // Turns about the far end of the handle
  gavel.position.x = -1.35;
  const arm = group(gavel);
  root.add(arm);

  // Ring of dust thrown up by the strike
  const dust = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 64), new THREE.MeshBasicMaterial({ color: "#F3D9A6", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  dust.rotation.x = -Math.PI / 2;
  dust.position.set(-0.36, floor + 0.24, 0.1);
  root.add(dust);

  return {
    root,
    duration: 1.8,
    radius: 1.14,
    view: [0.2, 0.32, 1],
    look: [0.06, -0.14, 0],
    floor,
    update: ({ time, play }) => {
      const strike = (at: number) => {
        const up = easeInOut(span(play, at - 0.3, at - 0.1));
        const down = easeIn(span(play, at - 0.1, at));
        return up - down;
      };
      const lift = strike(0.4) * 0.5 + strike(0.75) * 0.62;
      // Rests a little above the block, as if about to fall.
      const hover = (1 - easeOut(span(play, 0, 0.1))) * (0.3 + Math.sin(time * 1.1) * 0.02) + easeInOut(span(play, 0.84, 1)) * 0.3;
      arm.position.set(0.98, floor + 0.62, 0.1);
      arm.rotation.set(0, -0.16, -(lift + hover));
      const ring = Math.max(span(play, 0.4, 0.58) * (play < 0.6 ? 1 : 0), span(play, 0.75, 0.98));
      dust.scale.setScalar(1 + ring * 0.7);
      (dust.material as THREE.MeshBasicMaterial).opacity = ring > 0 ? (1 - ring) * 0.7 : 0;
    },
  };
}
