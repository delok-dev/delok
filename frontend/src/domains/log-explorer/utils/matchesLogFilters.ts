// src/domains/log-explorer/utils/matchesLogFilters.ts
import type { LogEvent, LogFiltersState } from "@/src/domains/log";

/**
 * Client-side filter check used for realtime (WebSocket) logs, which bypass
 * the server query. Page data is already filtered server-side.
 */
export function matchesLogFilters(
  log: LogEvent,
  filters: LogFiltersState,
): boolean {
  const search = filters.search.trim().toLowerCase();
  const from = filters.from ? new Date(filters.from).getTime() : null;
  const to = filters.to ? new Date(filters.to).getTime() + 86_400_000 : null;

  if (
    search &&
    !`${log.event} ${log.message ?? ""}`.toLowerCase().includes(search)
  ) {
    return false;
  }

  if (filters.level && log.level.toLowerCase() !== filters.level.toLowerCase()) {
    return false;
  }

  if (
    filters.environment &&
    log.environment.toLowerCase() !== filters.environment.toLowerCase()
  ) {
    return false;
  }

  const occurredAt = new Date(log.occurredAt).getTime();

  if (from !== null && occurredAt < from) return false;
  if (to !== null && occurredAt >= to) return false;

  return true;
}
