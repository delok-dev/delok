# Infrastructure

## `src/lib/auth/auth-client.ts`

- Purpose: Thin wrapper over `better-auth` `createAuthClient`.
- Public API: `export const authClient` with `signUp.email`, `signIn.email`, `signIn.social`, `requestPasswordReset`, `resetPassword`, `useSession`.
- Config: `baseURL = NEXT_PUBLIC_API_URL` fallback `http://localhost:8000`, throws in production if missing.
- Consumers: `src/domains/auth/api/auth.service.ts`, `src/providers/AuthRoutingProvider.tsx`, `src/components/landing/HomeGate.tsx`, `src/views/orgs/OrganizationsPage.tsx`.
- External: `better-auth@1.6.23`.
- Backend relation: Cookie session; all `fetch` uses `credentials: include`.

## `src/lib/websocket/`

- Purpose: Singleton `WebSocketManager` (`websocket.ts`) — single WS connection shared app-wide.
- Public API: `connect()`, `disconnect()`, `subscribe(projectId)`, `unsubscribe(projectId)`, `on<T>(type, handler) => unsubscribe`. Types in `realtime.types.ts`: `RealtimeEvent = { "log.created": LogEvent, "project.log_count.updated": {projectId,logCount}}`.
- Internals: `attempt` + exponential backoff (`1s*2^attempt` cap 30s), `resubscribeAll` on open, `handleMessage` JSON parse + dispatch to `handlers` map. Validates `wss://` on https and in production.
- Consumers: `SocketProvider` (lifecycle), `useLogExplorerRealtime`, `useProjectsRealtime`.
- Backend relation: Expects messages `{type, data}` and `project.subscribe/unsubscribe` protocol. URL `NEXT_PUBLIC_WS_URL`.

## `src/providers/`

`AppProvider` composes `ThemeProvider` (`next-themes`), `QueryProvider` (`QueryClient` stale 30s), `SocketProvider`, `AuthRoutingProvider`. See `providers.md`.

## `src/constants/`

| File | Export | Consumers |
|------|--------|-----------|
| `routes.ts` | `ROUTES` (HOME, AUTH.*, ORGANIZATION.*, DOCS.*) | Navigation, sidebar, HomeGate, AuthRoutingProvider |
| `storage.ts` | `STORAGE_KEYS` + helpers `getLastProjectId/setLastProjectId/clearLastProjectId` | `ProjectPage`, `AuthRoutingProvider`, `HomeGate` |
| `assets.ts` | `ASSETS.LOGO.*`, `VIDEO.TWO` | `not-found.tsx`, `Navbar`, `Hero` |
| `external-links.ts` | `EXTERNAL_LINKS.DOCS/GITHUB/DEVELOPER` | `Navbar`, `Hero`, `Footer` |

## `src/utils/`

- `api-error.ts` — `getApiErrorMessage(body, fallback)` / `getApiErrorCode(body)` parse `{error, errorDetail, errors[0]}`.
- `format-date.ts` — `formatDateTime(iso)` via `Intl.DateTimeFormat` `en-US` medium/short.

## `src/hooks/useCooldown.ts`

Generic anti-spam lock: `useCooldown(ms=3000)` -> `{isCooldownActive, startCooldown}` with `setTimeout` + cleanup on unmount. Used in mutations (e.g., create org/project).

## Summary

Infrastructure is minimal: auth client, websocket manager, constants, two utils, one hook. Each service owns its `fetch` + `getApiBaseUrl()` — no shared fetch wrapper or analytics layer.
