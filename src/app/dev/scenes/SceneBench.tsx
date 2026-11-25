"use client";

import { useState } from "react";
import { sceneIds, sceneInfo } from "@/lib/invitation/scenes";

/** Pixel size of the saved stills. Covers show them at about half this on a phone. */
const SIDE = 760;

interface Shot { id: string; label: string; url: string }

export function SceneBench() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [status, setStatus] = useState("");

  const draw = async (poses: "rest" | "both" | "steps", save: boolean) => {
    const { renderStill } = await import("@/components/invitation/scene3d/engine");
    const only = new URLSearchParams(window.location.search).get("only")?.split(",");
    const out: Shot[] = [];
    let bytes = 0;
    for (const id of sceneIds.filter((s) => !only || only.includes(s))) {
      const rest = sceneInfo[id].rest;
      const list = poses === "rest" ? [rest] : poses === "both" ? [0, 1] : [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1];
      for (const pose of list) {
        const blob = await renderStill(id, pose, SIDE);
        if (!blob) continue;
        out.push({ id, label: `${id} ${pose}`, url: URL.createObjectURL(blob) });
        if (save && pose === rest) {
          bytes += blob.size;
          const res = await fetch(`/api/dev/scenes?id=${id}`, { method: "POST", body: blob });
          if (!res.ok) throw new Error(`Could not save ${id}`);
        }
      }
      setShots([...out]);
      setStatus(`${id} done`);
    }
    setStatus(`Finished ${out.length} pictures${save ? `, saved ${Math.round(bytes / 1024)} KB` : ""}`);
  };

  const button = { padding: "8px 14px", border: "1px solid #888", borderRadius: 8, background: "#fff", color: "#111" };
  return (
    <main style={{ minHeight: "100vh", background: "#8f98a3", padding: 16, color: "#111" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" style={button} onClick={() => void draw("rest", false)}>Draw all</button>
        <button type="button" style={button} onClick={() => void draw("both", false)}>Draw start and end</button>
        <button type="button" style={button} onClick={() => void draw("steps", false)}>Draw each step</button>
        <button type="button" style={button} onClick={() => void draw("rest", true)}>Save stills</button>
        <span role="status">{status}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginTop: 12 }}>
        {shots.map((s) => (
          <figure key={s.label} style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.url} alt={s.label} style={{ width: "100%" }} />
            <figcaption style={{ fontSize: 12 }}>{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
