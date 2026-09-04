// src/components/landing/delok-projects-awareness.data.ts
import type { Project } from "@/src/domains/project";

/**
 * Curated dummy projects for the landing-page "Every project, alive at a glance"
 * showcase. Names are realistic service names, compatible with Project type.
 */
export const AWARENESS_PROJECTS: Project[] = [
  {
    id: "proj_api_prod",
    name: "api-production",
    organizationId: "org_delok_demo",
    logCount: 12481,
    createdAt: "2026-01-12T08:00:00Z",
  },
  {
    id: "proj_web_prod",
    name: "web-production",
    organizationId: "org_delok_demo",
    logCount: 8204,
    createdAt: "2026-02-03T08:00:00Z",
  },
  {
    id: "proj_payment_svc",
    name: "payment-service",
    organizationId: "org_delok_demo",
    logCount: 4912,
    createdAt: "2026-02-18T08:00:00Z",
  },
  {
    id: "proj_worker",
    name: "worker",
    organizationId: "org_delok_demo",
    logCount: 2381,
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "proj_auth_svc",
    name: "auth-service",
    organizationId: "org_delok_demo",
    logCount: 1067,
    createdAt: "2026-03-14T08:00:00Z",
  },
];
