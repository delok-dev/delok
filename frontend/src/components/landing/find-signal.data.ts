// src/components/landing/find-signal.data.ts
import type { LogEvent, LogFiltersState } from "@/src/domains/log";

/**
 * Static log stream for the landing-page "Find the signal." showcase.
 * Filtering runs through the real matchesLogFilters utility.
 */
export const SIGNAL_SHOWCASE_LOGS: LogEvent[] = [
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
    payload: { table: "orders", durationMs: 842 },
  },
  {
    id: "lg_01jbf2mac7e4g9h1j3k5",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "error",
    event: "payment.failed",
    message: "Payment provider returned an unexpected response after 3 retries.",
    occurredAt: "2026-08-26T14:06:29Z",
    receivedAt: "2026-08-26T14:06:29Z",
    payload: { provider: "stripe", status: 502, attempt: 3 },
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
    id: "lg_01jbf2mbd8f5h0j2k4l6",
    projectId: "proj_delok_prod",
    environment: "staging",
    level: "warn",
    event: "cache.miss",
    message: "Redis cache miss — key redis:user:18392",
    occurredAt: "2026-08-26T14:07:12Z",
    receivedAt: "2026-08-26T14:07:12Z",
    payload: { key: "redis:user:18392" },
  },
  {
    id: "lg_01jbf2mdg0h7i2k4m6n8",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "error",
    event: "payment.timeout",
    message: "Upstream payment gateway timed out after 30s",
    occurredAt: "2026-08-26T14:08:01Z",
    receivedAt: "2026-08-26T14:08:01Z",
    payload: { gateway: "stripe", timeoutMs: 30000 },
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
    payload: { version: "v2026.34.1" },
  },
  {
    id: "lg_01jbf2meh1i3j5k7m9n1",
    projectId: "proj_delok_prod",
    environment: "production",
    level: "fatal",
    event: "database.connection.lost",
    message: "Primary database connection pool exhausted",
    occurredAt: "2026-08-26T14:10:22Z",
    receivedAt: "2026-08-26T14:10:22Z",
    payload: { pool: "primary", activeConnections: 100 },
  },
];

/** Injected during the ERROR-filter phase to show the stream still moving. */
export const SIGNAL_INJECTED_LOG: LogEvent = {
  id: "lg_01jbf2minject_checkout",
  projectId: "proj_delok_prod",
  environment: "production",
  level: "error",
  event: "checkout.failed",
  message: "Checkout session expired before payment confirmation",
  occurredAt: "2026-08-26T14:10:45Z",
  receivedAt: "2026-08-26T14:10:45Z",
  payload: { checkoutId: "cs_live_a1b2c3", reason: "session_expired" },
  isRealtime: true,
};

export const SIGNAL_EMPTY_FILTERS: LogFiltersState = {
  search: "",
  level: "",
  environment: "",
  from: "",
  to: "",
};
