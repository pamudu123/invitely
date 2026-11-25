import type { SceneId } from "@/lib/invitation/types";
import type { BuiltScene } from "../kit";

type Build = () => BuiltScene;

/** Each scene is its own chunk, so a guest only downloads the one on their invitation. */
const loaders: Record<SceneId, () => Promise<{ build: Build }>> = {
  chess: () => import("./chess"),
  cricket: () => import("./cricket"),
  tennis: () => import("./tennis"),
  football: () => import("./football"),
  basketball: () => import("./basketball"),
  badminton: () => import("./badminton"),
  rugby: () => import("./rugby"),
  golf: () => import("./golf"),
  tabletennis: () => import("./tabletennis"),
  trophy: () => import("./trophy"),
  doctor: () => import("./doctor"),
  lawyer: () => import("./lawyer"),
  architect: () => import("./architect"),
  chef: () => import("./chef"),
  developer: () => import("./developer"),
  pilot: () => import("./pilot"),
  photographer: () => import("./photographer"),
  teacher: () => import("./teacher"),
  musician: () => import("./musician"),
  engineer: () => import("./engineer"),
};

export async function loadScene(id: SceneId): Promise<Build> {
  return (await loaders[id]()).build;
}
