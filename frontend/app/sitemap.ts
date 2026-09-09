import type { MetadataRoute } from "next";
import { PRODUCTION_URL } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = PRODUCTION_URL;
  // Only public, indexable routes that contain real content
  const routes = [
    "",
    "/docs",
    "/docs/introduction",
    "/docs/quickstart",
    "/docs/installation",
    "/docs/logging",
    "/docs/reference/log-event",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${base}${route || "/"}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/docs" ? 0.8 : 0.7,
  }));
}
