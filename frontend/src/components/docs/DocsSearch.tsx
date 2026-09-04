// src/components/docs/DocsSearch.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

type DocsEntry = {
  title: string;
  description: string;
  href: string;
  section: string;
};

const DOCS_ENTRIES: DocsEntry[] = [
  {
    title: "Introduction",
    description:
      "Learn what Delok is and how it helps you monitor your application logs.",
    href: ROUTES.DOCS.INTRODUCTION,
    section: "Getting Started",
  },
  {
    title: "Quickstart",
    description: "Send your first log with the Delok SDK.",
    href: ROUTES.DOCS.QUICKSTART,
    section: "Getting Started",
  },
  {
    title: "Installation",
    description: "Install the Delok SDK.",
    href: ROUTES.DOCS.INSTALLATION,
    section: "SDK",
  },
  {
    title: "Logging",
    description:
      "Send logs with info, warn, error, fatal — with structured payloads.",
    href: ROUTES.DOCS.LOGGING,
    section: "SDK",
  },
  {
    title: "Log Event",
    description: "Understand the structure of a log event sent to Delok.",
    href: ROUTES.DOCS.REFERENCE_LOG_EVENT,
    section: "Reference",
  },
  {
    title: "Documentation",
    description:
      "Everything you need to start sending and understanding logs with Delok.",
    href: ROUTES.DOCS.ROOT,
    section: "Overview",
  },
];

function matches(entry: DocsEntry, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const hay =
    `${entry.title} ${entry.description} ${entry.section} ${entry.href}`.toLowerCase();
  // Support multi-word query: all tokens must be present
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((t) => hay.includes(t));
}

export function DocsSearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Initial state: show useful destinations
      return DOCS_ENTRIES.filter((e) => e.href !== ROUTES.DOCS.ROOT).slice(0, 5);
    }
    return DOCS_ENTRIES.filter((e) => matches(e, query));
  }, [query]);

  useEffect(() => {
    if (open) {
      setSelected(0);
      // Focus after mount
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    // Reset query when closing? Keep for next open, but spec shows initial state with useful destinations, so clear
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = filtered[selected];
      if (entry) handleSelect(entry.href);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 backdrop-blur-sm pt-[10vh] sm:p-6"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search documentation"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-sm font-medium text-foreground">
                No results found.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((entry, idx) => (
                <li key={entry.href}>
                  <button
                    type="button"
                    onClick={() => handleSelect(entry.href)}
                    onMouseEnter={() => setSelected(idx)}
                    className={`flex w-full flex-col rounded-lg px-3 py-3 text-left transition-colors ${
                      idx === selected
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">{entry.title}</span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-background/50 px-3 py-2 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">
            ↑↓ Navigate • Enter Select • Esc Close
          </span>
          <span className="sm:hidden">Tap to select • Esc Close</span>
          <span className="font-mono hidden sm:inline">⌘K</span>
        </div>
      </div>
    </div>
  );
}
