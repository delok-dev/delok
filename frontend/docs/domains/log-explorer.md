# Domain: log-explorer

## What it solves

Composes log listing, filtering, pagination, selection, and realtime streaming into a single explorer view for a project.

## Location

`src/domains/log-explorer/` + `src/domains/log/` (service/types) + `src/lib/websocket/*`

## Structure

```
log-explorer/
  components/
    LogExplorer.tsx   # layout: filters + panel + detail drawer
    LogFilters.tsx    # search, level, environment, from, to (+ clear)
    LogsPanel.tsx     # scrollable list of LogEventRow + pagination controls
  hooks/
    useLogExplorer.ts          # owns logs, pagination, filters, selectedLog, isLoading, fetchLogs
    useLogExplorerRealtime.ts  # WS subscription + matchesLogFilters gate
  utils/matchesLogFilters.ts   # client-side filter check for incoming WS logs
  index.ts
```

## Functionality

- **State (useLogExplorer):** `logs`, `pagination`, `page`, `limit` (default 50), `filters` (EMPTY_FILTERS), `selectedLog`, `isLoading`. `fetchSequence` guard prevents stale fetch. `filtersRef` + `realtimeLogIds` refs keep WS handler current.
- **Fetching:** `LogService.listByProject(projectId, page, limit, filters)` on mount / when `page|limit|filters` change (deferred via `setTimeout 0`).
- **Filters:** `setFilter(key, value)` + `clearFilters()` reset page to 1. `hasActiveFilters` derived.
- **Pagination:** `setPage`, `setLimit` (resets page).
- **Realtime:** `useLogExplorerRealtime` subscribes to `projectId`, listens for `log.created`, checks `matchesLogFilters(log, filtersRef.current)`, then `onLogReceived` prepends with `isRealtime:true` and bumps `total`.
- **Detail:** `selectLog` toggles; `closeLogDetail` clears.

## Dependencies

- External: none beyond `log` domain and WS
- Internal: `src/domains/log` (`LogService`, types, utils), `src/lib/websocket/websocket.ts`, `src/lib/websocket/realtime.types.ts`
- Other domains: `log` (required), `project` (provides `projectId`)

## Routes using it

- `/orgs/:slug/projects/:projectId` -> `ProjectPage` -> `<LogExplorer organizationSlug={slug} projectId={id} />`

## Flow

```
LogExplorer
 -> useLogExplorer({projectId})
   -> LogService.listByProject (REST)
   -> useLogExplorerRealtime (WS log.created -> matchesLogFilters -> prepend)
 -> LogFilters (controls filters)
 -> LogsPanel (renders LogEventRow list)
 -> LogDetailPanel (when selectedLog != null)
```
