import { notFound } from "next/navigation";
import { SceneBench } from "./SceneBench";

/** Development only: look at every 3D scene and redraw the stills in public/scenes. */
export default function ScenesPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SceneBench />;
}
