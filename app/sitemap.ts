import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/pre-order", priority: 0.9, freq: "daily" },
    { path: "/catering", priority: 0.8, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/gift-cards", priority: 0.7, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
    { path: "/join-team", priority: 0.5, freq: "monthly" },
  ];
  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
