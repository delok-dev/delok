// src/domains/project/hooks/useProject.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectService } from "../api/project.service";

export function useProject(organizationSlug: string, projectSlug: string) {
  const query = useQuery({
    queryKey: ["project", organizationSlug, projectSlug],
    queryFn: () => ProjectService.getBySlug(organizationSlug, projectSlug),
    enabled: Boolean(organizationSlug && projectSlug),
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
