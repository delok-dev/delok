// src/domains/log/components/LogDetailPanel.tsx
"use client";

import { FileJson, MessageSquare, X } from "lucide-react";

import type { LogEvent } from "../types/log.type";
import { formatLogTimestamp } from "../utils/format";

type LogDetailPanelProps = {
  log: LogEvent | null;
  onClose: () => void;
  width?: number;
};

export function LogDetailPanel({
  log,
  onClose,
  width = 384,
}: LogDetailPanelProps) {
  if (!log) {
    return null;
  }

  return (
    <aside
      style={{ "--drawer-width": `${width}px` } as React.CSSProperties}
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm shrink-0 flex-col border-l border-border bg-surface shadow-2xl @2xl:static @2xl:z-auto @2xl:max-w-[calc(100%-280px)] @2xl:w-(--drawer-width) @2xl:shadow-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            Log Details
          </p>

          <p className="text-[10px] text-muted-foreground font-mono truncate">
            {log.id}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
          aria-label="Close log details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5 min-w-0">
          {/* Metadata — 2x2 grid spanning the panel width */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <DetailItem label="Event">{log.event}</DetailItem>

            <DetailItem label="Level">{log.level}</DetailItem>

            <DetailItem label="Environment">{log.environment}</DetailItem>

            <DetailItem label="Occurred At">
              {formatLogTimestamp(log.occurredAt)}
            </DetailItem>
          </div>

          {log.message && (
            <section className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />

                <h3 className="text-xs font-semibold">Message</h3>
              </div>

              <div className="rounded-md border border-border bg-background p-3 min-w-0 overflow-hidden">
                <p className="min-w-0 text-[11px] text-foreground whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
                  {log.message}
                </p>
              </div>
            </section>
          )}

          {log.payload && (
            <section className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileJson className="h-3.5 w-3.5 text-muted-foreground" />

                <h3 className="text-xs font-semibold">Payload</h3>
              </div>

              <pre className="min-w-0 overflow-x-auto rounded-md border border-border bg-background p-3 text-[10px] leading-relaxed font-mono text-muted-foreground whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>

      <p className="text-[11px] text-foreground wrap-break-word">{children}</p>
    </div>
  );
}
