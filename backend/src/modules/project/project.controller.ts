// /src/modules/project/project.controller.ts

import { Request, Response } from "express";
import {
  createProjectService,
  deleteProjectService,
  getAllProjectsService,
  getProjectByIdService,
  getProjectBySlugService,
  updateProjectService,
} from "./project.service.js";

/**
 * POST /api/organizations/:organizationSlug/projects
 *
 * Create a new project inside organization.
 */
export const createProjectController = async (req: Request, res: Response) => {
  const user = req.session.user;
  const { name } = req.body;
  const organizationSlug = String(req.params.organizationSlug);

  const data = await createProjectService(name, user, organizationSlug);
  res.status(201).json({
    success: true,
    data,
  });
};

/**
 * GET /api/organizations/:organizationSlug/projects
 *
 * Get all projects inside organization.
 */
export const getAllProjectsController = async (req: Request, res: Response) => {
  const organizationSlug = String(req.params.organizationSlug);
  const userId = req.session.user.id;

  const data = await getAllProjectsService(organizationSlug, userId);
  res.json({
    success: true,
    data,
  });
};

/**
 * GET /api/organizations/:organizationSlug/projects/:projectSlug
 *
 * Get project details by slug.
 */
export const getProjectBySlugController = async (req: Request, res: Response) => {
  const organizationSlug = String(req.params.organizationSlug);
  const projectSlug = String(req.params.projectSlug);
  const userId = req.session.user.id;

  const data = await getProjectBySlugService(organizationSlug, projectSlug, userId);
  res.json({
    success: true,
    data,
  });
};

/**
 * PATCH /api/organizations/:organizationSlug/projects/:projectSlug
 *
 * Update project by slug
 */
export const updateProjectController = async (req: Request, res: Response) => {
  const organizationSlug = String(req.params.organizationSlug);
  const projectSlug = String(req.params.projectSlug);
  const user = req.session.user;
  const name = req.body.name;

  // Resolve project by slug to get projectId for internal operations
  const project = await getProjectBySlugService(organizationSlug, projectSlug, user.id);

  const data = await updateProjectService(
    organizationSlug,
    project.id,
    user,
    name,
  );
  res.json({
    success: true,
    data,
  });
};

/**
 * DELETE /api/organizations/:organizationSlug/projects/:projectSlug
 *
 * delete project by slug
 */
export const deleteProjectController = async (req: Request, res: Response) => {
  const organizationSlug = String(req.params.organizationSlug);
  const projectSlug = String(req.params.projectSlug);
  const user = req.session.user;

  // Resolve project by slug to get projectId for internal operations
  const project = await getProjectBySlugService(organizationSlug, projectSlug, user.id);

  const data = await deleteProjectService(organizationSlug, project.id, user);
  res.json({
    success: true,
    data,
  });
};

/**
 * GET /api/organizations/:organizationSlug/projects/by-id/:projectId
 *
 * Get project details by id (internal use).
 */
export const getProjectByIdController = async (req: Request, res: Response) => {
  const organizationSlug = String(req.params.organizationSlug);
  const projectId = String(req.params.projectId);
  const userId = req.session.user.id;

  const data = await getProjectByIdService(organizationSlug, projectId, userId);
  res.json({
    success: true,
    data,
  });
};
