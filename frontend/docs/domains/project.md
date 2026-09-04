# Domain: project

## What it solves

CRUD for projects scoped to an organization. Projects own logs and API keys. Listed under `/api/organizations/:organizationSlug/projects`.

## Location

`src/domains/project/` + views `src/views/orgs/organization/projects/*` + routes `app/(root)/orgs/[organizationSlug]/projects/*`

## Structure

```
project/
  api/project.service.ts        # listByOrganization, create, getById, update, delete
  components/
    ProjectCard.tsx, ProjectList.tsx, ProjectListSkeleton.tsx, ProjectEmptyState.tsx,
    ProjectHeader.tsx, ProjectBreadcrumb.tsx, ProjectSettings.tsx, ProjectDangerZone.tsx,
    CreateProjectModal.tsx
  hooks/
    useProjects.ts (query ["projects", slug])
    useProject.ts  (query ["project", slug, projectId])
    useProjectSettings.ts (mutations for update/delete)
    useProjectsRealtime.ts (WS project.log_count.updated -> setQueryData)
  schemas/project.schema.ts     # name trimmed 3-100
  types/project.type.ts         # Project {id, name, organizationId, logCount?, createdAt, updatedAt}
  index.ts
```

## Functionality

- **List:** `GET /api/organizations/:slug/projects` -> `ProjectList`
- **Create:** `POST .../projects` -> `CreateProjectModal` (OWNER role required)
- **Get:** `GET .../projects/:projectId` -> `ProjectPage`, `ProjectHeader`, `LogExplorer`
- **Update:** `PATCH .../projects/:projectId` -> `ProjectSettings`
- **Delete:** `DELETE .../projects/:projectId` -> `ProjectDangerZone` (cascades to ApiKeys + LogEvents)
- **Realtime:** `useProjectsRealtime` subscribes to visible `projectIds`, listens for `project.log_count.updated`, patches `["projects", slug]` cache.

## Dependencies

- External: `@tanstack/react-query`, `zod`, `fetch`, `websocketManager`
- Internal: `src/utils/api-error.ts`, `src/lib/websocket/*`, `src/constants/routes.ts`, `src/constants/storage.ts` (last project)
- Other domains: `log-explorer` consumes `project` data; `api-key` is used alongside in settings.

## Routes using it

- `/orgs/:slug/projects` -> `ProjectsPage` -> `useProjects` + `useProjectsRealtime`
- `/orgs/:slug/projects/:projectId` -> `ProjectPage` -> `useProject` + `LogExplorer`
- `/orgs/:slug/projects/:projectId/settings` -> `ProjectSettingsPage` -> `ProjectSettings` + `ApiKeyList` + `ProjectDangerZone`

## External systems

- Backend: organization-scoped project endpoints, cookie auth, OWNER checks.
