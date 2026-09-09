// src/lib/site.ts
// Central canonical origin for SEO. Production must resolve to https://delok.site.
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://delok.site";

// True production origin (never localhost) — used for sitemap/robots/canonical in production builds.
export const PRODUCTION_URL = "https://delok.site";

export const SITE_NAME = "Delok";
export const SITE_TITLE = "Delok — Log Monitoring Platform";
export const SITE_DESCRIPTION =
  "Delok is a log monitoring platform for monitoring application logs.";
