// src/domains/log/components/LogEventRow.tsx
"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, FileJson, MessageSquare } from "lucide-react";

import type { LogEvent } from "../types/log.type";
import { formatLogDate, formatLogTime } from "../utils/format";

type LogEventRowProps = {
  log: LogEvent;
  onClick: () => void;

  isSelected?: boolean;
};

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger";

    // Fatal is the highest severity - bold red text on top of the red row
    // tint so it reads louder than a plain error.
    case "fatal":
      return "text-danger font-bold";

    case "warn":
      return "text-yellow-500";

    case "debug":
      return "text-muted-foreground";

    default:
      return "text-primary";
  }
}

function isDangerLevel(level: string) {
  return level.toLowerCase() === "error" || level.toLowerCase() === "fatal";
}

// Row tint carries meaning: fatal rows keep a persistent red wash so they
// stand apart from plain error rows, and the row currently open in the detail
// drawer gets a primary highlight (selection wins so the user always knows
// which log they pressed). The 2px left border is always present so rows keep
// perfect alignment; only its color changes.
function getRowTintClass(level: string, isSelected: boolean) {
  if (isSelected) {
    return `border border-white ${level === "fatal" ? "bg-danger/10" : ""}`;
  }

  if (level.toLowerCase() === "fatal") {
    return "border-l-2 bg-danger/10 hover:bg-danger/15";
  }

  return "border-l-2 border-l-transparent hover:bg-surface-hover";
}

export function LogEventRow({
  log,
  onClick,
  isSelected = false,
}: LogEventRowProps) {
  const rowRef = useRef<HTMLButtonElement | null>(null);

  const hasMessage = Boolean(log.message);
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  const hasDetails = hasMessage || hasPayload;

  const isRealtime = Boolean(log.isRealtime);

  // Flash the row the moment it appears (i.e. when it arrives over the
  // WebSocket). The animation is driven imperatively through the Web
  // Animations API so it is guaranteed to play on mount - a pure CSS class
  // can be silently suppressed by class detection, reduced-motion settings,
  // or keyframe parsing issues.
  useEffect(() => {
    const node = rowRef.current;

    if (!isRealtime || !node) {
      return;
    }

    // Danger levels flash red (mirrors --danger #ef4444) so a fresh error or
    // fatal log is immediately noticeable; everything else flashes green
    // (mirrors --success #22c55e) for a generic "new event" signal.
    //
    // The final keyframe for danger levels settles on the same rgba value as
    // the fatal row tint (bg-danger/10) so the flash ends seamlessly instead
    // of overriding the persistent background and snapping back to it.
    const flash = node.animate(
      isDangerLevel(log.level)
        ? [
            { backgroundColor: "rgba(239, 68, 68, 0.35)" },
            { backgroundColor: "rgba(239, 68, 68, 0.12)", offset: 0.7 },
            { backgroundColor: "rgba(239, 68, 68, 0.1)", offset: 1 },
          ]
        : [
            { backgroundColor: "rgba(34, 197, 94, 0.3)" },
            { backgroundColor: "rgba(34, 197, 94, 0.08)", offset: 0.7 },
            { backgroundColor: "rgba(34, 197, 94, 0)", offset: 1 },
          ],
      { duration: 1600, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );

    return () => {
      flash.cancel();
    };
  }, [isRealtime, log.level]);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-1 @2xl:py-1.5 text-left border-b border-border/50 transition-colors ${getRowTintClass(
        log.level,
        isSelected,
      )}`}
    >
      <span className="w-24 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogDate(log.occurredAt)}
      </span>

      <span className="w-20 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogTime(log.occurredAt)}
      </span>

      <span
        className={`w-14 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(
          log.level,
        )}`}
      >
        {log.level}
      </span>

      <span className="w-36 shrink-0 truncate text-[10px] font-mono text-muted-foreground">
        {log.environment}
      </span>

      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
        {log.event}
      </span>

      {hasDetails && (
        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {hasMessage && <MessageSquare className="h-3.5 w-3.5" />}

          {hasPayload && <FileJson className="h-3.5 w-3.5" />}
        </span>
      )}

      {isSelected && (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground" />
      )}
    </button>
  );
}
