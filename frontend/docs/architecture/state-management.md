# State Management

| Mechanism | Where | Purpose |
|-----------|-------|---------|
| **React `useState` / `useCallback` / `useRef`** | `useLogExplorer` (`src/domains/log-explorer/hooks/useLogExplorer.ts`), `useCooldown` | Local UI state: logs, pagination, filters, selectedLog, cooldown |
| **TanStack React Query** | `useOrganizations`, `useProjects`, `useProject`, `useProjectApiKeys` (`src/domains/api-key/hooks/useProjectApiKeys.ts`), `QueryProvider` | Server state: organizations, projects, api-keys. Caching and invalidation |
| **Context (next-themes)** | `ThemeProvider` | Theme preference |
| **URL state (Next.js)** | `useParams` in `ProjectPage`, `searchParams` in `LogService` | Route params `organizationSlug`, `projectId`; log filters as query params |
| **localStorage** | `src/constants/storage.ts`, `AuthRoutingProvider`, `ProjectPage` | `lastOrganizationSlug`, `lastProjectByOrganization` JSON map |
| **WebSocket state** | `websocketManager` (`src/lib/websocket/websocket.ts`) singleton + realtime hooks | Realtime logs and `log_count` updates |
| **Cookies** | `fetch(..., {credentials:"include"})` in all services, `better-auth` | Session cookie for authenticated API calls |
| **React Query cache as store** | `useProjectsRealtime` via `queryClient.setQueryData` | Updates `["projects", organizationSlug]` without refetch |

## TanStack Query Keys

- `["organizations"]` — `useOrganizations`
- `["organization", slug]` — `useOrganization`
- `["projects", organizationSlug]` — `useProjects`
- `["project", organizationSlug, projectId]` — `useProject`
- `["api-keys", projectId]` — `useProjectApiKeys`
- Invalidated on mutations via `invalidateQueries`.

## Log Explorer State

- `useLogExplorer` owns `logs`, `pagination`, `page`, `limit`, `filters`, `selectedLog`, `isLoading`.
- Fetch via `LogService.listByProject`. Sequence guard (`fetchSequence` ref) prevents stale responses.
- `websocketManager` pushes `log.created` into `logs` when `matchesLogFilters` passes.

## Cooldown

`useCooldown` (`src/hooks/useCooldown.ts`) is a local timer (default 3000ms) used to prevent repeated mutations.

## Limitations

- Authentication uses cookies; no token is stored in `localStorage`.
- Log filters are local state in `useLogExplorer`, not synced to `searchParams` — deep linking to a filtered view is not supported.
- No additional global stores beyond `next-themes`.
