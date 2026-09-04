// src/domains/project/hooks/useProjectSettings.ts
"use client";

import { showToast } from "@/src/components/ui/toast";

import { useProjects } from "./useProjects";

/**
 * Project settings actions for a single project: rename and delete. Reuses
 * the shared project mutations from `useProjects` so project API logic stays
 * owned by the project domain.
 *
 * The mutations are controlled directly by React Query: `mutateAsync` drives
 * the loading state (`isPending`) and the cache is synchronized in each
 * mutation's `onSuccess`, so the project name is only committed to the UI
 * after the API succeeds.
 *
 * This hook does NOT navigate. Where the user goes after a mutation is a
 * screen-level decision owned by the calling view.
 */
export function useProjectSettings(
  organizationSlug: string,
  projectId: string,
) {
  const { updateProject, deleteProject } = useProjects(organizationSlug);

  const renameProject = async (name: string) => {
    await updateProject.mutateAsync({ projectId, name });
  };

  const deleteProjectOnly = async () => {
    await deleteProject.mutateAsync(projectId);

    showToast({ message: "Project deleted", type: "success" });
  };

  return {
    renameProject,
    deleteProject: deleteProjectOnly,
    isRenaming: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  };
}
