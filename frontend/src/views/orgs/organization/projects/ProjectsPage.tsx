// src/views/orgs/organization/projects/ProjectsPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  CreateProjectModal,
  ProjectEmptyState,
  ProjectList,
  ProjectListSkeleton,
  useProjects,
  useProjectsRealtime,
} from "@/src/domains/project";
import { clearLastProjectId } from "@/src/constants/storage";

const SORT_OPTIONS = [
  { value: "created-desc", label: "Newest created" },
  { value: "created-asc", label: "Oldest created" },
  { value: "updated-desc", label: "Recently updated" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

function getTimestamp(value?: string) {
  return value ? new Date(value).getTime() : 0;
}

export default function ProjectsPage() {
  const params = useParams<{
    organizationSlug: string;
  }>();

  const organizationSlug = params.organizationSlug;

  const { projects, isLoading } = useProjects(organizationSlug);

  const [sortBy, setSortBy] = useState<SortOption>("created-desc");

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      switch (sortBy) {
        case "created-asc":
          return getTimestamp(a.createdAt) - getTimestamp(b.createdAt);
        case "updated-desc":
          return getTimestamp(b.updatedAt) - getTimestamp(a.updatedAt);
        default:
          return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
      }
    });
  }, [projects, sortBy]);

  const projectIds = useMemo(
    () => sortedProjects.map((p) => p.id),
    [sortedProjects],
  );

  useProjectsRealtime({ organizationSlug, projectIds });

  useEffect(() => {
    clearLastProjectId(organizationSlug);
  }, [organizationSlug]);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col p-4 sm:p-6">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground sm:text-lg">
            Projects
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!isLoading && (
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
              {projects.length} total
            </span>
          )}

          {!isLoading && projects.length > 1 && (
            <div className="relative">
              <select
                aria-label="Sort projects"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="cursor-pointer appearance-none rounded-md border border-border bg-surface px-2 pr-8 py-1.5 text-xs text-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}

          <CreateProjectModal organizationSlug={organizationSlug} />
        </div>
      </header>

      {/* Content */}
      <section className="flex flex-1 flex-col">
        {isLoading && <ProjectListSkeleton />}

        {!isLoading && projects.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <ProjectEmptyState />
          </div>
        )}

        {!isLoading && projects.length > 0 && (
          <ProjectList
            projects={sortedProjects}
            organizationSlug={organizationSlug}
          />
        )}
      </section>
    </div>
  );
}
