// src/components/docs/DocsHomeSearch.tsx
"use client";

import { Search } from "lucide-react";

export function DocsHomeSearch() {
  const open = () => {
    window.dispatchEvent(new CustomEvent("open-docs-search"));
  };

  return (
    <button
      type="button"
      onClick={open}
      className="mt-6 flex w-full max-w-xl items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground cursor-text"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span>Search documentation</span>
    </button>
  );
}
