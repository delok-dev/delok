// src/domains/organization/components/OrganizationCard.tsx
import Link from "next/link";
import { Building2 } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import type { Organization } from "../types/organization.type";

type OrganizationCardProps = {
  organization: Organization;
};

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link
      href={ROUTES.ORGANIZATION.PROJECTS(organization.slug)}
      className="
        group
        flex
        items-center
        justify-between
        rounded-md
        border
        border-border
        bg-surface
        px-4
        py-3
        transition-all
        hover:border-primary/50
        hover:bg-surface-hover
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="h-4 w-4" />
        </div>

        <span className="truncate text-sm font-medium text-foreground">
          {organization.name}
        </span>
      </div>
    </Link>
  );
}
