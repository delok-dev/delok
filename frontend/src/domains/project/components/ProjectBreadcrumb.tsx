// src/domains/project/components/ProjectBreadcrumb.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";

type ProjectBreadcrumbProps = {
  organizationSlug: string;
  projectId: string;
  projectName: string;
  settings?: boolean;
};

export function ProjectBreadcrumb({
  organizationSlug,
  projectId,
  projectName,
  settings = false,
}: ProjectBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs">
      <Link
        href={ROUTES.ORGANIZATION.PROJECTS(organizationSlug)}
        className="text-muted-foreground hover:text-foreground"
      >
        Projects
      </Link>

      <ChevronRight className="h-3 w-3 text-muted-foreground" />

      <Link
        href={ROUTES.ORGANIZATION.PROJECT(organizationSlug, projectId)}
        className={
          settings
            ? "text-muted-foreground hover:text-foreground"
            : "text-foreground font-medium"
        }
      >
        {projectName}
      </Link>

      {settings && (
        <>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />

          <span className="text-foreground font-medium">Settings</span>
        </>
      )}
    </nav>
  );
}
