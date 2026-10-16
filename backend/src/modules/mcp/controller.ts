import {
  listOrganizations,
  listProjects,
  resolveProject,
  getLogSummary,
  searchLogs,
  getLogDetail,
} from "./lib/service.js";
import { getVerifiedUserId } from "./lib/auth-context.js";
import { AppError } from "../../utils/AppError.js";

function success(data: unknown) {
  return { success: true, data };
}

function error(code: string, message: string) {
  return { success: false, error: { code, message } };
}

/**
 * Tools registered with the MCP server.
 *
 * Authorization is enforced at the service layer:
 *  - list_organizations  -> all organizations the authenticated caller belongs to
 *  - list_projects       -> projects in an org the caller belongs to
 *  - get_log_summary     -> aggregate for an authorized project + range
 *  - search_logs         -> bounded, paginated logs for an authorized project
 *  - get_log_details     -> single event for an authorized project
 *
 * Every tool returns a bounded, safe payload (no secrets, no raw payloads).
 */
export const tools = {
  list_organizations: {
    description:
      "List organizations the authenticated Delok account can access. Read-only.",
    inputSchema: { type: "object", properties: {} },
    handler: async () => success(await listOrganizations()),
  },
  list_projects: {
    description:
      "List projects the authenticated account can access, scoped to an authorized organization.",
    inputSchema: {
      type: "object",
      properties: {
        organization: { type: "string" },
      },
    },
    handler: async (args: { organization?: string }) => {
      const slug = args?.organization ?? "";
      return success(await listProjects(slug));
    },
  },
  get_log_summary: {
    description:
      "Return aggregate log counts for an authorized project and time range, optionally filtered by level and environment.",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string" },
        organization: { type: "string" },
        from: { type: "string" },
        to: { type: "string" },
        level: { type: "string" },
        environment: { type: "string" },
      },
      required: ["project", "organization"],
    },
    handler: async (args: {
      project: string;
      organization: string;
      from?: string;
      to?: string;
      level?: string;
      environment?: string;
    }) => {
      const userId = getVerifiedUserId();
      const { organizationId, projectId } = await resolveProject(
        args.project,
        args.organization,
        userId,
      );

      const result = await getLogSummary(
        projectId,
        {
          from: args.from ? new Date(args.from) : undefined,
          to: args.to ? new Date(args.to) : undefined,
          level: args.level,
          environment: args.environment,
        },
      );
      return success(result);
    },
  },
  search_logs: {
    description:
      "Search authorized logs for a project. Bounded, paginated results. Does not expose secrets or unrestricted raw payloads.",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string" },
        organization: { type: "string" },
        from: { type: "string" },
        to: { type: "string" },
        level: { type: "string" },
        environment: { type: "string" },
        search: { type: "string" },
        page: { type: "integer", minimum: 1 },
        limit: { type: "integer", minimum: 1, maximum: 250 },
      },
      required: ["project", "organization"],
    },
    handler: async (args: {
      project: string;
      organization: string;
      from?: string;
      to?: string;
      level?: string;
      environment?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const userId = getVerifiedUserId();
      const { organizationId, projectId } = await resolveProject(
        args.project,
        args.organization,
        userId,
      );

      const result = await searchLogs(
        projectId,
        {
          from: args.from ? new Date(args.from) : undefined,
          to: args.to ? new Date(args.to) : undefined,
          level: args.level,
          environment: args.environment,
          search: args.search,
        },
        { page: args.page ?? 1, limit: args.limit ?? 50 },
      );
      return success(result);
    },
  },
  get_log_details: {
    description:
      "Retrieve a single log event for an authorized project. Returns a constrained representation (no raw payload, no secret fields).",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string" },
        organization: { type: "string" },
        logId: { type: "string" },
      },
      required: ["project", "organization", "logId"],
    },
    handler: async (args: {
      project: string;
      organization: string;
      logId: string;
    }) => {
      const userId = getVerifiedUserId();
      const { organizationId, projectId } = await resolveProject(
        args.project,
        args.organization,
        userId,
      );

      const row = await getLogDetail(projectId, args.logId);
      if (!row) {
        return error("NOT_FOUND", "Log event not found or not accessible in the authorized project");
      }
      return success(row);
    },
  },
} as const;

export type ToolName = keyof typeof tools;

export const toolNames = Object.keys(tools) as ToolName[];

export interface ToolDefinition {
  name: ToolName;
  description: string;
  inputSchema: Record<string, unknown>;
}

/** MCP `tools/list` payload built from the typed tool map. */
export const toolDefinitions = (): ToolDefinition[] =>
  toolNames.map((name) => ({
    name,
    description: tools[name].description,
    inputSchema: tools[name].inputSchema as Record<string, unknown>,
  }));

/**
 * Invoke a tool by name with a single, typed dispatch point.
 * Throws `UnknownToolError` when the name is not registered, so both the
 * stdio server and the JSON-RPC route share identical semantics.
 */
export const callTool = async (
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  if (!Object.prototype.hasOwnProperty.call(tools, name)) {
    throw new UnknownToolError(name);
  }
  const handler = tools[name as ToolName].handler as (
    a: Record<string, unknown>,
  ) => Promise<unknown>;
  return handler(args);
};

export class UnknownToolError extends Error {
  readonly toolName: string;
  constructor(toolName: string) {
    super(`Unknown tool: ${toolName}`);
    this.name = "UnknownToolError";
    this.toolName = toolName;
  }
}
