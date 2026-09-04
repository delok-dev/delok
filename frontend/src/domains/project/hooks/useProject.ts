// src/domains/project/hooks/useProject.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectService } from "../api/project.service";

export function useProject(organizationSlug: string, projectId: string) {
  const query = useQuery({
    queryKey: ["project", organizationSlug, projectId],
    queryFn: () => ProjectService.getById(organizationSlug, projectId),
    enabled: Boolean(organizationSlug && projectId),
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
