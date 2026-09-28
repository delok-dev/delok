// src/components/layout/topbar/OrganizationSwitcher.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import {
  CreateOrganizationModal,
  useOrganizations,
} from "@/src/domains/organization";
import { ROUTES } from "@/src/constants/routes";

type OrganizationSwitcherProps = {
  organizationSlug: string;
  organizationName: string;
};

export function OrganizationSwitcher({
  organizationSlug,
  organizationName,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const { organizations } = useOrganizations();
  const [open, setOpen] = useState(false);

  const currentOrganization = organizations.find(
    (org) => org.slug === organizationSlug,
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreated = (slug: string) => {
    setOpen(false);

    router.push(ROUTES.ORGANIZATION.PROJECTS(slug));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-surface-hover px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
      >
        <span className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
          {organizationName.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-45 truncate">
          {currentOrganization?.name ?? organizationName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-border bg-surface shadow-lg py-1.5">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Switch organization
            </p>
            <div className="flex flex-col gap-0.5 px-1.5 pt-1">
              {organizations.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  No other organizations
                </p>
              )}
              {organizations.map((org) => {
                const isCurrent = org.slug === organizationSlug;
                return (
                  <Link
                    key={org.id}
                    href={ROUTES.ORGANIZATION.PROJECTS(org.slug)}
                    onClick={handleClose}
                    className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors ${
                      isCurrent
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    <span className="flex items-center justify-center h-5 w-5 rounded bg-surface-hover text-[10px] font-semibold text-muted-foreground">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{org.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-1.5 border-t border-border pt-1.5">
              {/* The dropdown stays mounted while the modal is open, otherwise
                  the modal (rendered by this subtree) would unmount with it. */}
              <CreateOrganizationModal
                onCreated={(organization) =>
                  handleCreated(organization.slug)
                }
                trigger={(openModal) => (
                  <button
                    type="button"
                    onClick={openModal}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-surface-hover text-muted-foreground">
                      <Plus className="h-3 w-3" />
                    </span>
                    <span>Create organization</span>
                  </button>
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
