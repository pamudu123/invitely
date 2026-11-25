import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { sceneIds } from "@/lib/invitation/scenes";

/** Development only: save a still drawn by /dev/scenes. */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  const id = new URL(req.url).searchParams.get("id");
  const scene = sceneIds.find((s) => s === id);
  if (!scene) return Response.json({ error: "Unknown scene." }, { status: 400 });
  const dir = path.join(process.cwd(), "public", "scenes");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${scene}.webp`), Buffer.from(await req.arrayBuffer()));
  return Response.json({ ok: true });
}
