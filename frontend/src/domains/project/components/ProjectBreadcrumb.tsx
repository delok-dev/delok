// src/domains/project/components/ProjectBreadcrumb.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";

type ProjectBreadcrumbProps = {
  organizationSlug: string;
  projectSlug: string;
  projectName: string;
  settings?: boolean;
};

export function ProjectBreadcrumb({
  organizationSlug,
  projectSlug,
  projectName,
  settings = false,
}: ProjectBreadcrumbProps) {
  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-xs">
      <Link
        href={ROUTES.ORGANIZATION.PROJECTS(organizationSlug)}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        Projects
      </Link>

      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />

      <Link
        href={ROUTES.ORGANIZATION.PROJECT(organizationSlug, projectSlug)}
        className={`min-w-0 truncate ${
          settings
            ? "text-muted-foreground hover:text-foreground"
            : "text-foreground font-medium"
        }`}
      >
        {projectName}
      </Link>

      {settings && (
        <>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />

          <span className="shrink-0 text-foreground font-medium">Settings</span>
        </>
      )}
    </nav>
  );
}
