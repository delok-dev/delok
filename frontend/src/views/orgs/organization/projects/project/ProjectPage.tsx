// src/views/orgs/organization/projects/project/ProjectPage.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import Button from "@/src/components/ui/Button";
import Loader from "@/src/components/ui/Loader";

import { ProjectHeader, useProject } from "@/src/domains/project";

import { LogExplorer } from "@/src/domains/log-explorer";

import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { setLastProjectId } from "@/src/constants/storage";

export default function ProjectPage() {
  const { organizationSlug, projectSlug } = useParams<{
    organizationSlug: string;
    projectSlug: string;
  }>();

  const {
    project,
    isLoading: loadingProject,
    isError,
  } = useProject(organizationSlug, projectSlug);

  console.log("ProjectPage", {
    organizationSlug,
    projectSlug,
    project,
    loadingProject,
    isError,
  });
  useEffect(() => {
    if (isError) {
      console.error("Failed to load project", {
        organizationSlug,
        projectSlug,
      });
    }
    if (loadingProject || isError || !project) {
      return;
    }

    setLastProjectId(organizationSlug, project.id);
  }, [isError, loadingProject, organizationSlug, project, projectSlug]);

  if (loadingProject) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader label="Loading project" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-sm font-semibold">Project not found</h1>

        <p className="mt-2 text-xs text-muted-foreground">
          This project doesn&apos;t belong to this organization or you
          don&apos;t have permission to access it.
        </p>

        <Link href={ROUTES.ORGANIZATION.PROJECTS(organizationSlug)}>
          <Button className="mt-5">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader
        organizationSlug={organizationSlug}
        projectSlug={project.slug}
        projectName={project.name}
      />

      <LogExplorer organizationSlug={organizationSlug} projectId={project.id} />
    </div>
  );
}
