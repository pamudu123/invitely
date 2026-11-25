import * as THREE from "three";
import type { SceneId } from "@/lib/invitation/types";
import { clamp, mesh, type BuiltScene } from "./kit";
import { loadScene } from "./scenes";

/* One small renderer per visible scene. Built for phones first:
   - the canvas only runs while it is on screen and the tab is visible
   - it idles at 30 frames a second, and lowers its resolution on slow phones
   - vertical swipes always scroll the page, sideways drags turn the object */

export interface SceneHandle {
  /** Run the action from start to end */
  play: () => Promise<void>;
  setScroll: (n: number) => void;
  dispose: () => void;
}

export interface MountOptions {
  canvas: HTMLCanvasElement;
  /** Square the object is framed in. The stills are drawn to the same square. */
  frame: HTMLElement;
  scene: SceneId;
  /** Pose to start in, 0 before the action and 1 after it */
  pose: number;
  interactive?: boolean;
  onReady?: () => void;
  onLost?: () => void;
}

/** The framed square is this much bigger than the object */
const FRAME_MARGIN = 1.25;
const CAMERA_DISTANCE = 6.2;

/** Softbox studio used for reflections. */
function studio(renderer: THREE.WebGLRenderer) {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.MeshBasicMaterial({ color: "#9AA0AA", side: THREE.BackSide })));
  const panel = (w: number, h: number, pos: [number, number, number], power: number, color = "#ffffff") => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  panel(7, 7, [0, 8, 1], 5);
  panel(3, 7, [-7, 2, 3], 4, "#fff4e2");
  panel(2, 7, [7, 2, 1], 5, "#e6f0ff");
  panel(6, 1.6, [0, 1, 8], 1.8);
  panel(5, 3, [0, 3, -8], 2.4, "#dfe9ff");
  panel(12, 12, [0, -8, 0], 0.8, "#fff1de");
  panel(3, 5, [0, -1, 9], 0.9);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(s, 0.03);
  pmrem.dispose();
  s.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return env;
}

function createRenderer(canvas: HTMLCanvasElement, preserve = false) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: preserve });
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

function assemble(renderer: THREE.WebGLRenderer, built: BuiltScene) {
  const scene = new THREE.Scene();
  const env = studio(renderer);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.8;
  const radius = built.radius ?? 1;

  const key = new THREE.DirectionalLight("#fff6ea", 2.1);
  key.position.set(-2.4, 5, 3.4).multiplyScalar(radius);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 5;
  key.shadow.normalBias = 0.02;
  key.shadow.bias = -0.0004;
  const c = key.shadow.camera;
  c.left = c.bottom = -radius * 1.8;
  c.right = c.top = radius * 1.8;
  c.near = 0.5;
  c.far = radius * 14;
  const rim = new THREE.DirectionalLight("#cfe0ff", 1.1);
  rim.position.set(3, 2, -4);
  scene.add(key, rim);

  const pivot = new THREE.Group();
  pivot.add(built.root);
  scene.add(pivot);

  if (built.floor !== undefined) {
    const floor = mesh(new THREE.CircleGeometry(radius * 2.2, 48), new THREE.ShadowMaterial({ opacity: 0.32 }), [0, built.floor, 0], [-Math.PI / 2, 0, 0]);
    floor.castShadow = false;
    scene.add(floor);
  }

  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 60);
  const look = new THREE.Vector3(...(built.look ?? [0, 0, 0]));
  const dir = new THREE.Vector3(...(built.view ?? [0, 0.25, 1])).normalize();
  const distance = CAMERA_DISTANCE * radius;
  camera.far = distance * 3;
  camera.position.copy(look).addScaledVector(dir, distance);
  camera.lookAt(look);

  /** Fit the object's radius to a square of `side` pixels centred on cx, cy. */
  const frame = (w: number, h: number, cx: number, cy: number, side: number) => {
    const perPx = (2 * radius * FRAME_MARGIN) / side;
    camera.aspect = w / h;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan((h * perPx) / 2 / distance));
    camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    env.dispose();
    key.shadow.map?.dispose();
    scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.geometry.dispose();
      for (const m of (Array.isArray(o.material) ? o.material : [o.material]) as THREE.Material[]) {
        for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose();
        m.dispose();
      }
      if (o instanceof THREE.InstancedMesh) o.dispose();
    });
  };

  return { scene, camera, pivot, key, frame, dispose };
}

export async function mountScene(opts: MountOptions, signal: AbortSignal): Promise<SceneHandle | null> {
  const { canvas, frame: frameEl, interactive = false } = opts;
  const build = await loadScene(opts.scene);
  if (signal.aborted) return null;
  const built = build();
  const renderer = createRenderer(canvas);
  const world = assemble(renderer, built);
  const lean = built.turn !== "full";

  let width = 0;
  let height = 0;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  let disposed = false;
  let onScreen = false;
  let raf = 0;
  let scroll = 0;
  let play = opts.pose;
  let playing: { from: number; to: number; start: number; resolve: () => void } | null = null;
  let yaw = 0;
  let yawSpeed = 0;
  let pitch = 0;
  let dragging = false;
  // Where the phone or pointer is leaning, and the smoothed value in use.
  const target = { x: 0, y: 0 };
  const at = { x: 0, y: 0 };

  const layout = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    if (w !== width || h !== height) {
      width = w;
      height = h;
      // Keep big desktop covers to the same amount of work as a phone screen.
      pixelRatio = Math.max(1, Math.min(pixelRatio, Math.sqrt(2_600_000 / (w * h))));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h, false);
    }
    // The invitation may be drawn inside a scaled phone frame, so compare on-screen boxes.
    const a = canvas.getBoundingClientRect();
    const b = frameEl.getBoundingClientRect();
    const k = a.width ? w / a.width : 1;
    world.frame(w, h, (b.left - a.left + b.width / 2) * k, (b.top - a.top + b.height / 2) * k, b.width * k);
  };

  let last = 0;
  let clock = 0;
  let slow = 0;
  let measured = 0;

  const render = (dt: number) => {
    clock += dt;
    if (playing) {
      const t = clamp((clock - playing.start) / built.duration);
      play = playing.from + (playing.to - playing.from) * t;
      if (t >= 1) {
        const { resolve } = playing;
        playing = null;
        resolve();
      }
    }
    const ease = 1 - Math.exp(-dt * 5);
    at.x += (target.x - at.x) * ease;
    at.y += (target.y - at.y) * ease;
    if (!dragging) {
      yaw += yawSpeed * dt;
      yawSpeed *= Math.exp(-dt * 2.4);
      if (lean) yaw += (0 - yaw) * (1 - Math.exp(-dt * 2));
      else if (Math.abs(yawSpeed) < 0.4) {
        const rest = Math.round(yaw / (Math.PI * 2)) * Math.PI * 2;
        yaw += (rest - yaw) * (1 - Math.exp(-dt * 1.2));
      }
      pitch += (0 - pitch) * (1 - Math.exp(-dt * 3));
    }
    const sway = Math.sin(clock * 0.5) * (lean ? 0.06 : 0.12);
    world.pivot.rotation.y = yaw + sway + at.x * 0.28 + scroll * (lean ? 0.5 : 1.6);
    world.pivot.rotation.x = pitch + at.y * 0.12 + scroll * 0.12;
    built.update({ time: clock, play, scroll });
    renderer.render(world.scene, world.camera);
  };

  const tick = (now: number) => {
    raf = 0;
    if (disposed || !onScreen || document.hidden) return;
    raf = requestAnimationFrame(tick);
    const gap = now - last;
    const busy = Boolean(playing) || dragging || Math.abs(yawSpeed) > 0.05 || scroll > 0;
    if (!busy && gap < 30) return;
    // Drop the resolution, then the shadows, if the phone cannot keep up while animating.
    if (busy && gap < 250) {
      measured++;
      // Low power mode holds phones at 30 frames a second. That is steady, not slow.
      if (gap > 42) slow++;
      if (measured >= 24) {
        if (slow > 14) {
          if (pixelRatio > 1) {
            pixelRatio = Math.max(1, pixelRatio - 0.5);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
          } else if (world.key.castShadow) world.key.castShadow = false;
        }
        measured = slow = 0;
      }
    }
    last = now;
    render(Math.min(gap / 1000, 0.05));
  };
  const wake = () => {
    if (!raf && !disposed && onScreen && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  const ro = new ResizeObserver(() => {
    layout();
    if (width) render(0);
  });
  ro.observe(canvas);
  ro.observe(frameEl);
  // The square can move without changing size, for example when a font arrives.
  if (frameEl.parentElement) ro.observe(frameEl.parentElement);
  const io = new IntersectionObserver((e) => {
    onScreen = e[e.length - 1].isIntersecting;
    wake();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", wake);

  const run = (from: number, to: number) =>
    new Promise<void>((resolve) => {
      playing?.resolve();
      playing = { from, to, start: clock, resolve };
      play = from;
      wake();
    });
  /** Tapping the object on the cover runs its action again, then settles back. */
  const replay = async () => {
    if (playing) return;
    await run(0, 1);
    if (opts.pose !== 0 || disposed) return;
    await new Promise((r) => setTimeout(r, 900));
    if (!disposed && !playing) await run(1, 0);
  };

  /* ----------------------------- touch ----------------------------- */

  let downX = 0;
  let downY = 0;
  let moved = 0;
  let lastX = 0;
  let lastMove = 0;
  const down = (e: PointerEvent) => {
    dragging = true;
    moved = 0;
    downX = lastX = e.clientX;
    downY = e.clientY;
    yawSpeed = 0;
    lastMove = performance.now();
    canvas.setPointerCapture?.(e.pointerId);
    wake();
  };
  const move = (e: PointerEvent) => {
    if (!dragging) {
      if (e.pointerType === "mouse") {
        const r = canvas.getBoundingClientRect();
        target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        target.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      }
      return;
    }
    const dx = e.clientX - lastX;
    const now = performance.now();
    const limit = lean ? 0.7 : Infinity;
    const gain = 0.011;
    yaw = clamp(yaw + dx * gain, -limit, limit);
    pitch = clamp((e.clientY - downY) * 0.002, -0.25, 0.25);
    yawSpeed = clamp((dx * gain) / Math.max(0.008, (now - lastMove) / 1000), -9, 9);
    lastMove = now;
    lastX = e.clientX;
    moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY));
  };
  const up = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (performance.now() - lastMove > 80 || lean) yawSpeed = 0;
    if (e.type === "pointerup" && moved < 8) void replay();
  };
  const leave = () => {
    target.x = target.y = 0;
  };
  // Phones that share motion without asking get a gentle parallax. iPhones would
  // show a permission prompt, which does not belong on an invitation.
  let base: { b: number; g: number } | null = null;
  const orient = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    base ??= { b: e.beta, g: e.gamma };
    base.b += (e.beta - base.b) * 0.01;
    base.g += (e.gamma - base.g) * 0.01;
    target.x = clamp((e.gamma - base.g) / 22, -1, 1);
    target.y = clamp((e.beta - base.b) / 22, -1, 1);
  };
  const lost = (e: Event) => {
    e.preventDefault();
    if (!disposed) opts.onLost?.();
  };
  canvas.addEventListener("webglcontextlost", lost);
  if (interactive) {
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave);
  }
  const motionNeedsPrompt = typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent;
  if (!motionNeedsPrompt) window.addEventListener("deviceorientation", orient);

  layout();
  render(0.001);
  opts.onReady?.();

  return {
    play: () => run(0, 1),
    setScroll: (n) => {
      scroll = n;
      wake();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      playing?.resolve();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("deviceorientation", orient);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
      world.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

/** Draw one scene to a square still with a clear background. Used to make the files in public/scenes. */
export async function renderStill(id: SceneId, pose: number, side: number): Promise<Blob | null> {
  const built = (await loadScene(id))();
  const canvas = document.createElement("canvas");
  const renderer = createRenderer(canvas, true);
  const world = assemble(renderer, built);
  renderer.setPixelRatio(1);
  renderer.setSize(side, side, false);
  world.frame(side, side, side / 2, side / 2, side);
  built.update({ time: 0.001, play: pose, scroll: 0 });
  renderer.render(world.scene, world.camera);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
  world.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  return blob;
}
