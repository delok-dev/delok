// src/views/orgs/components/GetStartedSection.tsx
"use client";

import { Building2, Link2 } from "lucide-react";

import { CreateOrganizationModal } from "../../../domains/organization/components/CreateOrganizationModal";

export function GetStartedSection() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
        Choose where to start
      </h2>

      <CreateOrganizationModal
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            className="group flex w-full items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary/50   hover:bg-surface-hover cursor-pointer"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </span>

            <span>
              <span className="block text-sm font-semibold text-foreground">
                Create a new organization
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Create an organization to manage your projects and logs.
              </span>
            </span>
          </button>
        )}
      />

      {/* Stub for future "join by invite" flow */}
      <button
        type="button"
        className="group flex w-full items-start gap-3 rounded-xl border border-dashed border-border bg-transparent p-4 text-left opacity-70 transition-opacity "
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
          <Link2 className="h-5 w-5" />
        </span>

        <span>
          <span className="block text-sm font-semibold text-foreground">
            Join an organization
          </span>

          <span className="mt-2 block text-xs text-muted-foreground font-bold">
            COMING SOON...
          </span>
        </span>
      </button>
    </div>
  );
}
