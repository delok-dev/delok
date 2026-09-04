// src/views/orgs/organization/projects/project/settings/ProjectSettingsView.tsx
"use client";

import { useRouter } from "next/navigation";

import {
  ProjectDangerZone,
  ProjectSettings,
  useProjectSettings,
} from "@/src/domains/project";

import { ApiKeyList, useProjectApiKeys } from "@/src/domains/api-key";

import type { Project } from "@/src/domains/project";
import { ROUTES } from "@/src/constants/routes";
import { formatDateTime } from "@/src/utils/format-date";

type ProjectSettingsViewProps = {
  organizationSlug: string;
  projectId: string;
  project: Project;
};

export function ProjectSettingsView({
  organizationSlug,
  projectId,
  project,
}: ProjectSettingsViewProps) {
  const router = useRouter();

  const { renameProject, deleteProject } = useProjectSettings(
    organizationSlug,
    projectId,
  );

  // Navigation after deletion is a screen-level decision: the domain only
  // performs the mutation; the view decides where the user goes next.
  const handleDeleteProject = async () => {
    await deleteProject();

    router.replace(ROUTES.ORGANIZATION.PROJECTS(organizationSlug));
  };

  const {
    apiKeys,
    isLoading: loadingKeys,
    createApiKey,
    renameApiKey,
    revokeApiKey,
  } = useProjectApiKeys(projectId);

  return (
    <div className="w-full max-w-4xl flex flex-col p-4 sm:p-6">
      <div className="space-y-10 sm:space-y-12">
        {/* Details */}
        {(project.createdAt || project.updatedAt) && (
          <section className="space-y-4">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.createdAt && (
                <div>
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(project.createdAt)}
                  </dd>
                </div>
              )}

              {project.updatedAt && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Last updated
                  </dt>
                  <dd className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(project.updatedAt)}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}
        <ProjectSettings projectName={project.name} onUpdate={renameProject} />

        <ApiKeyList
          apiKeys={apiKeys}
          isLoading={loadingKeys}
          onGenerate={(name) => createApiKey.mutateAsync(name)}
          onRename={(id, name) => renameApiKey.mutateAsync({ id, name })}
          onRevoke={(id) => revokeApiKey.mutateAsync(id)}
        />
      </div>

      <div className="mt-10 border-t border-border pt-6 sm:mt-12 sm:pt-8">
        <ProjectDangerZone
          projectName={project.name}
          onDelete={handleDeleteProject}
        />
      </div>
    </div>
  );
}
