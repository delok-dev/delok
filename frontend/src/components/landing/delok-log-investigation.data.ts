// src/components/landing/delok-log-investigation.data.ts
import type { LogEvent } from "@/src/domains/log";

/**
 * Static, curated snapshot for the landing-page investigation showcase.
 * The last entry is the "selected" event shown in the detail panel.
 */
export const INVESTIGATION_LOGS: LogEvent[] = [
  {
    id: "lg_01jbf2m7q3x9k1n4r8t2",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "info",
    event: "request.completed",
    message: "GET /api/checkouts — 200 OK",
    occurredAt: "2026-08-26T14:02:11Z",
    receivedAt: "2026-08-26T14:02:11Z",
    payload: null,
  },
  {
    id: "lg_01jbf2m8a5c2e7g9j1l3",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "warn",
    event: "database.query.slow",
    message: "Query exceeded 500ms threshold",
    occurredAt: "2026-08-26T14:03:47Z",
    receivedAt: "2026-08-26T14:03:47Z",
    payload: {
      table: "orders",
      durationMs: 842,
      rowsExamined: 15230,
    },
  },
  {
    id: "lg_01jbf2m9b6d3f8h0k2m4",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "info",
    event: "auth.login",
    message: "User authenticated via GitHub OAuth",
    occurredAt: "2026-08-26T14:05:03Z",
    receivedAt: "2026-08-26T14:05:03Z",
    payload: null,
  },
  {
    id: "lg_01jbf2mac7e4g9h1j3k5",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "error",
    event: "payment.failed",
    message:
      "Payment provider returned an unexpected response after 3 retries.",
    occurredAt: "2026-08-26T14:06:29Z",
    receivedAt: "2026-08-26T14:06:29Z",
    payload: {
      provider: "stripe",
      status: 502,
      attempt: 3,
      checkoutId: "ch_1Pf2kQ2eZvKYlo2C",
      amount: 4900,
      currency: "usd",
    },
  },
  {
    id: "lg_01jbf2mbd8f5h0j2k4l6",
    projectId: "proj_delok_prod",
    environment: "staging",
    level: "warn",
    event: "cache.miss",
    message: "Redis cache miss — key redis:user:18392",
    occurredAt: "2026-08-26T14:07:12Z",
    receivedAt: "2026-08-26T14:07:12Z",
    payload: { key: "redis:user:18392", ttl: 0 },
  },
  {
    id: "lg_01jbf2mce9g6h1k3l5m7",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "info",
    event: "deploy.completed",
    message: "Release v2026.34.1 deployed to production",
    occurredAt: "2026-08-26T14:09:58Z",
    receivedAt: "2026-08-26T14:09:58Z",
    payload: { version: "v2026.34.1", commit: "a91f2c3", durationSec: 96 },
  },
];

/** The event highlighted in the stream and opened in the detail panel. */
export const SELECTED_LOG_ID = "lg_01jbf2mac7e4g9h1j3k5";
