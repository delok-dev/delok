#!/usr/bin/env node
/**
 * Delok MCP server — local stdio transport (isolated from Express).
 *
 * Launch WITHOUT the Express HTTP listener:
 *   npm run mcp:dev
 *
 * The MCP transport communicates over stdin/stdout using the official MCP SDK.
 * Diagnostic messages go to stderr; protocol messages go to stdout.
 *
 * Startup:  node dist/modules/mcp/server.js
 * Dev:      npx tsx src/modules/mcp/server.ts
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { toolDefinitions, callTool, UnknownToolError } from "./controller.js";
import {
  setDevTrustContext,
  isDevTrustActive,
} from "./lib/auth-context.js";
import { AppError } from "../../utils/AppError.js";

/** Refuse to run production builds with the dev-only authentication context. */
if (process.env.NODE_ENV === "production") {
  console.error(
    "[delok-mcp] ERROR: production build must not use the dev-only auth context",
  );
  process.exit(1);
}

/**
 * Dev-only identity bootstrap.
 *
 * The stdio transport has no request headers to authenticate with, so a local
 * run is wired to a single Delok user id taken from the environment. This is
 * the proof-of-concept stand-in for the future Telegram account-linking flow;
 * it is intentionally refused in production (guarded above).
 */
const devUserId = process.env.DELOK_MCP_DEV_USER_ID;
if (devUserId) {
  const identity = process.env.DELOK_MCP_DEV_IDENTITY || "local-dev";
  setDevTrustContext(new Map([[identity, devUserId]]), identity);
  process.stderr.write(`[delok-mcp] dev identity '${identity}' enabled\n`);
} else if (!isDevTrustActive()) {
  process.stderr.write(
    "[delok-mcp] warning: no trusted identity configured; all tool calls will be rejected\n",
  );
}

/**
 * Map application errors onto MCP/JSON-RPC error codes.
 *
 * The SDK serialises a thrown `McpError` verbatim into the JSON-RPC error
 * member, so throwing here keeps error handling at the protocol boundary
 * without ever crashing the stdio server.
 */
const toMcpError = (err: unknown): McpError => {
  if (err instanceof McpError) return err;

  if (err instanceof UnknownToolError) {
    return new McpError(ErrorCode.MethodNotFound, err.message);
  }

  if (err instanceof AppError) {
    // The SDK's ErrorCode enum has no dedicated auth codes, so an
    // authentication/authorization rejection is reported as an invalid request
    // with the application-level error code preserved in `data`.
    return new McpError(ErrorCode.InvalidRequest, err.message, {
      statusCode: err.statusCode,
      errorCode: err.errorCode,
    });
  }

  return new McpError(ErrorCode.InternalError, "Internal error", {
    cause: err instanceof Error ? err.message : String(err),
  });
};

class DelokMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "delok-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolDefinitions(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (req) => {
      const { name, arguments: args } = req.params;

      let result: unknown;
      try {
        result = await callTool(name, (args ?? {}) as Record<string, unknown>);
      } catch (err) {
        // Never let a tool failure take down the stdio server: it becomes a
        // JSON-RPC error response instead.
        process.stderr.write(
          `[delok-mcp] tool '${name}' failed: ${
            err instanceof Error ? err.message : String(err)
          }\n`,
        );
        throw toMcpError(err);
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      };
    });

    // Diagnostics go to stderr, never stdout.
    this.server.onerror = (error) => {
      process.stderr.write(`[delok-mcp] MCP error: ${error.message}\n`);
    };

    // Clean shutdown on termination.
    const shutdown = (signal: string) => {
      process.stderr.write(`[delok-mcp] ${signal} received, shutting down\n`);
      process.exit(0);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    process.stderr.write("[delok-mcp] connected (stdio)\n");
  }
}

const server = new DelokMcpServer();
server.run().catch((err) => {
  process.stderr.write(`[delok-mcp] fatal: ${err.message}\n`);
  process.exit(1);
});