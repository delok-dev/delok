// src/domains/project/types/project.type.ts
export type Project = {
  id: string;
  name: string;
  organizationId: string;
  logCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProjectInput = {
  name: string;
};

export type UpdateProjectInput = {
  name: string;
};
