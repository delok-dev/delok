// src/views/orgs/organization/projects/project/settings/ProjectSettingsPage.tsx
"use client";

import { useParams } from "next/navigation";

import { FolderX } from "lucide-react";

import EmptyState from "@/src/components/ui/EmptyState";

import { ProjectBreadcrumb, useProject } from "@/src/domains/project";

import ProjectSettingsLoading from "./ProjectSettingsLoading";
import { ProjectSettingsView } from "./ProjectSettingsView";

export default function ProjectSettingsPage() {
  const { organizationSlug, projectId } = useParams<{
    organizationSlug: string;
    projectId: string;
  }>();

  const { project, isLoading, isError } = useProject(
    organizationSlug,
    projectId,
  );

  if (isLoading) {
    return <ProjectSettingsLoading />;
  }

  if (isError || !project) {
    return (
      <div className="flex items-center justify-center">
        <EmptyState
          icon={<FolderX className="h-6 w-6" />}
          title="Project not found"
          description="This project doesn't belong to this organization or you don't have permission to access it."
        />
      </div>
    );
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="w-full max-w-4xl px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
          <ProjectBreadcrumb
            organizationSlug={organizationSlug}
            projectId={projectId}
            projectName={project.name}
            settings
          />
        </div>
      </header>

      <ProjectSettingsView
        organizationSlug={organizationSlug}
        projectId={projectId}
        project={project}
      />
    </div>
  );
}
