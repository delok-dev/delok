import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import {
  setDevTrustContext,
  clearDevTrustContext,
  getVerifiedUserId,
  isDevTrustActive,
} from "../lib/auth-context.js";
import { tools, toolDefinitions, callTool, UnknownToolError } from "../controller.js";
import {
  listOrganizations,
  listProjects,
  resolveProject,
  getLogSummary,
  searchLogs,
  getLogDetail,
} from "../lib/service.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/AppError.js";

/**
 * Local test harness for the Delok MCP server.
 *
 * The MCP tools require a verified Delok user id. In production this must be
 * supplied by a trusted auth layer (for example the eventual Telegram
 * account-linking flow). Here we inject a fixed development identity via the
 * dev-only trust context so the read-only tools can be exercised safely.
 *
 * This context is DEPRECATED and MUST NOT be activated in production.
 *
 * Fixtures are deterministic and self-cleaning: every row created here is
 * deleted in `afterAll` (cascades remove projects, memberships and log events).
 */

const RUN = `mcp-test-${process.pid}`;
const MEMBER_IDENTITY = "test-account-member";
const OUTSIDER_IDENTITY = "test-account-outsider";

const memberUserId = `${RUN}-member`;
const outsiderUserId = `${RUN}-outsider`;

const orgASlug = `${RUN}-org-a`;
const orgBSlug = `${RUN}-org-b`;
const projectASlug = `${RUN}-project-a`;
const projectBSlug = `${RUN}-project-b`;

let orgAId: string;
let orgBId: string;
let projectAId: string;
let projectBId: string;
let seededLogId: string;

/** Create an organization with a single member and a project. */
const seedOrg = async (name: string, slug: string, userId: string) => {
  const org = await prisma.organization.create({ data: { name, slug } });
  await prisma.organizationMember.create({
    data: { organizationId: org.id, userId, role: "MEMBER" },
  });
  return org;
};

describe("Delok MCP server — local test harness", () => {
  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        { id: memberUserId, name: "MCP Member", email: `${memberUserId}@test.local` },
        { id: outsiderUserId, name: "MCP Outsider", email: `${outsiderUserId}@test.local` },
      ],
    });

    const orgA = await seedOrg("MCP Org A", orgASlug, memberUserId);
    const orgB = await seedOrg("MCP Org B", orgBSlug, outsiderUserId);
    orgAId = orgA.id;
    orgBId = orgB.id;

    const projectA = await prisma.project.create({
      data: { name: "Project A", slug: projectASlug, organizationId: orgAId },
    });
    const projectB = await prisma.project.create({
      data: { name: "Project B", slug: projectBSlug, organizationId: orgBId },
    });
    projectAId = projectA.id;
    projectBId = projectB.id;

    await prisma.logEvent.createMany({
      data: [
        {
          projectId: projectAId,
          level: "INFO",
          event: "checkout.started",
          message: "checkout started",
          environment: "test",
          occurredAt: new Date("2026-01-01T10:00:00.000Z"),
        },
        {
          projectId: projectAId,
          level: "ERROR",
          event: "checkout.failed",
          message: "checkout failed",
          environment: "test",
          occurredAt: new Date("2026-01-01T11:00:00.000Z"),
          payload: { token: "secret-123" },
        },
        {
          projectId: projectBId,
          level: "INFO",
          event: "other.project",
          message: "belongs to another organization",
          environment: "test",
          occurredAt: new Date("2026-01-01T12:00:00.000Z"),
        },
      ],
    });

    seededLogId = (
      await prisma.logEvent.findFirstOrThrow({
        where: { projectId: projectAId, level: "ERROR" },
      })
    ).id;
  });

  afterAll(async () => {
    clearDevTrustContext();
    // Cascades remove projects, log events and organization memberships.
    await prisma.organization.deleteMany({ where: { id: { in: [orgAId, orgBId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [memberUserId, outsiderUserId] } } });
  });

  beforeEach(() => {
    setDevTrustContext(
      new Map([
        [MEMBER_IDENTITY, memberUserId],
        [OUTSIDER_IDENTITY, outsiderUserId],
      ]),
      MEMBER_IDENTITY,
    );
  });

  afterEach(() => {
    clearDevTrustContext();
  });

  it("exposes exactly the five intended tools", () => {
    expect(toolDefinitions().map((t) => t.name)).toEqual([
      "list_organizations",
      "list_projects",
      "get_log_summary",
      "search_logs",
      "get_log_details",
    ]);
    expect(Object.keys(tools)).toHaveLength(5);
  });

  it("rejects an unknown tool name through the typed dispatcher", async () => {
    await expect(callTool("delete_everything", {})).rejects.toThrow(UnknownToolError);
  });

  it("resolves a verified user id from the dev trust context", () => {
    expect(isDevTrustActive()).toBe(true);
    expect(getVerifiedUserId()).toBe(memberUserId);
  });

  it("denies access when no trusted identity context is active", async () => {
    clearDevTrustContext();
    await expect(listOrganizations()).rejects.toThrow(AppError);
  });

  it("returns a bounded organization list for the authenticated account", async () => {
    const orgs = await listOrganizations();
    expect(orgs).toHaveLength(1);
    expect(orgs[0]).toMatchObject({ id: orgAId, slug: orgASlug });
    // Do not leak anything beyond these fields.
    expect(Object.keys(orgs[0]).sort()).toEqual(
      ["createdAt", "id", "name", "slug", "updatedAt"].sort(),
    );
  });

  it("lists projects only in an organization the caller belongs to", async () => {
    const mine = await listProjects(orgASlug);
    expect(mine).toEqual([
      expect.objectContaining({ id: projectAId, slug: projectASlug }),
    ]);

    await expect(listProjects(orgBSlug)).rejects.toThrow(AppError);
  });

  it("resolves a project only when the caller belongs to its organization", async () => {
    const resolved = await resolveProject(projectASlug, orgASlug, memberUserId);
    expect(resolved.projectId).toBe(projectAId);
    expect(resolved.organizationId).toBe(orgAId);

    // Cross-organization: a project from another org is never resolvable.
    await expect(resolveProject(projectBSlug, orgASlug, memberUserId)).rejects.toThrow(
      AppError,
    );
    await expect(resolveProject(projectASlug, orgBSlug, memberUserId)).rejects.toThrow(
      AppError,
    );
  });

  it("rejects a backward time range", async () => {
    await expect(
      getLogSummary(projectAId, {
        from: new Date("2026-01-02"),
        to: new Date("2026-01-01"),
      }),
    ).rejects.toThrow(AppError);
  });

  it("aggregates a summary for the authorized project", async () => {
    const summary = await getLogSummary(projectAId, {
      from: new Date("2026-01-01"),
      to: new Date("2026-01-01"),
    });
    expect(summary.projectId).toBe(projectAId);
    expect(summary.total).toBe(2);
    expect(summary.levelCounts).toEqual({ ERROR: 1, INFO: 1 });
    expect(summary.minMax).not.toBeNull();
  });

  it("caps the page limit at 250 and never leaks payloads", async () => {
    const result = await searchLogs(
      projectAId,
      { from: new Date("2026-01-01"), to: new Date("2026-01-01") },
      { page: 1, limit: 500 },
    );
    expect(result.limit).toBe(250);
    expect(result.total).toBe(2);
    expect(result.logs).toHaveLength(2);
    for (const log of result.logs) {
      expect(Object.keys(log).sort()).toEqual(
        ["environment", "event", "id", "level", "message", "occurredAt", "projectId", "receivedAt"].sort(),
      );
    }
  });

  it("filters search terms and paginates deterministically", async () => {
    const page1 = await searchLogs(projectAId, { search: "checkout" }, { page: 1, limit: 1 });
    const page2 = await searchLogs(projectAId, { search: "checkout" }, { page: 2, limit: 1 });
    expect(page1.total).toBe(2);
    expect(page1.totalPages).toBe(2);
    expect(page1.logs).toHaveLength(1);
    expect(page2.logs).toHaveLength(1);
    expect(page1.logs[0].id).not.toBe(page2.logs[0].id);
  });

  it("returns a bounded representation for a log detail", async () => {
    const row = await getLogDetail(projectAId, seededLogId);
    expect(row).toMatchObject({
      id: seededLogId,
      projectId: projectAId,
      level: "ERROR",
      event: "checkout.failed",
    });
    expect(row).not.toHaveProperty("payload");
  });

  it("does not return a log from another project", async () => {
    // Same id, wrong project scope -> non-leaking miss.
    expect(await getLogDetail(projectBId, seededLogId)).toBeNull();
  });

  it("denies the summary tool across organizations", async () => {
    setDevTrustContext(new Map([[OUTSIDER_IDENTITY, outsiderUserId]]), OUTSIDER_IDENTITY);
    await expect(
      callTool("get_log_summary", {
        project: projectASlug,
        organization: orgASlug,
        from: "2026-01-01",
        to: "2026-01-01",
      }),
    ).rejects.toThrow(AppError);
  });
});