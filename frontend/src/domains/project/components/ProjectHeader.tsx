// src/domains/project/components/ProjectHeader.tsx
import Link from "next/link";
import { Settings } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";

import { ProjectBreadcrumb } from "./ProjectBreadcrumb";

type ProjectHeaderProps = {
  organizationSlug: string;
  projectId: string;
  projectName: string;
};

export function ProjectHeader({
  organizationSlug,
  projectId,
  projectName,
}: ProjectHeaderProps) {
  return (
    <header className="sticky top-0 z-99 shrink-0 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <ProjectBreadcrumb
          organizationSlug={organizationSlug}
          projectId={projectId}
          projectName={projectName}
        />

        <Link
          href={ROUTES.ORGANIZATION.PROJECT_SETTINGS(organizationSlug, projectId)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Link>
      </div>
    </header>
  );
}
