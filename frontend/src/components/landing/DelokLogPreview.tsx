// src/components/landing/DelokLogPreview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, FileJson } from "lucide-react";
import type { LogEvent } from "@/src/domains/log";
import { formatLogDate, formatLogTime } from "@/src/domains/log";
import { DEMO_LOGS } from "./delok-log-preview.data";

const VISIBLE_LOG_COUNT = 22;

const MIN_INGEST_DELAY_MS = 2200;
const MAX_INGEST_DELAY_MS = 3500;

interface VisibleLog {
  log: LogEvent;
  /** Unique per insertion so recycled DEMO_LOGS entries get fresh React keys */
  seq: number;
  /** Presentation-only epoch ms (local time). Null until hydrated on the client. */
  displayTs: number | null;
}

/**
 * Deterministic "seconds ago" offsets for the initial visible rows, so they
 * look like a recent history of logs without ever touching DEMO_LOGS.
 */
const INITIAL_OFFSETS_SECONDS = [
  0, 3, 6, 10, 14, 19, 25, 32, 40, 49, 59, 70, 82, 95, 109, 124,
];

const toIso = (ts: number) => new Date(ts).toISOString();

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger";
    case "fatal":
      return "text-danger font-bold";
    case "warn":
      return "text-yellow-500";
    default:
      return "text-primary";
  }
}

// Matches real LogEventRow: only fatal gets a red tint, all others get transparent left border
function getRowTintClass(level: string) {
  if (level.toLowerCase() === "fatal") {
    return "border-l-2 bg-danger/10";
  }
  return "border-l-2 border-l-transparent";
}

function LogRow({
  log,
  displayTs,
  entering,
}: {
  log: LogEvent;
  displayTs: number | null;
  entering: boolean;
}) {
  const hasMessage = Boolean(log.message);
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  return (
    <div
      className={`h-full w-full flex items-center gap-3 px-3 text-left border-b border-border/50 ${getRowTintClass(log.level)} ${
        entering ? "animate-log-enter" : ""
      }`}
    >
      {/* Date */}
      <span className="w-24 shrink-0 text-[10px] font-mono text-muted-foreground">
        {displayTs === null ? "" : formatLogDate(toIso(displayTs))}
      </span>

      {/* Time */}
      <span className="w-20 shrink-0 text-[10px] font-mono text-muted-foreground">
        {displayTs === null ? "" : formatLogTime(toIso(displayTs))}
      </span>

      {/* Level */}
      <span
        className={`w-14 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(log.level)}`}
      >
        {log.level}
      </span>

      {/* Environment */}
      <span className="w-36 shrink-0 truncate text-[10px] font-mono text-muted-foreground">
        {log.environment}
      </span>

      {/* Event */}
      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
        {log.event}
      </span>

      {/* Indicators */}
      {(hasMessage || hasPayload) && (
        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {hasMessage && <MessageSquare className="h-3.5 w-3.5" />}
          {hasPayload && <FileJson className="h-3.5 w-3.5" />}
        </span>
      )}
    </div>
  );
}

export function DelokLogPreview() {
  // Rows inserted by the ingestion loop get seq >= VISIBLE_LOG_COUNT,
  // so only they play the entrance animation (initial rows appear statically).
  // The initial set always fills the full container by cycling DEMO_LOGS,
  // so the stream never renders partially-empty regardless of container size.
  const [visibleLogs, setVisibleLogs] = useState<VisibleLog[]>(() =>
    Array.from({ length: VISIBLE_LOG_COUNT }, (_, i) => ({
      log: DEMO_LOGS[i % DEMO_LOGS.length],
      seq: i,
      displayTs: null,
    })),
  );

  const nextLogIndexRef = useRef(VISIBLE_LOG_COUNT % DEMO_LOGS.length);
  const seqRef = useRef(VISIBLE_LOG_COUNT);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef(visibleLogs.length);

  useEffect(() => {
    countRef.current = visibleLogs.length;
  }, [visibleLogs.length]);

  // Hydration-safe: assign local-time timestamps only on the client after
  // mount, so server and first client render produce identical markup.
  const baseTimeRef = useRef<number | null>(null);
  useEffect(() => {
    baseTimeRef.current = Date.now();
    setVisibleLogs((prev) =>
      prev.map((entry, i) => ({
        ...entry,
        displayTs:
          baseTimeRef.current! -
          INITIAL_OFFSETS_SECONDS[i % INITIAL_OFFSETS_SECONDS.length] * 1000,
      })),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    function ingest() {
      if (cancelled) return;

      setVisibleLogs((prev) => {
        const log = DEMO_LOGS[nextLogIndexRef.current];
        nextLogIndexRef.current =
          (nextLogIndexRef.current + 1) % DEMO_LOGS.length;
        const seq = seqRef.current++;

        return [{ log, seq, displayTs: Date.now() }, ...prev].slice(
          0,
          VISIBLE_LOG_COUNT,
        );
      });

      const wasUnderCapacity = countRef.current < VISIBLE_LOG_COUNT;
      countRef.current = Math.min(countRef.current + 1, VISIBLE_LOG_COUNT);

      // Fast-fill if under capacity (e.g. after HMR), otherwise organic delay
      const delay = wasUnderCapacity
        ? 150
        : MIN_INGEST_DELAY_MS +
          Math.random() * (MAX_INGEST_DELAY_MS - MIN_INGEST_DELAY_MS);
      timeoutRef.current = setTimeout(ingest, delay);
    }

    const delay =
      MIN_INGEST_DELAY_MS +
      Math.random() * (MAX_INGEST_DELAY_MS - MIN_INGEST_DELAY_MS);
    timeoutRef.current = setTimeout(ingest, delay);

    return () => {
      cancelled = true;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden sm:overflow-visible">
      <div className="relative w-full min-w-[720px] -translate-x-[112px] sm:min-w-0 sm:w-full sm:translate-x-0 overflow-hidden rounded-lg bg-surface [overflow-anchor:none]">
        {/* Panel header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
            logs
          </span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">
            2,891 events
          </span>
        </div>

        {/* Log rows — stable height container, exactly VISIBLE_LOG_COUNT rows */}
        <div
          className="overflow-hidden"
          style={{
            height: `calc(${VISIBLE_LOG_COUNT} * var(--delok-log-row-h))`,
          }}
        >
          {visibleLogs.map((entry) => (
            <div
              key={`${entry.log.id}-${entry.seq}`}
              style={{ height: `${100 / VISIBLE_LOG_COUNT}%` }}
            >
              <LogRow
                log={entry.log}
                displayTs={entry.displayTs}
                entering={entry.seq >= VISIBLE_LOG_COUNT}
              />
            </div>
          ))}
        </div>

        {/* Gradient fades */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-60 rounded-b-lg bg-linear-to-t from-background via-background/60 to-transparent" />
          {/* Left */}
          <div className="absolute inset-y-0 left-0 w-20 rounded-l-lg bg-linear-to-r from-background via-background/70 to-transparent" />
          {/* Right */}
          <div className="absolute inset-y-0 right-0 w-20 rounded-r-lg bg-linear-to-l from-background via-background/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}
