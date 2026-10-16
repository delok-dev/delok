import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/AppError.js";
import { getVerifiedUserId } from "./auth-context.js";

export interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

/** List the organizations the authenticated account can access. */
export const listOrganizations = async (): Promise<OrganizationRow[]> => {
  const userId = getVerifiedUserId();
  return prisma.organization.findMany({
    where: { organizationMembers: { some: { userId } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true },
  });
};

export interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** List projects the authenticated account can access, scoped to an org. */
export const listProjects = async (
  organizationSlug: string,
): Promise<ProjectRow[]> => {
  const userId = getVerifiedUserId();
  const org = await prisma.organization.findFirst({
    where: { slug: organizationSlug, organizationMembers: { some: { userId } } },
    select: { id: true },
  });
  if (!org) {
    throw new AppError("Forbidden", 403, "organization.access_denied");
  }
  const projects = await prisma.project.findMany({
    where: { organizationId: org.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return projects.map(toProjectRow);
};

/** Resolve a project the caller can access. Non-leaking: unknown -> 404. */
export const resolveProject = async (
  identifier: string,
  organizationSlug: string,
  userId: string,
): Promise<{ organizationId: string; projectId: string; slug: string }> => {
  const org = await prisma.organization.findFirst({
    where: { slug: organizationSlug, organizationMembers: { some: { userId } } },
    select: { id: true },
  });
  if (!org) {
    throw new AppError("Forbidden", 403, "organization.access_denied");
  }
  const project = await prisma.project.findFirst({
    where: { slug: identifier, organizationId: org.id },
    select: { id: true, slug: true, organizationId: true },
  });
  if (!project) {
    throw new AppError("Project not found", 404, "project.not_found");
  }
  return { organizationId: org.id, projectId: project.id, slug: project.slug };
};

/** Finalize a list/project row. */
export const toProjectRow = (p: {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}): ProjectRow => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  organizationId: p.organizationId,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});
