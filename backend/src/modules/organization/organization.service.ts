// /src/modules/organization/organization.service.ts

import { generateSlug } from "../../utils/generate-slug.js";
import { delok } from "../../lib/delok.js";
import {
  ensureOrganizationMember,
  ensureOrganizationOwner,
} from "./organization.authorization.js";

import {
  createOrganization,
  deleteOrganization,
  findAllOrganizations,
  updateOrganization,
} from "./organization.repository.js";

/**
 * Create new organization.
 */
export const createOrganizationService = async (
  name: string,
  userId: string,
) => {
  const slug = generateSlug(name);
  const organization = await createOrganization(name, slug, userId);
  delok.info({
    event: "organization.created",
    message: `Organization created: ${organization.name}`,
    payload: { organizationId: organization.id, slug: organization.slug, userId },
  });
  return organization;
};

/**
 * Get all organizations belong to current user.
 */
export const getAllOrganizationService = async (userId: string) => {
  return findAllOrganizations(userId);
};

/**
 * Get organization by slug.
 *
 *
 * User must be a member of organization
 */
export const getOrganizationBySlugService = async (
  slug: string,
  userId: string,
) => {
  return ensureOrganizationMember(slug, userId);
};

/**
 * Update organization by slug.
 *
 *
 * User must be owner of organization
 */
export const updateOrganizationService = async (
  slug: string,
  name: string,
  userId: string,
) => {
  await ensureOrganizationOwner(slug, userId);
  const newSlug = generateSlug(name);
  const organization = await updateOrganization(slug, newSlug, name);
  delok.info({
    event: "organization.updated",
    message: `Organization updated: ${organization.name}`,
    payload: { organizationId: organization.id, slug: organization.slug, userId },
  });
  return organization;
};

/**
 * Delete organization by slug.
 *
 *
 * User must be owner of organization
 */
export const deleteOrganizationService = async (
  slug: string,
  userId: string,
) => {
  await ensureOrganizationOwner(slug, userId);

  const organization = await deleteOrganization(slug);
  delok.info({
    event: "organization.deleted",
    message: `Organization deleted: ${organization.name}`,
    payload: { organizationId: organization.id, slug: organization.slug, userId },
  });
  return organization;
};
