# Domain: log

## What it solves

Type definitions, API fetching, and presentation for individual log events. Consumed by `log-explorer`.

## Location

`src/domains/log/`

## Structure

```
log/
  api/log.service.ts            # listByProject(projectId, page, limit, filters) -> LogResponse
  components/
    LogEventRow.tsx              # row with level, event, message, time, realtime flash
    LogDetailPanel.tsx           # drawer with full payload, timestamps
  types/log.type.ts              # LogEvent, LogLevel, LogFiltersState, LogPagination, LogResponse
  utils/format.ts                # formatLogDate, formatLogTime, formatLogTimestamp
  index.ts
```

## Functionality

- **Types:** `LogEvent {id, projectId, environment, level, event, message, occurredAt, receivedAt, payload, isRealtime?}`. `LogFiltersState {search, level, environment, from, to}`. `LogPagination {page, totalPages, hasNextPage, hasPreviousPage, total}`.
- **API:** `GET /api/projects/:projectId/logs?page=&limit=&search=&level=&environment=&from=&to=` via `URLSearchParams`. Returns `{logs, pagination}` inside `data`.
- **Format:** `utils/format.ts` wraps `format-date.ts` for display.
- **Components:** `LogEventRow` is used in `LogsPanel`; `LogDetailPanel` shows selected log.

## Dependencies

- External: `fetch`
- Internal: `src/lib/websocket/realtime.types.ts` (event shape matches), `src/utils/format-date.ts`
- Other domains: none directly; `log-explorer` depends on `log`.

## Routes using it

Indirectly via `log-explorer` on `/orgs/:slug/projects/:projectId`.

## External systems

- Backend: `/api/projects/:projectId/logs` (filtering, pagination).
