// src/domains/log-explorer/components/LogsPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, KeyRound } from "lucide-react";

import EmptyState from "@/src/components/ui/EmptyState";
import Loader from "@/src/components/ui/Loader";

import { LogDetailPanel, LogEventRow } from "@/src/domains/log";

import { LogFilters } from "./LogFilters";

import type {
  LogEvent,
  LogFiltersState,
  LogPagination,
} from "@/src/domains/log";

const MIN_DRAWER_WIDTH = 384;
const MAX_DRAWER_WIDTH = 720;
const DEFAULT_DRAWER_WIDTH = 384;
const CLOSE_DRAG_OFFSET = 80;
// The log list always keeps at least this much width (matches the CSS cap
// @2xl:max-w-[calc(100%_-_280px)] on the drawer).
const MIN_LIST_WIDTH = 280;

type LogsPanelData = {
  logs: LogEvent[];
  pagination: LogPagination;
  isLoading: boolean;
  page: number;
  selectedLog: LogEvent | null;
  filters: LogFiltersState;
  hasActiveFilters: boolean;
  limit: number;
};

type LogsPanelActions = {
  onPageChange: (page: number) => void;
  onSelectLog: (log: LogEvent) => void;
  onCloseDetail: () => void;
  onFilterChange: (key: keyof LogFiltersState, value: string) => void;
  onClearFilters: () => void;
  onLimitChange: (limit: number) => void;
};

type LogsPanelProps = {
  data: LogsPanelData;
  actions: LogsPanelActions;

  /**
   * Where users manage API keys for this project (linked from the empty
   * state when the project has never received a log).
   */
  settingsUrl: string;
};

export function LogsPanel({ data, actions, settingsUrl }: LogsPanelProps) {
  const {
    logs,
    pagination,
    isLoading,
    page,
    selectedLog,
    filters,
    hasActiveFilters,
    limit,
  } = data;

  const {
    onPageChange,
    onSelectLog,
    onCloseDetail,
    onFilterChange,
    onClearFilters,
    onLimitChange,
  } = actions;

  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    x: number;
    width: number;
    closeTriggered: boolean;
  } | null>(null);

  // Track the log panel container width so the drawer can never exceed it
  // (keeps the list >= MIN_LIST_WIDTH and prevents right-edge overflow).
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;

      setContainerWidth(width);
      setDrawerWidth((current) =>
        Math.min(
          current,
          Math.max(DEFAULT_DRAWER_WIDTH, width - MIN_LIST_WIDTH),
        ),
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const effectiveMaxDrawerWidth = Math.min(
    MAX_DRAWER_WIDTH,
    Math.max(DEFAULT_DRAWER_WIDTH, containerWidth - MIN_LIST_WIDTH),
  );

  const clampDrawerWidth = (value: number) =>
    Math.min(effectiveMaxDrawerWidth, Math.max(MIN_DRAWER_WIDTH, value));

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragRef.current = {
      x: e.clientX,
      width: drawerWidth,
      closeTriggered: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current) return;

      const deltaX = moveEvent.clientX - dragRef.current.x;
      const next = dragRef.current.width - deltaX;
      const clampedNext = clampDrawerWidth(next);

      if (clampedNext <= MIN_DRAWER_WIDTH) {
        setDrawerWidth(MIN_DRAWER_WIDTH);

        const intentionalCloseGesture = deltaX >= CLOSE_DRAG_OFFSET;

        if (intentionalCloseGesture && !dragRef.current.closeTriggered) {
          dragRef.current.closeTriggered = true;
          onCloseDetail();
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
          window.removeEventListener("pointercancel", handlePointerUp);
        }

        return;
      }

      setDrawerWidth(clampedNext);
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const handleResizeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    e.preventDefault();
    const step = e.shiftKey ? 64 : 16;
    const delta = e.key === "ArrowLeft" ? -step : step;

    setDrawerWidth(clampDrawerWidth(drawerWidth + delta));
  };

  return (
    <div ref={containerRef} className="@container flex h-full min-h-0 flex-col">
      {/* Header (hidden on compact containers - the filter bar takes over) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-md font-semibold text-foreground">Logs </h2>

          <p className="text-[10px] hidden @2xl:block text-muted-foreground">
            {hasActiveFilters ? (
              <>
                <span className="font-bold">{pagination.total}</span> matching
                events
              </>
            ) : (
              <>
                <span className="font-bold ">{pagination.total}</span> total
                events
              </>
            )}
          </p>
        </div>
      </div>

      <LogFilters
        search={filters.search}
        level={filters.level}
        environment={filters.environment}
        from={filters.from}
        to={filters.to}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={(value) => onFilterChange("search", value)}
        onLevelChange={(value) => onFilterChange("level", value)}
        onEnvironmentChange={(value) => onFilterChange("environment", value)}
        onFromChange={(value) => onFilterChange("from", value)}
        onToChange={(value) => onFilterChange("to", value)}
        onClearFilters={onClearFilters}
        totalEvents={pagination.total}
      />

      {/* Log list + detail drawer */}
      <div className="relative flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Scrollable table (sticky header + rows scroll together) */}
          <div className="min-h-0 flex-1 overflow-auto">
            <div className="min-w-140">
              {/* Table Header */}
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="w-24 shrink-0">Date</span>
                <span className="w-20 shrink-0">Time</span>
                <span className="w-14 shrink-0">Level</span>
                <span className="w-36 shrink-0">Environment</span>
                <span className="flex-1">Event</span>
                <span className="w-8" />
              </div>

              {isLoading && (
                <div className="flex h-32 items-center justify-center">
                  <Loader label="Loading logs" />
                </div>
              )}

              {!isLoading && logs.length === 0 && (
                <EmptyState
                  bare
                  icon={<KeyRound className="h-6 w-6" />}
                  title={hasActiveFilters ? "No matching logs" : "No logs yet"}
                  description={
                    hasActiveFilters
                      ? "Try adjusting or clearing your filters."
                      : "Generate an API key and connect it to your project to start streaming events."
                  }
                  action={
                    hasActiveFilters ? undefined : (
                      // Styled like a primary Button but rendered as an anchor
                      // (a <button> inside a <Link> would nest interactive
                      // elements, which is invalid HTML).
                      <Link
                        href={settingsUrl}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Generate API key
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )
                  }
                  className="mx-auto my-16 w-full max-w-sm"
                />
              )}

              {!isLoading &&
                logs.map((log) => (
                  <LogEventRow
                    key={log.id}
                    log={log}
                    isSelected={selectedLog?.id === log.id}
                    onClick={() => onSelectLog(log)}
                  />
                ))}
            </div>
          </div>

          {/* Pagination (hidden entirely when the project has zero logs) */}
          {pagination.total > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border px-3 py-2 sm:justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">Show</span>

                <select
                  aria-label="Logs per page"
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="cursor-pointer rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                </select>

                <span className="text-[10px] text-muted-foreground">
                  per page
                </span>
              </div>

              <span className="text-[10px] text-muted-foreground">
                Page <span className="font-bold ">{page}</span> of{" "}
                <span className="font-bold ">
                  {Math.max(pagination.totalPages, 1)}
                </span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => onPageChange(page - 1)}
                  className="rounded-md p-1.5 hover:bg-surface-hover disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => onPageChange(page + 1)}
                  className="rounded-md p-1.5 hover:bg-surface-hover disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Backdrop (drawer overlays the list on narrow containers) */}
        {selectedLog && (
          <button
            type="button"
            aria-label="Close log details"
            onClick={onCloseDetail}
            className="absolute inset-0 z-10 bg-black/30 @2xl:hidden"
          />
        )}

        {/* Resize handle (wide containers only) */}
        {selectedLog && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize log details panel"
            aria-valuenow={drawerWidth}
            aria-valuemin={MIN_DRAWER_WIDTH}
            aria-valuemax={effectiveMaxDrawerWidth}
            tabIndex={0}
            onPointerDown={handleResizePointerDown}
            onKeyDown={handleResizeKeyDown}
            className="hidden w-2 shrink-0 cursor-col-resize touch-none select-none items-center justify-center bg-transparent outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/30 active:bg-primary/15 @2xl:flex"
          >
            <div className="h-10 w-0.5 rounded-full bg-border" />
          </div>
        )}

        {/* Detail Drawer */}
        {selectedLog && (
          <LogDetailPanel
            log={selectedLog}
            onClose={onCloseDetail}
            width={drawerWidth}
          />
        )}
      </div>
    </div>
  );
}
