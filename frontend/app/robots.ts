import type { MetadataRoute } from "next";
import { PRODUCTION_URL } from "@/src/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/orgs/", "/sign-in", "/auth/"],
    },
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  };
}
