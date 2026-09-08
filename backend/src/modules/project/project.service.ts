// /src/modules/project/project.service.ts

import { delok } from "../../lib/delok.js";
import {
  ensureOrganizationMember,
  ensureOrganizationOwner,
} from "../organization/organization.authorization.js";
import {
  createProject,
  deleteProject,
  findAllProjects,
  updateProject,
} from "./project.repository.js";
import { ensureProjectInOrganization } from "./project.authorization.js";

/**
 * Create new project inside organization.
 *
 * User must be organization owner.
 */
export const createProjectService = async (
  name: string,
  userId: string,
  organizationSlug: string,
) => {
  const organization = await ensureOrganizationOwner(organizationSlug, userId);

  const project = await createProject(name, organization.organizationId);
  delok.info({
    event: "project.created",
    message: `Project created: ${project.name}`,
    payload: {
      projectId: project.id,
      organizationId: organization.organizationId,
      organizationSlug,
      userId,
    },
  });
  return project;
};

/**
 * Get all projects inside organization.
 *
 * User must be organization member.
 */
export const getAllProjectsService = async (
  organizationSlug: string,
  userId: string,
) => {
  const organization = await ensureOrganizationMember(organizationSlug, userId);

  return await findAllProjects(organization.id);
};

/**
 * Get project detail inside an organization.
 *
 * User must:
 * - be a member of the organization in the URL.
 *
 * The project must belong to that organization, otherwise the request is
 * rejected with non-leaking 404 semantics.
 */
export const getProjectByIdService = async (
  organizationSlug: string,
  projectId: string,
  userId: string,
) => {
  const organization = await ensureOrganizationMember(organizationSlug, userId);

  return ensureProjectInOrganization(projectId, organization.id);
};

/**
 * Update project inside an organization.
 *
 * User must:
 * - be an owner of the organization in the URL.
 *
 * The project must belong to that organization.
 */
export const updateProjectService = async (
  organizationSlug: string,
  projectId: string,
  userId: string,
  name: string,
) => {
  const member = await ensureOrganizationOwner(organizationSlug, userId);

  await ensureProjectInOrganization(projectId, member.organizationId);

  const project = await updateProject(projectId, name);
  delok.info({
    event: "project.updated",
    message: `Project updated: ${project.name}`,
    payload: { projectId: project.id, organizationId: member.organizationId, userId },
  });
  return project;
};

/**
 * Delete project inside an organization.
 *
 * User must:
 * - be an owner of the organization in the URL.
 *
 * The project must belong to that organization.
 */
export const deleteProjectService = async (
  organizationSlug: string,
  projectId: string,
  userId: string,
) => {
  const member = await ensureOrganizationOwner(organizationSlug, userId);

  await ensureProjectInOrganization(projectId, member.organizationId);

  const project = await deleteProject(projectId);
  delok.info({
    event: "project.deleted",
    message: `Project deleted: ${project.name}`,
    payload: { projectId: project.id, organizationId: member.organizationId, userId },
  });
  return project;
};
