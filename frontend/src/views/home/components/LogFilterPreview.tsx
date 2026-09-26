// src/views/home/components/LogFilterPreview.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warn" },
  { value: "error", label: "Error" },
  { value: "fatal", label: "Fatal" },
];

const ENVIRONMENT_OPTIONS = [
  { value: "", label: "All environments" },
  { value: "development", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

type LogFilterPreviewProps = {
  search: string;
  level: string;
  environment: string;
  from: string;
  to: string;
  hasActiveFilters: boolean;
  totalEvents: number;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClearFilters: () => void;
};

const FIELD =
  "rounded-md border border-border bg-surface text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

export function LogFilterPreview({
  search,
  level,
  environment,
  from,
  to,
  hasActiveFilters,
  totalEvents,
  onSearchChange,
  onLevelChange,
  onEnvironmentChange,
  onFromChange,
  onToChange,
  onClearFilters,
}: LogFilterPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 px-3">
      {/* Compact mode (< @2xl container): collapsible filter box */}
      <div className="@2xl:hidden flex flex-wrap items-center gap-x-1 gap-y-1 rounded-md border border-border bg-surface py-1 pl-1.5 pr-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="log-filters-preview"
          onClick={() => setOpen((v) => !v)}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary">
              {totalEvents}
            </span>
          )}
          <ChevronDown
            className={`h-3 w-3 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <span className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">
          <span className="font-bold">{totalEvents}</span>{" "}
          {hasActiveFilters ? "matching" : "total"} events
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded panel (< @2xl container, while open) */}
      {open && (
        <div
          id="log-filters-preview"
          className="@2xl:hidden mt-2 space-y-2 rounded-md border border-border bg-surface p-3"
        >
          <input
            type="text"
            placeholder="Search event or message…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${FIELD} w-full py-1.5 pl-8 pr-2.5`}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Filter by level"
              value={level}
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            >
              {LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by environment"
              value={environment}
              onChange={(e) => onEnvironmentChange(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            >
              {ENVIRONMENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              aria-label="From date"
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              className={`${FIELD} w-full py-1.5`}
            />
            <input
              type="date"
              aria-label="To date"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className={`${FIELD} w-full py-1.5`}
            />
          </div>
        </div>
      )}

      {/* Wide mode (>= @2xl container): inline toolbar */}
      <div className="hidden @2xl:flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <div className="relative min-w-45 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search event or message…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${FIELD} w-full py-1.5 pl-8 pr-2.5`}
          />
        </div>
        <select
          aria-label="Filter by level"
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        >
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by environment"
          value={environment}
          onChange={(e) => onEnvironmentChange(e.target.value)}
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        >
          {ENVIRONMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="date"
            aria-label="From date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className={`${FIELD} w-full py-1.5`}
          />
          <input
            type="date"
            aria-label="To date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className={`${FIELD} w-full py-1.5`}
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}