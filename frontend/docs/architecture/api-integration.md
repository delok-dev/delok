# API Integration

## HTTP Client

Services use native `fetch` with `credentials:"include"` (cookie auth). Each service resolves the base URL as:

```ts
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") throw new Error("...");
  return "http://localhost:8000";
}
```

This pattern appears in `auth.service.ts`, `organization.service.ts`, `project.service.ts`, `log.service.ts`, `api-key.service.ts`.

## Authentication

- Client: `better-auth` `createAuthClient({ baseURL: getAuthBaseURL() })` (`src/lib/auth/auth-client.ts`).
- Session: `authClient.useSession()` and `authClient.signIn/signUp` via `AuthService`.
- Custom endpoint: `POST /api/auth/resend-verification` is called via raw `fetch` (`src/domains/auth/api/auth.service.ts`).
- Social: `authClient.signIn.social({provider:"google"|"github", callbackURL:...})`.

## API Endpoints

| Domain | Method | Endpoint | File |
|--------|--------|----------|------|
| Org | GET | `/api/organization` | `organization.service.ts` |
| Org | POST | `/api/organization` | `organization.service.ts` |
| Org | GET | `/api/organization/:slug` | `organization.service.ts` |
| Org | PATCH | `/api/organization/:slug` | `organization.service.ts` |
| Org | DELETE | `/api/organization/:slug` | `organization.service.ts` |
| Project | GET | `/api/organizations/:organizationSlug/projects` | `project.service.ts` |
| Project | POST | `/api/organizations/:organizationSlug/projects` | `project.service.ts` |
| Project | GET | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts` |
| Project | PATCH | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts` |
| Project | DELETE | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts` |
| Log | GET | `/api/projects/:projectId/logs?page=&limit=&search=&level=&environment=&from=&to=` | `log.service.ts` |
| API Key | GET | `/api/projects/:projectId/api-keys` | `api-key.service.ts` |
| API Key | POST | `/api/projects/:projectId/api-keys` | `api-key.service.ts` |
| API Key | PATCH | `/api/api-key/:id` (rename) | `api-key.service.ts` |
| API Key | PATCH | `/api/api-key/:id/revoke` | `api-key.service.ts` |

Response shape: `{ data: T }` on success; errors are `{ error:{code,message}}` or `{errors:[...]}` — see `src/utils/api-error.ts`.

## Request and Response Handling

- Requests: `Content-Type: application/json` for POST/PATCH. API keys are not sent by the frontend; they are for SDK ingestion.
- Responses: `response.json()` then `normalize*` helpers map `created_at/updated_at` -> `createdAt/updatedAt` (`organization.service.ts`, `project.service.ts`).
- Lists: `(data.data ?? []).map(normalizeX)`.

## Error Handling and Validation

- `getApiErrorMessage` / `getApiErrorCode` (`src/utils/api-error.ts`) extract `error.message`, `errorDetail.message`, `errors[0].message`.
- `ORGANIZATION_SLUG_ALREADY_EXISTS` maps to `"Organization name is unavailable"` (`organization.service.ts`).
- Form validation uses `zod` schemas in `src/domains/*/schemas/*` with `react-hook-form` + `@hookform/resolvers`.
- Errors are surfaced via toasts or inline UI. No global error boundary.

## WebSocket (Realtime)

- Manager: `src/lib/websocket/websocket.ts` — singleton `websocketManager`.
- URL: `NEXT_PUBLIC_WS_URL` (fallback `ws://localhost:8000`), with `wss://` enforcement on https/production.
- Connection: `SocketProvider` calls `connect()` on mount. Exponential backoff reconnect (`1s * 2^attempt`, cap 30s). Auto-resubscribes on `onopen`.
- Protocol:
  - Subscribe: `{type:"project.subscribe", data:{projectId}}`
  - Unsubscribe: `{type:"project.unsubscribe", data:{projectId}}`
  - Events: `{type, data}` dispatched to handlers registered via `websocketManager.on(type, handler)`.
- Event types (`src/lib/websocket/realtime.types.ts`):
  - `log.created` -> `LogEvent`
  - `project.log_count.updated` -> `{projectId, logCount}`
- Consumers: `useLogExplorerRealtime` (filters via `matchesLogFilters`) and `useProjectsRealtime` (updates React Query cache).

## Frontend and Backend Responsibilities

- **Frontend:** Auth UI, org and project CRUD UI, log filtering and pagination UI, realtime subscription, local UX state.
- **Backend:** Session and cookie management, slug generation, permission checks (OWNER role), log storage and search, API key generation and revocation, WebSocket fan-out per project.

## Environment Variables

- `NEXT_PUBLIC_API_URL` — HTTP API base (fallback `http://localhost:8000`, required in production)
- `NEXT_PUBLIC_WS_URL` — WebSocket URL (fallback `ws://localhost:8000`, required `wss://` on https/production)
- `NEXT_PUBLIC_APP_URL` — used for password reset `redirectTo` and OAuth `callbackURL`
