// src/components/landing/LogInvestigationSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  FileJson,
  MessageSquare,
  MousePointer2,
} from "lucide-react";

import type { LogEvent } from "@/src/domains/log";
import {
  formatLogDate,
  formatLogTime,
  formatLogTimestamp,
} from "@/src/domains/log";
import {
  INVESTIGATION_LOGS,
  SELECTED_LOG_ID,
} from "./delok-log-investigation.data";

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger";
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

// Mirrors LogEventRow tinting: fatal keeps a red wash, the selected row gets
// a white highlight border, everything else stays transparent.
function getRowTintClass(log: LogEvent, isSelected: boolean) {
  if (isSelected) {
    return `border border-white ${log.level === "fatal" ? "bg-danger/10" : ""}`;
  }
  if (log.level.toLowerCase() === "fatal") {
    return "border-l-2 bg-danger/10";
  }
  return "border-l-2 border-l-transparent";
}

function StreamRow({
  log,
  isSelected,
  rowRef,
}: {
  log: LogEvent;
  isSelected: boolean;
  rowRef?: (el: HTMLDivElement | null) => void;
}) {
  const hasMessage = Boolean(log.message);
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  return (
    <div
      ref={rowRef}
      className={`w-full flex items-center gap-3 px-3 py-1.5 text-left border-b border-border/50 ${getRowTintClass(log, isSelected)}`}
    >
      <span className="w-20 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogDate(log.occurredAt)}
      </span>

      <span className="w-16 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogTime(log.occurredAt)}
      </span>

      <span
        className={`w-12 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(log.level)}`}
      >
        {log.level}
      </span>

      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
        {log.event}
      </span>

      {(hasMessage || hasPayload) && (
        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {hasMessage && <MessageSquare className="h-3.5 w-3.5" />}
          {hasPayload && <FileJson className="h-3.5 w-3.5" />}
        </span>
      )}

      {isSelected && (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}
    </div>
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

function DetailPanel({ log }: { log: LogEvent }) {
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  return (
    <div
      className="h-full flex flex-col rounded-lg border border-border bg-surface overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <DetailItem label="Event">{log.event}</DetailItem>
          <DetailItem label="Level">{log.level}</DetailItem>
          <DetailItem label="Environment">{log.environment}</DetailItem>
          <DetailItem label="Occurred At">
            {formatLogTimestamp(log.occurredAt)}
          </DetailItem>
        </div>

        {log.message && (
          <section>
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

        {hasPayload && (
          <section>
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
  );
}

/** Rows the simulated cursor cycles through: error, warn, info, info. */
const DEMO_CYCLE_IDS = [
  "lg_01jbf2mac7e4g9h1j3k5", // payment.failed (error) — default selection
  "lg_01jbf2m8a5c2e7g9j1l3", // database.query.slow (warn)
  "lg_01jbf2m7q3x9k1n4r8t2", // request.completed (info)
  "lg_01jbf2mce9g6h1k3l5m7", // deploy.completed (info)
].filter((id) => INVESTIGATION_LOGS.some((log) => log.id === id));

const CURSOR_MOVE_MS = 650;
const CLICK_SETTLE_MS = 250;
const DWELL_MS = 3400;

export function LogInvestigationSection() {
  const [selectedId, setSelectedId] = useState(SELECTED_LOG_ID);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pulse, setPulse] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const compositionRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const startedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasEnteredRef = useRef(false);

  // --- Entrance: once-only viewport reveal (decoupled from cursor demo) ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEnteredRef.current) return;

    const triggerEntrance = () => {
      if (hasEnteredRef.current) return;
      hasEnteredRef.current = true;
      setHasEntered(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        triggerEntrance();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(section);

    // Fallback: already on screen at mount (large viewport / observer timing)
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      triggerEntrance();
    }

    return () => observer.disconnect();
  }, []);

  // --- Cursor demo: starts only after entrance has been triggered ---
  useEffect(() => {
    if (!hasEntered) return;
    if (DEMO_CYCLE_IDS.length === 0) return;
    if (startedRef.current) return;

    const composition = compositionRef.current;
    if (!composition) return;

    let cycleIndex = 0;

    const rowCenter = (id: string) => {
      const row = rowRefs.current[id];
      if (!row) return null;
      const r = row.getBoundingClientRect();
      const c = composition.getBoundingClientRect();
      return {
        // Stay within the VISIBLE sliver of the receded LOGS column (the
        // foreground details panel overlaps the right ~3/4 of it), roughly
        // over the timestamp/level cells.
        x: r.left - c.left + Math.min(r.width * 0.15, 60),
        y: r.top - c.top + r.height / 2,
      };
    };

    // Move the cursor to the next reachable row in the cycle, click it,
    // dwell, repeat. Never dies: unreachable rows are skipped, and if none
    // are reachable yet (refs not attached) the pass is retried.
    const step = () => {
      for (let i = 0; i < DEMO_CYCLE_IDS.length; i++) {
        cycleIndex = (cycleIndex + 1) % DEMO_CYCLE_IDS.length;
        const nextId = DEMO_CYCLE_IDS[cycleIndex];
        const target = rowCenter(nextId);
        if (!target) continue;

        setCursor(target);

        timersRef.current.push(
          setTimeout(() => {
            setSelectedId(nextId);
            setPulse({ ...target, key: Date.now() });
            timersRef.current.push(setTimeout(step, DWELL_MS));
          }, CURSOR_MOVE_MS + CLICK_SETTLE_MS),
        );
        return;
      }
      // Rows not measurable yet — retry instead of stopping the loop.
      timersRef.current.push(setTimeout(step, DWELL_MS));
    };

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const initial = rowCenter(DEMO_CYCLE_IDS[0]);
      if (initial) setCursor(initial); // appear instantly on the default row
      timersRef.current.push(setTimeout(step, DWELL_MS));
    };

    // Entrance animation is 700ms + 80ms stagger; wait for it to settle.
    const t = setTimeout(start, 900);
    timersRef.current.push(t);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [hasEntered]);

  const selectedLog =
    INVESTIGATION_LOGS.find((log) => log.id === selectedId) ??
    INVESTIGATION_LOGS[0];

  return (
    <section ref={sectionRef} className="w-full py-32 lg:py-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial heading */}
        <h2
          className={`max-w-3xl text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] ${
            hasEntered ? "animate-section-heading" : "opacity-0"
          }`}
        >
          Seeing <span className="text-primary">logs</span> is only the
          beginning.
        </h2>

        {/* Layered product showcase + copy column — one shared container,
            two explicit tracks (panels ~58% / copy ~32%) with a real
            column-gap (~10%) between them */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 gap-y-24 lg:grid-cols-[minmax(0,58%)_minmax(0,32%)] lg:gap-x-[10%] lg:gap-y-0 items-start">
          {/* Panel composition — explorer behind, details in front */}
          <div
            ref={compositionRef}
            className={`relative ${
              hasEntered ? "animate-section-visual" : "opacity-0"
            }`}
          >
            {/* Ambient brand glow behind the panel stack — anchored to the
                upper-left so it never sits under the Log Details panel's
                bottom fade zone (which dissolves to the page background). */}
            <div
              aria-hidden
              className="absolute -top-24 -left-28 w-[110%] h-[80%] opacity-[0.16] pointer-events-none"
              style={{
                background:
                  "radial-gradient(closest-side, var(--primary), transparent)",
              }}
            />

            {/* Log Explorer — receded background layer, fixed-size slot */}
            <div
              aria-hidden
              className="absolute top-0 left-0 w-[72%] h-65 opacity-60 rounded-lg bg-surface overflow-hidden border-transparent"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  logs
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  production
                </span>
              </div>
              {INVESTIGATION_LOGS.map((log) => (
                <StreamRow
                  key={log.id}
                  log={log}
                  isSelected={log.id === selectedId}
                  rowRef={(el) => {
                    rowRefs.current[log.id] = el;
                  }}
                />
              ))}
            </div>

            {/* Simulated cursor */}
            {cursor && (
              <div
                aria-hidden
                className="absolute z-20 pointer-events-none transition-all duration-650 ease-in-out"
                style={{ left: cursor.x, top: cursor.y }}
              >
                <MousePointer2 className="h-4 w-4 -translate-x-0.5 -translate-y-0.5 text-foreground/80 fill-foreground/80" />
              </div>
            )}

            {/* Click pulse at the cursor tip */}
            {pulse && (
              <span
                key={pulse.key}
                aria-hidden
                className="animate-click-pulse absolute z-20 h-7 w-7 rounded-full border-2 border-primary bg-primary/20 pointer-events-none"
                style={{ left: pulse.x, top: pulse.y }}
              />
            )}

            {/* Log Details — dominant foreground layer; fixed-size slot so
                varying content never reflows surrounding layout. Content
                scrolls/truncates internally, crossfade stays unclipped. */}
            <div className="relative z-10 ml-[18%] mt-10 h-120">
              <div
                key={selectedLog.id}
                className="animate-detail-crossfade absolute inset-0 overflow-hidden"
              >
                <DetailPanel log={selectedLog} />
              </div>
            </div>
          </div>

          {/* Copy column — second column of the shared container */}
          <div
            className={`space-y-12 ${
              hasEntered ? "animate-section-copy" : "opacity-0"
            }`}
          >
            <p className="text-lg leading-relaxed max-w-none lg:max-w-90">
              <span className="font-semibold text-primary">
                Every event carries its full context.
              </span>{" "}
              <span className="text-muted-foreground">
                Open any log to read its message and payload.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
