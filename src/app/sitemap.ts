import type { MetadataRoute } from "next";
import { templates } from "@/lib/invitation/templates";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/templates`, priority: 0.9 },
    { url: `${base}/pricing`, priority: 0.7 },
    ...templates.map((t) => ({ url: `${base}/templates/${t.id}`, priority: 0.6 })),
  ];
}
