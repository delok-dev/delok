# Delok Frontend Audit — Organization vs. Project Boundary

Scope of inspection: all `app/**` routes, `src/views/**`, `src/domains/{organization,project,api-key,log,log-explorer}/**`, `src/components/layout/**`, `src/providers/**`, `src/lib/**` (auth, delok client, websocket), `src/constants/**`, hooks and services. Backend behavior is only referenced where the frontend explicitly constructs requests to it. No files were modified during this audit.

---

# 1. Organization Boundary

| # | Feature | Relevant route | Relevant component/domain | Org identifier used | Evidence from code | Status |
|---|---|---|---|---|---|---|
| 1.1 | Organization list (welcome screen) | `/orgs` | `app/(root)/orgs/page.tsx` → `src/views/orgs/OrganizationsPage.tsx`, `OrganizationsOverview.tsx`, `OrganizationsPanel.tsx`, `OrganizationList.tsx`, `OrganizationCard.tsx` | `organization.slug` (for links) | `useOrganizations()` → `OrganizationService.list()` → `GET {API}/api/organization`; `OrganizationCard` links to `ROUTES.ORGANIZATION.PROJECTS(organization.slug)` | implemented |
| 1.2 | Create organization | `/orgs` | `src/domains/organization/components/CreateOrganizationModal.tsx`, `useOrganizations.ts` | none sent (name only); server assigns slug | `POST /api/organization` with `{ name }`; zod validation `organizationSchema` (3–100 chars, charset); error code `ORGANIZATION_SLUG_ALREADY_EXISTS` mapped to "Organization name is unavailable" | implemented |
| 1.3 | Search/filter organizations | `/orgs` | `OrganizationsPanel.tsx` | n/a (client-side) | `organizations.filter(o => o.name.toLowerCase().includes(query))` | implemented |
| 1.4 | "Join an organization" | `/orgs` | `src/views/orgs/components/GetStartedSection.tsx` | none | Static `<button>` with dashed border, text `COMING SOON...`, no `onClick`, no handler | placeholder (non-functional) |
| 1.5 | Organization layout / session scope | `/orgs/[organizationSlug]/**` | `app/(root)/orgs/[organizationSlug]/layout.tsx` → `src/views/orgs/organization/OrganizationLayout.tsx` | `organizationSlug` (URL param) | `useOrganization(organizationSlug)` → `GET /api/organization/:slug`; renders `Sidebar` + `Topbar`; sets `localStorage.lastOrganizationSlug`; on error renders "Organization not found" and clears stale `lastOrganizationSlug` → redirect `/orgs` | implemented |
| 1.6 | Organization overview page | `/orgs/[organizationSlug]` | `src/views/orgs/organization/OrganizationPage.tsx` | `organizationSlug` | Renders "Organization overview — This page is under development :)" plus a link to the projects page. No data beyond what the layout already loaded | placeholder |
| 1.7 | Sidebar "Overview" item | (nav) | `src/components/layout/sidebar/sidebar.config.ts` | `organizationSlug` | `disabled: true`; item renders as non-clickable `<span title="Coming soon">` in `SidebarNavigationItem.tsx` | disabled |
| 1.8 | Organization switcher | (topbar) | `src/components/layout/topbar/OrganizationSwitcher.tsx` | `organizationSlug` (current), `org.slug` (targets) | Dropdown lists `useOrganizations()`; each entry is a `Link` to `ROUTES.ORGANIZATION.PROJECTS(org.slug)`. `handleSwitch` is a no-op (`void targetSlug`) — navigation is entirely via the Link href | implemented (navigation via links only) |
| 1.9 | Rename organization | `/orgs/[organizationSlug]/settings` | `OrganizationSettingsView.tsx`, `OrganizationSettings.tsx`, `useOrganization.ts`, `organization.service.ts` | `organizationSlug` (old slug in URL) | `PATCH /api/organization/:slug` with `{ name }`; on success caches under both old and new slug keys, replaces entity in list by `id`; if `updated.slug !== organizationSlug` the view redirects to `ROUTES.ORGANIZATION.PROJECTS(updated.slug)` | implemented |
| 1.10 | Delete organization | `/orgs/[organizationSlug]/settings` | `OrganizationDangerZone.tsx`, `OrganizationSettingsView.tsx` | `organizationSlug` | `DELETE /api/organization/:slug`; ConfirmModal requires typing the org name; on success toast + `router.replace(ROUTES.ORGANIZATION.ROOT)`. Service doc-comment claims cascade "to projects, API keys, members" (comment, not verifiable from frontend) | implemented |
| 1.11 | Organization timestamps display | settings page | `OrganizationSettingsView.tsx` | n/a | Renders `createdAt`/`updatedAt` via `formatDateTime` when present | implemented |
| 1.12 | Members management | — | `sidebar.config.ts` ("Members" item) | — | Item `href: () => "#", disabled: true, isActive: () => false`. No members UI, service, hook, or route exists anywhere in `src/` | placeholder (disabled nav entry only) |
| 1.13 | Role/permission UI | — | none | — | No role checks, role badges, or permission gating in any component. Role is mentioned only in static legal copy (`TermsPage.tsx`, `PrivacyPage.tsx`) and code comments (`project.service.ts` "Requires org OWNER role") | Not implemented in UI; authorization assumptions are comments only |
| 1.14 | Organization localStorage persistence | (global) | `OrganizationLayout.tsx`, `AuthRoutingProvider.tsx`, `HomeGate.tsx` | `organizationSlug` | `STORAGE_KEYS.LAST_ORGANIZATION_SLUG = "lastOrganizationSlug"` set on successful org load; consumed by redirect providers | implemented |

---

# 2. Project Boundary

| # | Feature | Relevant route | Relevant component/domain | Project identifier used | Evidence from code | Status |
|---|---|---|---|---|---|---|
| 2.1 | Project list for an organization | `/orgs/[organizationSlug]/projects` | `src/views/orgs/organization/projects/ProjectsPage.tsx`, `ProjectList.tsx`, `ProjectCard.tsx`, `useProjects.ts` | `project.id` (for links), `project.logCount` (display) | `useProjects(organizationSlug)` → `GET /api/organizations/:organizationSlug/projects`; client-side sorting (`created-desc/asc`, `updated-desc`); count display; `ProjectCard` links to `ROUTES.ORGANIZATION.PROJECT(organizationSlug, project.id)` | implemented |
| 2.2 | Create project | `/orgs/[organizationSlug]/projects` | `CreateProjectModal.tsx`, `useProjects.ts` | created inside `organizationSlug` context | `POST /api/organizations/:organizationSlug/projects` with `{ name }`; zod `projectSchema` (3–100 chars); invalidates `["projects", organizationSlug]` cache | implemented |
| 2.3 | Project page (workspace) | `/orgs/[organizationSlug]/projects/[projectId]` | `src/views/orgs/organization/projects/project/ProjectPage.tsx` | `projectId` (URL param) | `useProject(organizationSlug, projectId)` → `GET /api/organizations/:organizationSlug/projects/:projectId`; renders `ProjectHeader` + `LogExplorer`; sets `lastProjectId(organizationSlug, projectId)` after successful load; "Project not found" state with "Back to Projects" | implemented |
| 2.4 | Project header | project page | `src/domains/project/components/ProjectHeader.tsx`, `ProjectBreadcrumb.tsx` | `organizationSlug`, `projectId` | Sticky header: breadcrumb `Projects / {projectName}` + `Settings` link to `ROUTES.ORGANIZATION.PROJECT_SETTINGS(...)` | implemented |
| 2.5 | Rename project | `/orgs/[organizationSlug]/projects/[projectId]/settings` | `ProjectSettings.tsx`, `useProjectSettings.ts`, `useProjects.ts` | `organizationSlug` + `projectId` | `PATCH /api/organizations/:organizationSlug/projects/:projectId` with `{ name }`; cache updated at `["project", orgSlug, project.id]` and list invalidated | implemented |
| 2.6 | Delete project | project settings | `ProjectDangerZone.tsx`, `ProjectSettingsView.tsx`, `useProjectSettings.ts` | `organizationSlug` + `projectId` | `DELETE /api/organizations/:organizationSlug/projects/:projectId`; ConfirmModal requires typing project name; view redirects to `ROUTES.ORGANIZATION.PROJECTS(organizationSlug)` after success | implemented |
| 2.7 | Project timestamps display | project settings | `ProjectSettingsView.tsx` | n/a | Renders `createdAt`/`updatedAt` when present | implemented |
| 2.8 | Project breadcrumb (settings context) | project settings | `ProjectSettingsPage.tsx` + `ProjectBreadcrumb.tsx` | `organizationSlug`, `projectId` | `Projects / {projectName} / Settings` with `settings` prop | implemented |
| 2.9 | Realtime log-count badge | projects list | `ProjectCard.tsx` + `useProjectsRealtime.ts` | `projectId` (subscription), `organizationSlug` (cache key) | `project.log_count.updated` events update `logCount` in the `["projects", organizationSlug]` cache; `ProjectCard` flashes the count via Web Animations API | implemented |
| 2.10 | Last-project shortcut (per org) | sidebar | `SidebarNavigationItem.tsx`, `ProjectPage.tsx`, `ProjectsPage.tsx`, `src/constants/storage.ts` | `organizationSlug` → `projectId` map | Clicking sidebar "Projects": reads `lastProjectByOrganization[orgSlug]`, pre-validates with `ProjectService.getById(orgSlug, projectId)`, then pushes the project route; on failure clears the stored id and falls back to the list. `ProjectPage` writes it; `ProjectsPage` clears it on mount (`clearLastProjectId(organizationSlug)`) | implemented |

Project type as represented in code (`src/domains/project/types/project.type.ts`): `{ id, name, organizationId, logCount?, createdAt?, updatedAt? }`.

---

# 3. Organization → Project Relationship

**How the frontend actually represents it:**

```
Organization (identified by slug in URL + API paths)
  └── Project (identified by id, always addressed under an organizationSlug path)
```

- **Where `organizationSlug` comes from:** the URL segment `[organizationSlug]`, read via `useParams()` in `OrganizationLayout.tsx`, `ProjectsPage.tsx`, `ProjectPage.tsx`, `ProjectSettingsPage.tsx`, `OrganizationSettingsPage.tsx`, and passed as a prop into `Sidebar`, `Topbar`, `ProjectHeader`, `LogExplorer`, `CreateProjectModal`, `ProjectList`. It is also persisted to `localStorage.lastOrganizationSlug` by `OrganizationLayout`.
- **Where `projectId` comes from:** the URL segment `[projectId]` (`ProjectPage.tsx`, `ProjectSettingsPage.tsx`), or from the projects list payload (`project.id`) when linking from `ProjectCard`/sidebar shortcut.
- **How project pages are reached:** (a) `OrganizationCard` → `/orgs/:slug/projects` → `ProjectCard` → `/orgs/:slug/projects/:projectId`; (b) sidebar "Projects" click → last-project shortcut (`SidebarNavigationItem.tsx`); (c) browser URLs. There is no global project picker.
- **Can projects exist outside an organization?** No, per the frontend's own API construction. Every project endpoint is mounted under an organization: `ProjectService` uses `/api/organizations/:organizationSlug/projects[/:projectId]`. The only project-scoped endpoints that omit the org slug are log listing (`/api/projects/:projectId/logs`) and API-key listing/creation (`/api/projects/:projectId/api-keys`) — both still take a `projectId` that the frontend only ever obtains from an org-scoped context. There is no UI route, service, or state that renders a project without an `organizationSlug` present.
- **Is project data always loaded within organization context?** Yes for project CRUD (`useProject`/`useProjects`/`useProjectSettings` all require `organizationSlug`). Exceptions inside the project context: `LogService.listByProject(projectId)` and `ApiKeyService` (list/create take `projectId` only; rename/revoke take the key `id` only). The React Query cache keys are mixed: projects are keyed `["projects", organizationSlug]`, but API keys are keyed `["api-keys", projectId]` and logs are not React-Query-cached at all (local `useState` in `useLogExplorer`).
- **Organization-first or project-first navigation?** Organization-first. All URL construction is rooted at `/orgs/:organizationSlug/...`; redirects (`AuthRoutingProvider`, `HomeGate`) land on an organization's projects page, never a project directly; the sidebar and switcher are org-scoped. The only project-affinity mechanism is the last-project shortcut piggybacking on the org-scoped "Projects" sidebar item.

---

# 4. Project Workspace

What the user actually sees/uses at `/orgs/[organizationSlug]/projects/[projectId]` (implemented in `ProjectPage.tsx`):

1. **Main project page** — `ProjectPage.tsx`. Loading state (`Loader "Loading project"`), error state ("Project not found / This project doesn't belong to this organization or you don't have permission to access it." + "Back to Projects" button), then the workspace below. This is the *only* project page; there is no dashboard, overview tab, or additional project sub-pages.
2. **Project header** — `ProjectHeader.tsx`: sticky bar with `ProjectBreadcrumb` (`Projects / {name}`) and a `Settings` link. That is the header's entire functionality.
3. **Log explorer** — `LogExplorer.tsx` (from `src/domains/log-explorer`), filling the rest of the page:
   - `LogsPanel.tsx`: log table (Date, Time, Level, Environment, Event columns), realtime row-flash, resizable/overlay `LogDetailPanel` drawer (event, level, environment, occurredAt, message, JSON payload), per-page limit selector (50/100/250), pagination.
   - `LogFilters.tsx`: search (debounced 300ms), level select (info/warn/error/fatal), environment select (development/staging/production), from/to date filters, clear button, compact/expanded responsive modes.
   - Data via `LogService.listByProject(projectId, page, limit, filters)` → `GET /api/projects/:projectId/logs?...`.
   - Empty state (no logs, no filters): "Generate an API key and connect it to your project to start streaming events." with a `Generate API key` link to `${PROJECT_SETTINGS}#api-keys`.
   - Realtime via `useLogExplorerRealtime` (`log.created` for the subscribed `projectId`, client-side filtered by `matchesLogFilters`).
4. **Project settings** — reached only via the header's Settings link or direct URL: `/orgs/[organizationSlug]/projects/[projectId]/settings` (`ProjectSettingsPage.tsx` → `ProjectSettingsView.tsx`).
5. **API key management** — *inside Project Settings only* (section `#api-keys`): `ApiKeyList` + `GenerateApiKeyModal` — list with `keyPrefix********`, `lastUsedAt`, revoked badge; generate (one-time reveal + copy), rename (inline), revoke (confirm modal). No dedicated route exists.
6. **Project deletion** — inside Project Settings only, bottom "Danger zone" (`ProjectDangerZone`), name-typing confirmation, redirect to org projects list.

Categories that do **not** exist in code for a project: dashboards/overview, environments management, members/roles per project, webhooks, integrations, usage/billing. None of these are present in any form.

---

# 5. Settings Boundary

**Organization Settings** — `/orgs/[organizationSlug]/settings`
- Files: `app/(root)/orgs/[organizationSlug]/settings/page.tsx` → `OrganizationSettingsPage.tsx` → `OrganizationSettingsView.tsx`; components `OrganizationSettings.tsx`, `OrganizationDangerZone.tsx`.
- UI: no breadcrumb; `max-w-4xl` column with Created/Last-updated, "General" rename form, "Danger zone".
- Capabilities: rename organization (regenerates slug; redirect to new slug's projects page), delete organization (redirect `/orgs`).
- Data modified: `PATCH`/`DELETE /api/organization/:slug` — organization entity only.
- Authorization assumptions visible: none enforced in UI. No role check, no disabled state per role. `organization.service.ts` comments state the creator "becomes the OWNER" and delete "cascades to projects, API keys, members" — comments only. Loading/not-found handled by `OrganizationLayout`.

**Project Settings** — `/orgs/[organizationSlug]/projects/[projectId]/settings`
- Files: `ProjectSettingsPage.tsx` → `ProjectSettingsView.tsx`; components `ProjectSettings.tsx` (rename), `ApiKeyList.tsx`/`GenerateApiKeyModal.tsx` (keys), `ProjectDangerZone.tsx` (delete); `ProjectBreadcrumb` with `settings` prop.
- UI: sticky header with project breadcrumb; Created/Last-updated; "General" (rename; helper text "Change the name of your project or manage the API Keys"); "API keys" section; "Danger zone" (delete).
- Data modified: `PATCH/DELETE /api/organizations/:organizationSlug/projects/:projectId` (project), `/api/projects/:projectId/api-keys` (list/create), `/api/api-key/:id` (rename), `/api/api-key/:id/revoke` (revoke).
- Authorization assumptions visible: none enforced in UI. `project.service.ts` comments claim create/update/delete "Require org OWNER role"; the not-found copy mentions permission failure, but the frontend cannot distinguish "not found" from "no permission" — both render the same error state.

Shared pattern: both settings screens use zod schemas (`organizationSchema`, `projectSchema`, `apiKeySchema`), `useCooldown` anti-spam locks, and `ConfirmModal` with typed-name confirmation for destructive actions. There is no shared settings shell component; each page implements its own.

---

# 6. Navigation Boundary

**Sidebar** (`Sidebar.tsx`, rendered only inside `OrganizationLayout`, receives `organizationSlug`):
- Items from `sidebar.config.ts`: Overview (disabled), Projects (active for `/orgs/:slug/projects` and any `/orgs/:slug/project...` path — i.e., project page and project settings), Members (disabled, `href="#"`), Settings (`/orgs/:slug/settings`).
- No project-level items. Collapse/pin behavior is purely visual.

**Topbar** (`Topbar.tsx`, inside org layout): `OrganizationSwitcher` (current org initial + name; dropdown lists the user's orgs linking to each org's projects page), Docs link, `ThemeToggle`, `UserMenu` (profile + logout). No project indicator, no project switcher.

**OrganizationsTopbar** (on `/orgs` only): logo, Docs, theme, user menu. No switcher.

**Project list navigation**: `/orgs` cards → org projects page; org projects page cards → project page. `OrganizationSwitcher` links go to org **projects** pages (never org overview, never a project).

**Project breadcrumb**: `ProjectBreadcrumb.tsx` — `Projects` → `{projectName}` → `Settings` (settings context only). Root of the breadcrumb is the org's projects list, not the org root.

**Project settings navigation**: entry points are (a) `ProjectHeader` Settings link, (b) direct URL, (c) `LogExplorer` empty-state "Generate API key" anchor link (`#api-keys`). Exit is manual (breadcrumb) or automatic after project deletion (redirect to org projects list).

**Redirects:**
- `OrganizationsLayout.tsx`: unauthenticated users on any `/orgs` route → `/sign-in`.
- `AuthRoutingProvider.tsx` (app-wide): authenticated users on paths other than `/orgs...`, `/docs...`, `/privacy`, `/terms` → `ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)` if `lastOrganizationSlug` exists, else `/orgs`.
- `HomeGate.tsx`: authenticated users hitting `/` → same last-org-projects-or-`/orgs` logic.
- `OrganizationLayout.tsx`: if the loaded org errors and it matches the stored `lastOrganizationSlug`, clears the key and redirects to `/orgs`.
- `OrganizationSettingsView.tsx`: after rename with slug change → new slug's projects page.
- `ProjectSettingsView.tsx`: after project deletion → org projects page.

**Last-project behavior**: `lastProjectByOrganization` (JSON map orgSlug → projectId). Written by `ProjectPage` on successful load; read by `SidebarNavigationItem` when "Projects" is clicked (with a `getById` pre-validation before navigation); cleared by `ProjectsPage` on mount. No redirect *into* the last project happens automatically — it only modifies what the sidebar "Projects" click does.

**Classification: A. organization-first.** Evidence: URL hierarchy rooted at `/orgs/:organizationSlug`; all redirects land on org-level pages; sidebar and switcher are org-scoped; the project workspace has no nav presence of its own beyond being nested under the org "Projects" item. There is no project-first or dual-nav structure anywhere in the code.

---

# 7. API Key Boundary

- **Organization-scoped or project-scoped?** Project-scoped in the frontend. The domain is `src/domains/api-key`, the hook is `useProjectApiKeys(projectId)`, and the type comment in `ApiKeyList.tsx` says "API keys authenticate requests made to this project."
- **Where can users access them?** Only as a section of Project Settings (`ProjectSettingsView.tsx` renders `<ApiKeyList>`), plus the one-time generate modal (`GenerateApiKeyModal`).
- **Dedicated route?** No. There is no `/api-keys` route anywhere in `app/`. The only deep-link is the anchor `${ROUTES.ORGANIZATION.PROJECT_SETTINGS(organizationSlug, projectId)}#api-keys`, built in `LogExplorer.tsx` for the log empty state.
- **Part of Project Settings?** Yes — a section with id `api-keys` inside the project settings page, between the rename form and the danger zone.
- **Identifiers passed when managing them:**
  - List/create: `projectId` only — `GET/POST /api/projects/:projectId/api-keys`. The `organizationSlug` is *not* passed to these calls (it is present in the page context but unused by the API-key service).
  - Rename: key `id` only — `PATCH /api/api-key/:id`.
  - Revoke: key `id` only — `PATCH /api/api-key/:id/revoke`.
  - React Query cache key: `["api-keys", projectId]` — no organization dimension.

---

# 8. Realtime Boundary

- **SocketProvider** (`src/providers/SocketProvider.tsx`): calls `websocketManager.connect()` on mount, `disconnect()` on unmount. Mounted in `app/(root)/orgs/layout.tsx` only — the comment in `AppProvider.tsx` states it is intentionally excluded from the app root so the connection exists "only inside the authenticated organization area, never on public pages."
- **websocket manager** (`src/lib/websocket/websocket.ts`): single shared `WebSocket` to `NEXT_PUBLIC_WS_URL` (default `ws://localhost:8000` in dev); `subscribe(projectId)` sends `{ type: "project.subscribe", data: { projectId } }`; `unsubscribe` sends `project.unsubscribe`; resubscribes all after reconnect; exponential backoff (1s→30s). Subscription units are **project ids**; there is no organization-level subscribe message.
- **Event types** (`realtime.types.ts`): exactly two — `log.created` (payload includes `projectId`) and `project.log_count.updated` (`{ projectId, logCount }`).
- **Project subscriptions in use:**
  - `useLogExplorerRealtime.ts` (project page): subscribes to the open project's id; handles `log.created`, guards `log.projectId !== projectId`, applies client-side filters, prepends to the list, marks `isRealtime` (row flash animation in `LogEventRow`).
  - `useProjectsRealtime.ts` (org projects list page): subscribes to *every visible project's id* (`sortedProjects.map(p => p.id)`); handles `project.log_count.updated`, updates `logCount` in the `["projects", organizationSlug]` cache (flash animation in `ProjectCard`).
- **Conclusion:** the connection lifecycle is mounted at the organization-area level, but **all subscriptions and all handled events are project-scoped**. There is no organization-level channel, no org-level event, and no org-scoped realtime data handling in the code. Realtime is: connection = org-area-wide; data = project-level only, consumed on both the org projects list page and the project page.

---

# 9. Actual Frontend Information Architecture

Constructed strictly from routes and rendered components:

```
Delok
├── Public
│   ├── Home (/)                       — marketing page; signed-in users are redirected away (HomeGate)
│   ├── Docs (/docs, /docs/introduction, /quickstart, /installation, /logging, /reference/log-event)
│   ├── Legal (/privacy, /terms)
│   └── Auth
│       ├── Sign in (/sign-in)
│       └── Auth error (/auth/error)
│
└── Authenticated  [session gate: OrganizationsLayout; WebSocket connection mounted here]
    └── Organizations (/orgs)          — list, search, create organization; "Join an organization" stub (COMING SOON)
        └── Organization (/orgs/[organizationSlug])
            ├── Overview (/orgs/:slug)             — placeholder "under development" + link to projects
            ├── Projects (/orgs/:slug/projects)    — list, sort, create project; realtime log counts
            ├── Settings (/orgs/:slug/settings)    — rename (slug-regenerating), delete organization
            └── Project (/orgs/:slug/projects/[projectId])
                ├── Workspace (/)                  — project header (breadcrumb + settings link) + log explorer
                │   ├── Log table (filters, pagination, per-page limit)
                │   ├── Log detail drawer
                │   └── Realtime (log.created)
                └── Settings (/orgs/:slug/projects/[projectId]/settings)
                    ├── Created / Last updated
                    ├── General (rename project)
                    ├── API keys (generate / rename / revoke)
                    └── Danger zone (delete project)

Disabled/placeholder nav entries inside Organization scope: Overview (sidebar, disabled), Members (sidebar, disabled, href "#"), Join an organization (COMING SOON).
```

---

# 10. Evidence Table

| Concept | Scope | Route | Actual implementation | Status |
|---|---|---|---|---|
| Organization | Top-level tenant; slug-keyed in URL and API (`/api/organization/:slug`) | `/orgs`, `/orgs/:slug`, `/orgs/:slug/settings` | List/search/create (`useOrganizations`), layout with session gate + localStorage, rename w/ slug regeneration + redirect, delete w/ typed confirmation, switcher dropdown. Overview page is a placeholder. | implemented (overview: placeholder) |
| Project | Nested under org; id-keyed under org slug path (`/api/organizations/:orgSlug/projects/:projectId`) | `/orgs/:slug/projects`, `/orgs/:slug/projects/:projectId`, `.../settings` | List/sort/create, workspace page, rename, delete (typed confirmation + redirect), timestamps, last-project shortcut per org, realtime log-count flash. | implemented |
| Logs | Project-scoped (`/api/projects/:projectId/logs`); no org-level log endpoint used | `/orgs/:slug/projects/:projectId` (log explorer is the project page body) | Fetch with page/limit/search/level/environment/from/to; table, filters, detail drawer, pagination; realtime prepend + flash; empty state links to API keys. | implemented |
| API Keys | Project-scoped (hook `useProjectApiKeys(projectId)`; cache `["api-keys", projectId]`) | No dedicated route; section `#api-keys` in project settings | List (prefix, lastUsedAt, revokedAt), generate w/ one-time reveal + copy, rename, revoke w/ typed confirmation. Rename/revoke address the key by `id` only. | implemented (UI); full-key display is client-side masked after copy |
| Members | Sidebar entry only | none | `sidebar.config.ts` "Members": `href: () => "#", disabled: true`. No components, service, hook, or route. | placeholder (disabled) |
| Settings | Two separate screens: org settings and project settings; no shared shell | `/orgs/:slug/settings`, `/orgs/:slug/projects/:projectId/settings` | Org: rename + delete. Project: rename + API keys + delete. No role/permission UI in either; role claims exist only in code comments and legal copy. | implemented |
| Realtime | Connection mounted org-area-wide (`SocketProvider` in `/orgs` layout); subscriptions and events are project-scoped only (`project.subscribe` per `projectId`) | active on projects list page and project page | WebSocket manager w/ reconnect + resubscribe; `log.created` → log explorer; `project.log_count.updated` → project list cache. No org-level events. | implemented |

---

# 11. Documentation Corrections

Audited against the statement: **"Project is the center of the workspace."**

1. **"Users land in a project / the app opens into a project."**
   - Actual: Signed-in users are redirected to `ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)` or `/orgs` (`AuthRoutingProvider.tsx`, `HomeGate.tsx`). Entry is an organization's projects list, never a project.
   - Factual wording: "Signed-in users land on their last organization's projects list, or on the organizations page if none is recorded."

2. **"Projects are directly addressable / a project URL identifies a workspace."**
   - Actual: every project URL is `/orgs/:organizationSlug/projects/:projectId...`; project CRUD calls require the organization slug (`project.service.ts`). A bare project id has no route.
   - Factual wording: "Projects are addressed within an organization: `/orgs/{organizationSlug}/projects/{projectId}`."

3. **"The sidebar is the project's navigation."**
   - Actual: the sidebar is rendered by `OrganizationLayout`, receives `organizationSlug` only, and its items (Overview, Projects, Members, Settings) are all organization-scoped. Two of four items are disabled placeholders.
   - Factual wording: "Navigation inside an organization is organization-scoped; project pages are reached from the organization's Projects item."

4. **"There is a project switcher / users move between projects from the topbar."**
   - Actual: the topbar contains an `OrganizationSwitcher` only. Its dropdown links to each organization's **projects** page. No project switcher exists.
   - Factual wording: "The topbar provides organization switching; changing projects goes through the organization's projects list (or the per-organization last-project shortcut in the sidebar)."

5. **"The organization overview is the org home."**
   - Actual: `/orgs/:slug` renders "This page is under development :)" with a link to Projects (`OrganizationPage.tsx`), and the sidebar Overview item is `disabled: true`.
   - Factual wording: "The organization overview is a placeholder; the projects list is the functional organization landing page."

6. **"Members management exists at the organization level."**
   - Actual: the Members sidebar item is a disabled placeholder (`href: "#"`); no members UI or service exists in the frontend. Role (Owner/Member) appears only in legal copy and service comments.
   - Factual wording: "Members management is not present in the frontend; a disabled 'Members' navigation entry is the only trace." (Backend membership behavior: not established from frontend evidence, beyond the delete-cascade comment in `organization.service.ts`.)

7. **"API keys are managed at the organization level" (or left ambiguous).**
   - Actual: `useProjectApiKeys(projectId)`; endpoints `/api/projects/:projectId/api-keys`; UI lives solely in Project Settings section `#api-keys`; no dedicated route; the log explorer's empty state deep-links there. `organizationSlug` is not passed to API-key calls.
   - Factual wording: "API keys are per-project and managed in Project Settings under 'API keys'."

8. **"Logs are browsable across an organization."**
   - Actual: `LogService.listByProject(projectId)` only; the log explorer is rendered inside a single project's page. No cross-project or org-level log view exists.
   - Factual wording: "Logs are viewed per project in the project workspace. Aggregated organization-level log viewing is not implemented in the frontend."

9. **"Realtime updates flow at the organization level."**
   - Actual: the WebSocket connection is opened for the whole `/orgs` area, but subscriptions are per-project (`project.subscribe` with `projectId`) and the only handled events are `log.created` and `project.log_count.updated`, both project-keyed.
   - Factual wording: "Realtime is delivered per project subscription; the projects list subscribes to its visible projects to update log counts, and the project page subscribes to stream logs."

10. **"Permissions/roles are enforced in the product UI."**
    - Actual: no role checks, gating, or role display in any component; failure states for projects use generic "not found or no permission" copy; `project.service.ts` "Requires org OWNER role" statements are comments about expected backend behavior, not frontend logic.
    - Factual wording: "The frontend does not implement role-based UI; authorization is not established from frontend evidence."

11. **"Project settings include configuration beyond name/keys/deletion."**
    - Actual: Project Settings contains exactly: timestamps display, rename, API keys, delete. Nothing else.
    - Factual wording: "Project Settings covers rename, API key management, and deletion."

**Items that cannot be established from the frontend** (explicitly): backend enforcement of OWNER role, organization deletion cascade, whether API-key rename/revoke validate project membership server-side (frontend sends key `id` only), and whether the WebSocket server authenticates per organization (the client sends no organization identifier on connect or subscribe).
