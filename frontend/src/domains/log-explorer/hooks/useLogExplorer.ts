// src/domains/log-explorer/hooks/useLogExplorer.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LogService } from "@/src/domains/log";
import type {
  LogEvent,
  LogFiltersState,
  LogPagination,
} from "@/src/domains/log";

import { useLogExplorerRealtime } from "./useLogExplorerRealtime";

const DEFAULT_PAGINATION: LogPagination = {
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  total: 0,
};

const EMPTY_FILTERS: LogFiltersState = {
  search: "",
  level: "",
  environment: "",
  from: "",
  to: "",
};

const DEFAULT_LIMIT = 50;

type UseLogExplorerOptions = {
  projectId: string;
};

export function useLogExplorer({ projectId }: UseLogExplorerOptions) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [pagination, setPagination] =
    useState<LogPagination>(DEFAULT_PAGINATION);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [limit, setLimitState] = useState<number>(DEFAULT_LIMIT);

  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);

  const [filters, setFilters] = useState<LogFiltersState>(EMPTY_FILTERS);

  // Always-current filter ref so the WebSocket handler can check incoming
  // logs without reconnecting whenever a filter changes.
  const filtersRef = useRef(filters);

  // Ids of logs that arrived over the WebSocket since the last fetch. Used to
  // re-apply the realtime flag when a fetch resolves while a WS log was
  // already delivered (e.g. during the initial load), so its flash still
  // plays when the row first renders. Cleared after each fetch so logs are
  // only flagged for the first appearance in the current view.
  const realtimeLogIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
    filters.level ||
    filters.environment ||
    filters.from ||
    filters.to,
  );

  const setFilter = useCallback((key: keyof LogFiltersState, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const setLimit = useCallback((next: number) => {
    setLimitState(next);
    setPage(1);
  }, []);

  // Only the latest fetch request may apply its result, so a slow earlier
  // response (e.g. after rapid filter typing) can't overwrite a newer one.
  const fetchSequence = useRef(0);

  const fetchLogs = useCallback(async () => {
    if (!projectId) return;

    const sequence = ++fetchSequence.current;

    setIsLoading(true);

    try {
      const result = await LogService.listByProject(
        projectId,
        page,
        limit,
        filters,
      );

      if (sequence !== fetchSequence.current) return;

      const arrivedIds = realtimeLogIds.current;

      setLogs(
        result.logs.map((log) =>
          arrivedIds.has(log.id) ? { ...log, isRealtime: true } : log,
        ),
      );

      arrivedIds.clear();

      setPagination(result.pagination);
    } catch (error) {
      if (sequence === fetchSequence.current) {
        console.error("Failed to fetch logs:", error);
      }
    } finally {
      if (sequence === fetchSequence.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, page, limit, filters]);

  useEffect(() => {
    // Defer so the initial fetch (which sets loading state) doesn't run
    // synchronously inside the effect body.
    const timer = setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchLogs]);

  // Incoming realtime log: mark it, prepend while respecting the limit, and
  // bump the total. `limit` is a dependency so the handler stays in sync with
  // the current limit without reading stale state.
  const onLogReceived = useCallback(
    (log: LogEvent) => {
      realtimeLogIds.current.add(log.id);

      setLogs((previous) => [
        { ...log, isRealtime: true },
        ...previous.slice(0, limit - 1),
      ]);

      setPagination((previous) => ({
        ...previous,
        total: previous.total + 1,
      }));
    },
    [limit],
  );

  useLogExplorerRealtime({ projectId, filtersRef, onLogReceived });

  const selectLog = useCallback((log: LogEvent) => {
    setSelectedLog((current) => (current?.id === log.id ? null : log));
  }, []);

  const closeLogDetail = useCallback(() => {
    setSelectedLog(null);
  }, []);

  return {
    logs,
    pagination,
    page,
    isLoading,

    selectedLog,

    filters,
    hasActiveFilters,

    limit,

    setPage,

    setFilter,
    clearFilters,
    setLimit,

    selectLog,
    closeLogDetail,

    refetch: fetchLogs,
  };
}
