// src/domains/log-explorer/hooks/useLogExplorerRealtime.ts
"use client";

import { useEffect } from "react";

import type { LogEvent, LogFiltersState } from "@/src/domains/log";

import { websocketManager } from "@/src/lib/websocket/websocket";

import { matchesLogFilters } from "../utils/matchesLogFilters";

type UseLogExplorerRealtimeOptions = {
  projectId: string | undefined;
  filtersRef: { current: LogFiltersState };
  onLogReceived: (log: LogEvent) => void;
};

/**
 * Subscribes to a single project and forwards incoming `log.created` logs
 * that pass the current filters via `onLogReceived`.
 *
 * The WebSocket connection itself is owned by the shared WebSocket manager
 * (initialized by SocketProvider); this hook only manages subscriptions and
 * the domain-specific event handling.
 *
 * The filters ref is read from inside the event handler so incoming logs
 * always respect the latest filters without forcing a resubscription whenever
 * a filter changes.
 */
export function useLogExplorerRealtime({
  projectId,
  filtersRef,
  onLogReceived,
}: UseLogExplorerRealtimeOptions) {
  useEffect(() => {
    if (!projectId) return;

    websocketManager.subscribe(projectId);

    const removeListener = websocketManager.on("log.created", (log) => {
      if (log.projectId !== projectId) {
        return;
      }

      if (!matchesLogFilters(log, filtersRef.current)) {
        return;
      }

      onLogReceived(log);
    });

    return () => {
      removeListener();
      websocketManager.unsubscribe(projectId);
    };
  }, [projectId, filtersRef, onLogReceived]);
}
