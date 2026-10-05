// /src/modules/project/route/organization-project.route.ts

import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../../utils/async-handler.js";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectByIdController,
  getProjectBySlugController,
  updateProjectController,
} from "../project.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { projectSchema } from "../project.validation.js";

export const organizationProjectRoute = express.Router({ mergeParams: true });

/**
 * GET /api/organizations/:organizationSlug/projects
 * Get all projects inside an organization.
 *
 * User must be a member of the organization.
 */
organizationProjectRoute.get(
  "/",
  authMiddleware,
  asyncHandler(getAllProjectsController),
);

/**
 * POST /api/organizations/:organizationSlug/projects
 * Create a new project.
 *
 * User must be an owner of the organization.
 */
organizationProjectRoute.post(
  "/",
  authMiddleware,
  validate(projectSchema),
  asyncHandler(createProjectController),
);

/**
 * GET /api/organizations/:organizationSlug/projects/:projectSlug
 * Get a single project inside an organization by slug.
 *
 * User must be a member of the organization, and the project must belong to
 * that organization.
 */
organizationProjectRoute.get(
  "/:projectSlug",
  authMiddleware,
  asyncHandler(getProjectBySlugController),
);

/**
 * PATCH /api/organizations/:organizationSlug/projects/:projectSlug
 * Update a project.
 *
 * User must be an owner of the organization, and the project must belong to
 * that organization.
 */
organizationProjectRoute.patch(
  "/:projectSlug",
  authMiddleware,
  validate(projectSchema),
  asyncHandler(updateProjectController),
);

/**
 * DELETE /api/organizations/:organizationSlug/projects/:projectSlug
 * Delete a project.
 *
 * User must be an owner of the organization, and the project must belong to
 * that organization.
 */
organizationProjectRoute.delete(
  "/:projectSlug",
  authMiddleware,
  asyncHandler(deleteProjectController),
);

/**
 * GET /api/organizations/:organizationSlug/projects/by-id/:projectId
 * Get a single project inside an organization by id (internal use).
 *
 * User must be a member of the organization, and the project must belong to
 * that organization.
 */
organizationProjectRoute.get(
  "/by-id/:projectId",
  authMiddleware,
  asyncHandler(getProjectByIdController),
);
