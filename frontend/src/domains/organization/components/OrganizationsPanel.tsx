// src/domains/organization/components/OrganizationsPanel.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { Organization } from "../types/organization.type";
import { OrganizationList } from "./OrganizationList";
import { OrganizationListSkeleton } from "./OrganizationListSkeleton";
import { OrganizationEmptyState } from "./OrganizationEmptyState";

type OrganizationsPanelProps = {
  organizations: Organization[];
  isLoading: boolean;
};

export function OrganizationsPanel({
  organizations,
  isLoading,
}: OrganizationsPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return organizations;

    return organizations.filter((organization) =>
      organization.name.toLowerCase().includes(query),
    );
  }, [organizations, search]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-10 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="rounded-xl border border-border bg-surface p-3">
        <div className="mb-4 flex items-center justify-between px-1 pt-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider  text-muted-foreground">
            Your Organizations
          </h2>

          {!isLoading && organizations.length > 0 && filtered.length > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              {filtered.length} of {organizations.length}
            </span>
          )}
        </div>

        {isLoading && <OrganizationListSkeleton />}

        {!isLoading && organizations.length === 0 && <OrganizationEmptyState />}

        {!isLoading && organizations.length > 0 && filtered.length === 0 && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No organizations match &ldquo;{search}&rdquo;.
          </p>
        )}

        {!isLoading && filtered.length > 0 && (
          <OrganizationList organizations={filtered} />
        )}
      </div>
    </div>
  );
}
