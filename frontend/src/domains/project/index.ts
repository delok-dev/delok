// src/domains/project/index.ts
export {
  ProjectSettings,
  ProjectDangerZone,
  ProjectHeader,
  ProjectBreadcrumb,
  CreateProjectModal,
  ProjectCard,
  ProjectEmptyState,
  ProjectList,
  ProjectListSkeleton,
} from "./components";

export { ProjectService } from "./api/project.service";

export { useProjects } from "./hooks/useProjects";

export { useProject } from "./hooks/useProject";

export { useProjectSettings } from "./hooks/useProjectSettings";

export { useProjectsRealtime } from "./hooks/useProjectsRealtime";

export { projectSchema } from "./schemas/project.schema";

export type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "./types/project.type";
