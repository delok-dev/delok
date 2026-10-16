import express from "express";
import { toolDefinitions, callTool } from "../controller.js";
export const mcpRouter = express.Router();

/**
 * Standard JSON-RPC 2.0 dispatcher for MCP.
 *
 * This is the public MCP endpoint, mounted separately from the Express HTTP
 * listener. The MCP server entry point never starts the Express app.
 */
mcpRouter.post("/mcp", async (req, res) => {
  const body: {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: Record<string, unknown>;
  } = req.body ?? {};

  if (body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return res.status(400).json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32600, message: "Invalid Request" },
    });
  }

  const { id, method, params } = body;

  try {
    const result = await callTool(method, params ?? {});
    return res.json({ jsonrpc: "2.0", id: id ?? null, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      jsonrpc: "2.0",
      id: id ?? null,
      error: { code: -32603, message },
    });
  }
});

// Tool discovery (MCP "tools/list")
mcpRouter.get("/mcp", (_req, res) => {
  res.json({ tools: toolDefinitions() });
});