# Domain: api-key

## What it solves

Lifecycle for project API keys used by the Delok SDK to ingest logs. Keys are shown once on creation (full `key` returned).

## Location

`src/domains/api-key/` + used in `src/views/orgs/organization/projects/project/settings/*`

## Structure

```
api-key/
  api/api-key.service.ts        # listByProject, create (returns key string), rename, revoke
  components/
    ApiKeyList.tsx              # table with name, prefix, createdAt, lastUsedAt, revokedAt, rename/revoke actions
    GenerateApiKeyModal.tsx     # create form (name) -> shows key once
  hooks/useProjectApiKeys.ts    # query ["api-keys", projectId] + mutations create/rename/revoke with invalidate
  schemas/api-key.schema.ts     # name trimmed 3-100
  types/api-key.type.ts         # ApiKey {id, name, keyPrefix, createdAt, lastUsedAt, revokedAt}, CreateApiKeyInput
  index.ts
```

## Functionality

- **List:** `GET /api/projects/:projectId/api-keys` -> `ApiKeyList`
- **Create:** `POST /api/projects/:projectId/api-keys` `{name}` -> returns `{key}` (full secret). `GenerateApiKeyModal` displays it once.
- **Rename:** `PATCH /api/api-key/:id` `{name}`
- **Revoke:** `PATCH /api/api-key/:id/revoke`
- **Cache:** `useProjectApiKeys` invalidates `["api-keys", projectId]` on every mutation.

## Dependencies

- External: `@tanstack/react-query`, `zod`, `fetch`
- Internal: `src/components/ui/*` (Modal, Input, Button), `src/hooks/useCooldown.ts`
- Other domains: `project` (projectId scope)

## Routes using it

- `/orgs/:slug/projects/:projectId/settings` -> `ProjectSettingsView` -> `ApiKeyList` + `GenerateApiKeyModal`

## External systems

- Backend: API key storage; keys are project-scoped; `keyPrefix` shown in list for identification.
