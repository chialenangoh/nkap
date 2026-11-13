import type { MetadataRoute } from "next";

const BASE = "https://freenkap.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/send-money-to-cameroon", priority: 0.9, changeFrequency: "weekly" },
    { path: "/send-money-to-nigeria", priority: 0.9, changeFrequency: "weekly" },
    { path: "/send-money-to-ghana", priority: 0.9, changeFrequency: "weekly" },
    { path: "/send-money-to-kenya", priority: 0.9, changeFrequency: "weekly" },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
