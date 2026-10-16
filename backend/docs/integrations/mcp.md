# MCP Integration (local stdio proof of concept)

The Delok backend exposes a read-only **Model Context Protocol (MCP)** server over
the **stdio** transport. It lets an MCP client (an IDE assistant, a CLI agent such
as Hermes) answer questions about log data without granting write access.

This is a **local proof of concept**. It is not a production integration, and it
has no relation to the planned Telegram account-linking flow (see
[Limitations](#limitations-and-what-this-is-not)).

- Entry point: `src/modules/mcp/server.ts`
- Tool registry: `src/modules/mcp/controller.ts`
- Data access: `src/modules/mcp/lib/core-repository.ts`, `src/modules/mcp/lib/service.ts`
- JSON-RPC route (separate from the stdio server): `src/modules/mcp/routes/mcp.route.ts`

---

## Startup

From `backend/`:

```powershell
npm run mcp:dev
```

which is `tsx src/modules/mcp/server.ts`.

The compiled form, after `npm run build`, is:

```powershell
node dist/modules/mcp/server.js
```

The server **never** starts the Express HTTP listener. It speaks JSON-RPC over
stdin/stdout only. All diagnostics are written to **stderr**; stdout carries
protocol messages exclusively.

### Environment

The server reads the application's normal configuration (`.env` /
`process.env`), because the tool handlers use the same Prisma client as the rest
of the backend:

`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`,
`DELOK_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.

Two MCP-specific variables configure the dev-only identity (see
[Dev-only identity context](#dev-only-identity-context)):

| Variable | Required | Meaning |
|----------|----------|---------|
| `DELOK_MCP_DEV_USER_ID` | for local use | Delok `User.id` the local process acts as |
| `DELOK_MCP_DEV_IDENTITY` | no (default `local-dev`) | Label for that identity |

`NODE_ENV=production` makes the server refuse to start, because the dev-only
identity context is not an acceptable production authentication mechanism.

---

## Tools

`tools/list` returns exactly five tools, in this order:

1. `list_organizations`
2. `list_projects`
3. `get_log_summary`
4. `search_logs`
5. `get_log_details`

Every tool is **read-only** and returns a bounded payload. Raw log `payload`
fields are never selected or returned, so secrets embedded in payloads are not
exposed.

### `list_organizations`

Lists the organizations the authenticated account is a member of.

| Argument | Type | Required | Notes |
|----------|------|----------|-------|
| _(none)_ | — | — | |

Returns `{ id, name, slug, createdAt, updatedAt }` per organization.

### `list_projects`

Lists projects in one organization.

| Argument | Type | Required | Notes |
|----------|------|----------|-------|
| `organization` | string | yes | Organization slug |

Returns `{ id, name, slug, organizationId, createdAt, updatedAt }` per project.
A caller who is not a member of the organization receives a `403`
(`organization.access_denied`).

### `get_log_summary`

Aggregate counts for a project over a time range.

| Argument | Type | Required | Notes |
|----------|------|----------|-------|
| `project` | string | yes | Project slug |
| `organization` | string | yes | Organization slug |
| `from` | string | no | Inclusive start date, e.g. `2026-03-01` |
| `to` | string | no | Inclusive end date (the whole day is included) |
| `level` | string | no | e.g. `INFO`, `ERROR` |
| `environment` | string | no | e.g. `production` |

Returns:

```json
{
  "success": true,
  "data": {
    "projectId": "…",
    "total": 2,
    "levelCounts": { "ERROR": 1, "INFO": 1 },
    "minMax": {
      "minOccurredAt": "2026-03-01T09:00:00.000Z",
      "maxOccurredAt": "2026-03-01T09:30:00.000Z"
    }
  }
}
```

A backwards range (`from > to`) is rejected with `validation.range_backwards`.

### `search_logs`

Bounded, paginated log search for a project.

| Argument | Type | Required | Notes |
|----------|------|----------|-------|
| `project` | string | yes | Project slug |
| `organization` | string | yes | Organization slug |
| `from` | string | no | Inclusive start date |
| `to` | string | no | Inclusive end date |
| `level` | string | no | Exact level match |
| `environment` | string | no | Exact environment match |
| `search` | string | no | Case-insensitive substring match on `event` or `message` |
| `page` | integer | no | Default `1` |
| `limit` | integer | no | Default `50`, hard-capped at `250` |

Returns `{ projectId, total, page, limit, totalPages, logs }`, where each log is
`{ id, projectId, level, event, message, environment, occurredAt, receivedAt }`.

### `get_log_details`

A single log event by id, scoped to an authorized project.

| Argument | Type | Required | Notes |
|----------|------|----------|-------|
| `project` | string | yes | Project slug |
| `organization` | string | yes | Organization slug |
| `logId` | string | yes | Log event id |

Returns the same bounded row shape as `search_logs`. A log id belonging to a
different project is reported as not found — the tool does not confirm whether
the id exists elsewhere.

---

## Authentication and authorization

Authentication and authorization are enforced in the service/repository layer,
never by the caller-supplied arguments:

1. Every tool call first resolves a **verified Delok user id** from the MCP
   authentication context (`src/modules/mcp/lib/auth-context.ts`). Without one,
   the call fails with `auth.no_context`.
2. `resolveProject()` loads the organization **only** when the resolved user is
   an `OrganizationMember` of it, and then loads the project **only** from that
   organization.
3. Consequently a project slug from another organization is unreachable even if
   the caller knows its exact slug, and even if the caller lies about the
   `organization` argument.

Observed, verified behavior:

| Case | Result |
|------|--------|
| Caller is a member, project in that org | success |
| Caller is not a member of the given org | `403 organization.access_denied` |
| Caller is a member of org A, project lives in org B | `404 project.not_found` (non-leaking) |
| `from` later than `to` | `400 validation.range_backwards` |
| Unknown tool name | JSON-RPC `-32601 MethodNotFound` |
| No identity configured | JSON-RPC `-32600 InvalidRequest`, `data.errorCode = "auth.no_context"` |

Errors raised by a tool are converted to MCP/JSON-RPC errors in
`src/modules/mcp/server.ts` (`toMcpError`). The SDK serialises them into the
JSON-RPC error member and the server keeps running — a failing tool call never
terminates the stdio process.

---

## Dev-only identity context

`src/modules/mcp/lib/auth-context.ts` holds a **development-only** trust
context: a `Map<identityLabel, userId>` installed by the local test harness or by
the `DELOK_MCP_DEV_USER_ID` bootstrap at the top of `server.ts`.

Its limitations are deliberate and important:

- The stdio transport has no request headers, no session and no TLS, so **there
  is nothing to authenticate**. The process simply trusts the user id it was
  started with.
- Every caller that can spawn this process has the same identity.
- The context is **not** a fallback: if no identity is configured, all tool calls
  are rejected. It is opt-in, and the server refuses to run when
  `NODE_ENV=production`.

A production deployment must replace `getVerifiedUserId()` with a real trusted
authentication layer.

---

## Testing

Run the full verification set:

```powershell
npm run type-check
npm test
npm run build
```

The MCP suites are:

- `src/modules/mcp/tests/mcp.test.ts` — tool registry, service-layer
  authorization (membership scoping, cross-organization denial, backwards ranges,
  pagination caps, payload redaction), using in-process calls.
- `src/modules/mcp/tests/mcp.stdio.test.ts` — end-to-end verification that spawns
  the **real** server with `tsx` and drives it with the installed
  `@modelcontextprotocol/sdk` `Client` over `StdioClientTransport`. It asserts:
  - `initialize` succeeds and the server reports name `delok-mcp` with `tools`
    capability;
  - `tools/list` returns exactly the five tools above;
  - an authorized identity gets a correct `get_log_summary` result;
  - a cross-organization `get_log_summary` call is rejected with an `McpError`,
    and the server still answers a follow-up `tools/list`;
  - a raw stdio probe confirms every stdout line is a JSON-RPC message, that a
    denied call produces a JSON-RPC **error** response rather than a crash, and
    that diagnostics appear on stderr (`[delok-mcp]`).

Both suites seed their own users, organizations, projects and log events with
process-unique slugs and delete everything they created afterwards. No production
data or credentials are involved, and no LLM agent participates: every assertion
is deterministic.

---

## Registering with Hermes

Confirmed against the installed CLI (`hermes mcp add --help`):

```
usage: hermes mcp add [-h] [--url URL] [--command MCP_COMMAND] [--args ...]
                      [--auth {oauth,header}] [--preset PRESET]
                      [--connect-timeout CONNECT_TIMEOUT] [--env [ENV ...]]
                      name
```

`--args` is greedy and must therefore be the **last** option.

From `backend/` on this machine:

```powershell
hermes mcp add delok --command "C:\Program Files\nodejs\node.exe" --env DELOK_MCP_DEV_USER_ID=<your-delok-user-id> --args "C:\Users\Yuan\OneDrive\Desktop\Codes\Delok\delok\backend\node_modules\tsx\dist\cli.mjs" "C:\Users\Yuan\OneDrive\Desktop\Codes\Delok\delok\backend\src\modules\mcp\server.ts"
```

Notes:

- `--command` must be the absolute path to the Node executable; `tsx` is invoked
  through its CLI module so no shell or `.cmd` resolution is involved.
- `--env` values are passed through to the spawned process. Replace
  `<your-delok-user-id>` with a real `User.id` from your local database; the
  server grants that identity full read access to its organizations.
- If you prefer the compiled entry point, substitute
  `--args "C:\Users\Yuan\OneDrive\Desktop\Codes\Delok\delok\backend\dist\modules\mcp\server.js"`
  (run `npm run build` first).

---

## Limitations and what this is not

This document covers a **local MCP proof of concept** only. Specifically:

- It is **not** Telegram account linking. There is no Telegram bot, no linking
  flow, no deep-link callback, and no OAuth code exchange here.
- Identity is a fixed environment variable, not a per-user session. Every caller
  of the process shares one Delok account.
- There is no production deployment, no remote/HTTP transport, and no
  multi-tenant credential storage.
- All five tools are read-only. There is no ingestion or mutation capability.
- The HTTP JSON-RPC route in `src/modules/mcp/routes/mcp.route.ts` exists for
  completeness and shares the tool registry; the verified, supported transport in
  this task is stdio.