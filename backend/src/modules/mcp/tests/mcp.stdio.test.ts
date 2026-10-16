import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { McpError } from "@modelcontextprotocol/sdk/types.js";
import { prisma } from "../../../lib/prisma.js";

/**
 * End-to-end verification of the Delok MCP server over the real stdio
 * transport, using the installed `@modelcontextprotocol/sdk` client.
 *
 * The server process is spawned exactly the way a client would spawn it
 * (`npm run mcp:dev`), so this exercises the shipped entry point rather than
 * an in-process shortcut.
 *
 * Fixtures are deterministic and self-cleaning.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ENTRY = path.resolve(HERE, "..", "server.ts");
// backend/ <- src/ <- modules/ <- mcp/ <- tests/
const BACKEND_ROOT = path.resolve(HERE, "..", "..", "..", "..");

const RUN = `mcp-stdio-${process.pid}`;
const AUTHORIZED_USER_ID = `${RUN}-authorized`;
const OUTSIDER_USER_ID = `${RUN}-outsider`;

const AUTHORIZED_ORG_SLUG = `${RUN}-org-authorized`;
const FOREIGN_ORG_SLUG = `${RUN}-org-foreign`;
const AUTHORIZED_PROJECT_SLUG = `${RUN}-project-authorized`;
const FOREIGN_PROJECT_SLUG = `${RUN}-project-foreign`;

let authorizedOrgId: string;
let foreignOrgId: string;

const EXPECTED_TOOLS = [
  "list_organizations",
  "list_projects",
  "get_log_summary",
  "search_logs",
  "get_log_details",
];

const connect = (userId: string, identity: string) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [
      path.resolve(BACKEND_ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
      SERVER_ENTRY,
    ],
    cwd: BACKEND_ROOT,
    // stdio transport only forwards a safe subset of env vars by default;
    // the MCP server needs the application's own configuration.
    env: {
      ...(process.env as Record<string, string>),
      NODE_ENV: "test",
      DELOK_MCP_DEV_USER_ID: userId,
      DELOK_MCP_DEV_IDENTITY: identity,
    },
    stderr: "pipe",
  });
  const client = new Client({ name: "delok-mcp-stdio-test", version: "0.0.0" });
  return { client, transport };
};

const textPayload = (result: unknown): Record<string, unknown> => {
  const content = (result as { content?: unknown[] })?.content;
  const first = content?.[0] as { type: string; text: string } | undefined;
  if (!first || first.type !== "text") {
    throw new Error("expected a text content block");
  }
  return JSON.parse(first.text) as Record<string, unknown>;
};

describe("Delok MCP stdio server (real SDK client)", () => {
  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        {
          id: AUTHORIZED_USER_ID,
          name: "Stdio Authorized",
          email: `${AUTHORIZED_USER_ID}@test.local`,
        },
        {
          id: OUTSIDER_USER_ID,
          name: "Stdio Outsider",
          email: `${OUTSIDER_USER_ID}@test.local`,
        },
      ],
    });

    const authorizedOrg = await prisma.organization.create({
      data: { name: "Stdio Authorized Org", slug: AUTHORIZED_ORG_SLUG },
    });
    const foreignOrg = await prisma.organization.create({
      data: { name: "Stdio Foreign Org", slug: FOREIGN_ORG_SLUG },
    });
    authorizedOrgId = authorizedOrg.id;
    foreignOrgId = foreignOrg.id;

    await prisma.organizationMember.create({
      data: {
        organizationId: authorizedOrgId,
        userId: AUTHORIZED_USER_ID,
        role: "MEMBER",
      },
    });
    await prisma.organizationMember.create({
      data: {
        organizationId: foreignOrgId,
        userId: OUTSIDER_USER_ID,
        role: "MEMBER",
      },
    });

    const authorizedProject = await prisma.project.create({
      data: {
        name: "Stdio Authorized Project",
        slug: AUTHORIZED_PROJECT_SLUG,
        organizationId: authorizedOrgId,
      },
    });
    await prisma.project.create({
      data: {
        name: "Stdio Foreign Project",
        slug: FOREIGN_PROJECT_SLUG,
        organizationId: foreignOrgId,
      },
    });

    await prisma.logEvent.createMany({
      data: [
        {
          projectId: authorizedProject.id,
          level: "INFO",
          event: "seed.started",
          message: "seed started",
          environment: "test",
          occurredAt: new Date("2026-03-01T09:00:00.000Z"),
        },
        {
          projectId: authorizedProject.id,
          level: "ERROR",
          event: "seed.failed",
          message: "seed failed",
          environment: "test",
          occurredAt: new Date("2026-03-01T09:30:00.000Z"),
          payload: { token: "secret-123" },
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.organization.deleteMany({
      where: { id: { in: [authorizedOrgId, foreignOrgId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [AUTHORIZED_USER_ID, OUTSIDER_USER_ID] } },
    });
  });

  const cleanups: Array<() => Promise<void>> = [];
  afterEach(async () => {
    while (cleanups.length) {
      await cleanups.pop()?.();
    }
  });

  it("initializes and lists exactly the five intended tools", async () => {
    const { client, transport } = connect(AUTHORIZED_USER_ID, "stdio-test");
    cleanups.push(async () => {
      await client.close();
      await transport.close();
    });

    await client.connect(transport);
    expect(client.getServerVersion()?.name).toBe("delok-mcp");
    expect(client.getServerCapabilities()?.tools).toBeDefined();

    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([...EXPECTED_TOOLS].sort());
    expect(tools).toHaveLength(5);
  }, 60_000);

  it("serves an authorized get_log_summary call", async () => {
    const { client, transport } = connect(AUTHORIZED_USER_ID, "stdio-test");
    cleanups.push(async () => {
      await client.close();
      await transport.close();
    });

    await client.connect(transport);

    const result = await client.callTool({
      name: "get_log_summary",
      arguments: {
        project: AUTHORIZED_PROJECT_SLUG,
        organization: AUTHORIZED_ORG_SLUG,
        from: "2026-03-01",
        to: "2026-03-01",
      },
    });

    const payload = textPayload(result) as {
      success: boolean;
      data: { total: number; levelCounts: Record<string, number> };
    };
    expect(payload.success).toBe(true);
    expect(payload.data.total).toBe(2);
    expect(payload.data.levelCounts).toEqual({ ERROR: 1, INFO: 1 });
  }, 60_000);

  it("denies a cross-organization get_log_summary call", async () => {
    const { client, transport } = connect(OUTSIDER_USER_ID, "stdio-outsider");
    cleanups.push(async () => {
      await client.close();
      await transport.close();
    });

    await client.connect(transport);

    await expect(
      client.callTool({
        name: "get_log_summary",
        arguments: {
          project: AUTHORIZED_PROJECT_SLUG,
          organization: AUTHORIZED_ORG_SLUG,
          from: "2026-03-01",
          to: "2026-03-01",
        },
      }),
    ).rejects.toThrow(McpError);

    // The server must still be alive and serving after the rejection.
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(5);
  }, 60_000);

  it("rejects an unknown tool without crashing the server", async () => {
    const { client, transport } = connect(AUTHORIZED_USER_ID, "stdio-test");
    cleanups.push(async () => {
      await client.close();
      await transport.close();
    });

    await client.connect(transport);
    await expect(
      client.callTool({ name: "not_a_tool", arguments: {} }),
    ).rejects.toThrow(McpError);

    const orgs = await client.callTool({ name: "list_organizations", arguments: {} });
    expect(textPayload(orgs).success).toBe(true);
  }, 60_000);

  it("writes only JSON-RPC messages to stdout and diagnostics to stderr", async () => {
    const child = spawn(
      process.execPath,
      [
        path.resolve(BACKEND_ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
        SERVER_ENTRY,
      ],
      {
        cwd: BACKEND_ROOT,
        env: {
          ...(process.env as Record<string, string>),
          NODE_ENV: "test",
          DELOK_MCP_DEV_USER_ID: AUTHORIZED_USER_ID,
          DELOK_MCP_DEV_IDENTITY: "stdio-test",
        },
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    const stdoutLines: string[] = [];
    const stderrChunks: string[] = [];
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (c: string) => stdoutLines.push(...c.split("\n")));
    child.stderr.on("data", (c: string) => stderrChunks.push(c));

    const send = (msg: Record<string, unknown>) =>
      child.stdin.write(`${JSON.stringify(msg)}\n`);

    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "raw-probe", version: "0.0.0" },
      },
    });
    send({ jsonrpc: "2.0", method: "notifications/initialized" });
    send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
    // Deliberately unauthorized call: must produce a JSON-RPC error response,
    // not a crash and not stdout noise.
    send({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "get_log_summary",
        arguments: {
          project: AUTHORIZED_PROJECT_SLUG,
          organization: FOREIGN_ORG_SLUG,
          from: "2026-03-01",
          to: "2026-03-01",
        },
      },
    });
    send({ jsonrpc: "2.0", id: 4, method: "tools/list", params: {} });

    await new Promise((resolve) => setTimeout(resolve, 8000));

    const stillAlive = child.exitCode === null;
    child.stdin.end();
    const exited = new Promise<number | null>((resolve) =>
      child.on("exit", (code) => resolve(code)),
    );
    await Promise.race([exited, new Promise((r) => setTimeout(r, 5000))]);
    if (child.exitCode === null) child.kill();

    const stdout = stdoutLines.filter((l) => l.trim() !== "");
    expect(stdout.length).toBeGreaterThan(0);

    const parsed = stdout.map((line) => JSON.parse(line) as Record<string, unknown>);
    for (const message of parsed) {
      expect(message.jsonrpc).toBe("2.0");
    }
    // initialize + tools/list + failed tools/call + tools/list
    expect(parsed.filter((m) => m.id === 3 && "error" in m)).toHaveLength(1);
    // Two successful tools/list responses prove the server survived the error.
    expect(parsed.filter((m) => m.id === 4 && "result" in m)).toHaveLength(1);
    expect(stillAlive).toBe(true);
    expect(stderrChunks.join("")).toContain("[delok-mcp]");
  }, 60_000);
});