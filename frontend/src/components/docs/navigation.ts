// src/components/docs/navigation.ts
export type DocsNavItem = {
  title: string;
  href: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

import { ROUTES } from "@/src/constants/routes";

export const DOCS_NAVIGATION: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: ROUTES.DOCS.INTRODUCTION },
      { title: "Quickstart", href: ROUTES.DOCS.QUICKSTART },
    ],
  },
  {
    title: "SDK",
    items: [
      { title: "Installation", href: ROUTES.DOCS.INSTALLATION },
      { title: "Logging", href: ROUTES.DOCS.LOGGING },
    ],
  },
  {
    title: "Reference",
    items: [{ title: "Log Event", href: ROUTES.DOCS.REFERENCE_LOG_EVENT }],
  },
];

export const ALL_DOCS_HREFS = DOCS_NAVIGATION.flatMap((s) =>
  s.items.map((i) => i.href),
);
