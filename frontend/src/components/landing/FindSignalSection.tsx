// src/components/landing/FindSignalSection.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { LogEvent, LogFiltersState } from "@/src/domains/log";
import { LogFilters } from "@/src/domains/log-explorer";
import { matchesLogFilters } from "@/src/domains/log-explorer/utils/matchesLogFilters";

import {
  SIGNAL_EMPTY_FILTERS,
  SIGNAL_INJECTED_LOG,
  SIGNAL_SHOWCASE_LOGS,
} from "./find-signal.data";

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

function getRowTintClass(log: LogEvent, pulseDanger: boolean = false) {
  if (log.level.toLowerCase() === "fatal") {
    return `border-l-2 ${pulseDanger ? "bg-danger/30 transition-none" : "bg-danger/10 transition-colors duration-1000"}`;
  }
  return "border-l-2 border-l-transparent";
}

function ShowcaseRow({
  log,
  matches,
  index,
  rowRef,
}: {
  log: LogEvent;
  matches: boolean;
  index: number;
  rowRef?: (el: HTMLDivElement | null) => void;
}) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [pulseDanger, setPulseDanger] = useState(
    log.isRealtime && log.id === SIGNAL_INJECTED_LOG.id,
  );

  useEffect(() => {
    if (pulseDanger) {
      const t = setTimeout(() => setPulseDanger(false), 800);
      return () => clearTimeout(t);
    }
  }, [pulseDanger]);

  useEffect(() => {
    const node = innerRef.current;
    if (!node || !log.isRealtime) return;

    const enter = node.animate(
      [
        {
          opacity: 0,
          transform:
            log.id === SIGNAL_INJECTED_LOG.id
              ? "translateY(-6px) scale(1.025)"
              : "translateY(-6px)",
        },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );

    return () => enter.cancel();
  }, [log.isRealtime, log.id]);

  return (
    <div
      ref={(el) => {
        innerRef.current = el;
        rowRef?.(el);
      }}
      className={`grid transition-all duration-700 ease-out ${
        matches ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      style={{ transitionDelay: `${Math.min(index * 30, 400)}ms` }}
    >
      <div className="overflow-hidden">
        <div
          className={`flex items-center gap-3 border-b border-border/50 px-3 py-1.5 ${getRowTintClass(log, pulseDanger)}`}
        >
          <span
            className={`w-14 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(log.level)}`}
          >
            {log.level}
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
            {log.event}
          </span>
          <span className="hidden shrink-0 truncate font-mono text-[10px] text-muted-foreground sm:block sm:max-w-30">
            {log.environment}
          </span>
        </div>
      </div>
    </div>
  );
}

const ENTRANCE_SETTLE_MS = 900;
const HOLD_ALL_MS = 2800;
const HOLD_FILTERED_MS = 4200;
const HOLD_SEARCH_MS = 3800;
const HOLD_RESET_MS = 2200;

type DemoPhase =
  | { kind: "all" }
  | { kind: "level"; value: string; inject?: boolean }
  | { kind: "search"; value: string }
  | { kind: "reset" };

const DEMO_SEQUENCE: DemoPhase[] = [
  { kind: "all" },
  { kind: "level", value: "error", inject: true },
  { kind: "search", value: "payment" },
  { kind: "reset" },
];

function phaseToFilters(phase: DemoPhase): LogFiltersState {
  switch (phase.kind) {
    case "all":
    case "reset":
      return { ...SIGNAL_EMPTY_FILTERS };
    case "level":
      return { ...SIGNAL_EMPTY_FILTERS, level: phase.value };
    case "search":
      return { ...SIGNAL_EMPTY_FILTERS, search: phase.value };
  }
}

function phaseDuration(phase: DemoPhase): number {
  switch (phase.kind) {
    case "all":
      return HOLD_ALL_MS;
    case "level":
      return HOLD_FILTERED_MS;
    case "search":
      return HOLD_SEARCH_MS;
    case "reset":
      return HOLD_RESET_MS;
  }
}

export function FindSignalSection() {
  const [hasEntered, setHasEntered] = useState(false);
  const [filters, setFilters] = useState<LogFiltersState>(SIGNAL_EMPTY_FILTERS);
  const [logs, setLogs] = useState<LogEvent[]>(SIGNAL_SHOWCASE_LOGS);

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredRef = useRef(false);
  const demoStartedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const injectedRef = useRef(false);

  // --- Entrance: once-only viewport reveal (decoupled from filter demo) ---
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

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer.disconnect();
      triggerEntrance();
    }

    return () => observer.disconnect();
  }, []);

  // --- Filter demo: starts only after entrance settles ---
  useEffect(() => {
    if (!hasEntered) return;
    if (demoStartedRef.current) return;
    demoStartedRef.current = true;

    let phaseIndex = 0;
    let cancelled = false;

    const runPhase = (phase: DemoPhase) => {
      if (cancelled) return;

      const getSearchInput = () =>
        sectionRef.current?.querySelector(
          'input[aria-label="Search logs"]',
        ) as HTMLInputElement | null;

      if (phase.kind === "reset") {
        injectedRef.current = false;

        // Typewriter delete
        let currentText =
          filters.search ||
          phaseToFilters({ kind: "search", value: "payment" }).search ||
          "payment";
        const deleteChar = () => {
          if (cancelled) return;
          if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            setFilters((prev) => ({ ...prev, search: currentText }));
            timersRef.current.push(setTimeout(deleteChar, 35));
          } else {
            setLogs(SIGNAL_SHOWCASE_LOGS);
            setFilters(phaseToFilters(phase));
            const input = getSearchInput();
            if (input) input.blur();
          }
        };
        deleteChar();
      } else if (phase.kind === "all") {
        setLogs(SIGNAL_SHOWCASE_LOGS);
        setFilters(phaseToFilters(phase));
      } else if (phase.kind === "level") {
        setFilters(phaseToFilters(phase));
        if (phase.inject && !injectedRef.current) {
          timersRef.current.push(
            setTimeout(() => {
              if (cancelled || injectedRef.current) return;
              injectedRef.current = true;
              setLogs((prev) => {
                if (prev.some((l) => l.id === SIGNAL_INJECTED_LOG.id))
                  return prev;
                return [SIGNAL_INJECTED_LOG, ...prev];
              });
            }, 1200),
          );
        }
      } else if (phase.kind === "search") {
        setFilters({ ...phaseToFilters(phase), search: "" });
        const input = getSearchInput();
        if (input) input.focus({ preventScroll: true });

        let currentText = "";
        const targetText = phase.value;
        let index = 0;

        const typeChar = () => {
          if (cancelled) return;
          if (index < targetText.length) {
            currentText += targetText[index];
            setFilters((prev) => ({ ...prev, search: currentText }));
            index++;
            timersRef.current.push(
              setTimeout(typeChar, 60 + Math.random() * 50),
            );
          }
        };
        timersRef.current.push(setTimeout(typeChar, 300));
      }
    };

    const advance = () => {
      if (cancelled) return;

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      const phase = DEMO_SEQUENCE[phaseIndex];
      runPhase(phase);
      timersRef.current.push(
        setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % DEMO_SEQUENCE.length;
          advance();
        }, phaseDuration(phase)),
      );
    };

    timersRef.current.push(setTimeout(advance, ENTRANCE_SETTLE_MS));

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [hasEntered]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.search.trim() ||
        filters.level ||
        filters.environment ||
        filters.from ||
        filters.to,
      ),
    [filters],
  );

  const matchingCount = useMemo(
    () => logs.filter((log) => matchesLogFilters(log, filters)).length,
    [logs, filters],
  );

  const handleFilterChange = (key: keyof LogFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ ...SIGNAL_EMPTY_FILTERS });
  };

  return (
    <section ref={sectionRef} className="w-full overflow-hidden py-32 lg:py-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered editorial heading */}
        <div
          className={`mx-auto max-w-2xl text-center ${
            hasEntered ? "animate-section-heading" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-pretty">
            Find the <span className="text-primary">signal.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Filter the noise without losing the context.
          </p>
        </div>

        {/* Wide centered product showcase */}
        <div
          className={`relative mx-auto mt-14 w-full max-w-5xl sm:mt-16 lg:mt-20 ${
            hasEntered ? "animate-section-visual" : "opacity-0"
          }`}
        >
          <div className="@container overflow-hidden rounded-lg border border-border bg-surface">
            {/* Filter toolbar — real LogFilters component */}
            <div className="border-b border-border pt-3">
              <LogFilters
                search={filters.search}
                level={filters.level}
                environment={filters.environment}
                from={filters.from}
                to={filters.to}
                hasActiveFilters={hasActiveFilters}
                totalEvents={matchingCount}
                onSearchChange={(value) => handleFilterChange("search", value)}
                onLevelChange={(value) => handleFilterChange("level", value)}
                onEnvironmentChange={(value) =>
                  handleFilterChange("environment", value)
                }
                onFromChange={(value) => handleFilterChange("from", value)}
                onToChange={(value) => handleFilterChange("to", value)}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Log stream — the viewport height is driven by an invisible
                "sizing ghost" that always renders the full unfiltered list,
                so collapsing/expanding the real rows never changes the panel
                height (and never moves the content below). */}
            <div className="min-h-70 overflow-x-auto sm:min-h-80">
              <div className="relative min-w-85">
                {/* Sizing ghost — invisible, in normal flow, keeps the
                    viewport at its full-list height during every phase. */}
                <div aria-hidden className="pointer-events-none invisible">
                  <div className="flex items-center gap-3 border-b border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="w-14 shrink-0">Level</span>
                    <span className="min-w-0 flex-1">Event</span>
                    <span className="hidden w-30 shrink-0 sm:block">
                      Environment
                    </span>
                  </div>
                  {SIGNAL_SHOWCASE_LOGS.map((log, index) => (
                    <ShowcaseRow
                      key={`ghost-${log.id}`}
                      log={log}
                      index={index}
                      matches={true}
                    />
                  ))}
                </div>

                {/* Live rows — absolutely positioned over the ghost so row
                    transitions animate inside the fixed-height viewport. */}
                <div className="absolute inset-0">
                  <div className="flex items-center gap-3 border-b border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="w-14 shrink-0">Level</span>
                    <span className="min-w-0 flex-1">Event</span>
                    <span className="hidden w-30 shrink-0 sm:block">
                      Environment
                    </span>
                  </div>

                  {logs.map((log, index) => (
                    <ShowcaseRow
                      key={log.id}
                      log={log}
                      index={index}
                      matches={matchesLogFilters(log, filters)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subtle edge fades — intentional crop on narrow viewports */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background/80 to-transparent sm:w-12"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-background/60 to-transparent"
          />
        </div>

        {/* Explanatory copy — structured events */}
        <div
          className={`mx-auto mt-12 max-w-2xl sm:mt-14 lg:mt-16 ${
            hasEntered ? "animate-section-copy" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            Structured events, searchable by design
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every log in Delok carries real structure —{" "}
            <span className="font-mono text-foreground">level</span>,{" "}
            <span className="font-mono text-foreground">environment</span>,{" "}
            <span className="font-mono text-foreground">timestamp</span>,{" "}
            <span className="font-mono text-foreground">message</span>, and a
            full <span className="font-mono text-foreground">payload</span> — so
            you can search by what actually happened, not guess at keywords.
          </p>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground sm:text-[15px]">
            <li>
              Every event carries its full context —{" "}
              <span className="font-mono text-foreground">level</span>,{" "}
              <span className="font-mono text-foreground">environment</span>,
              and a structured JSON{" "}
              <span className="font-mono text-foreground">payload</span>, not
              just a raw message string.
            </li>
            <li>
              Filter and search by exact fields, like{" "}
              <span className="font-mono text-foreground">level:error</span> or{" "}
              <span className="font-mono text-foreground">
                environment:production
              </span>
              , instead of scanning through unstructured text.
            </li>
            <li>
              Narrow to a specific window with date-range filters, so you can
              isolate exactly when something happened.
            </li>
            <li>
              Open any log to inspect its full{" "}
              <span className="font-mono text-foreground">payload</span> — every
              field arrives readable and complete, never truncated.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
