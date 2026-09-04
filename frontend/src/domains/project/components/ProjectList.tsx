// src/domains/project/components/ProjectList.tsx
import { ProjectCard } from "./ProjectCard";

import type { Project } from "../types/project.type";

type ProjectListProps = {
  projects: Project[];
  organizationSlug: string;
};

export function ProjectList({ projects, organizationSlug }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          organizationSlug={organizationSlug}
        />
      ))}
    </div>
  );
}
