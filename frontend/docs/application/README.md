# Application

## Capabilities

| Capability | Implementation |
|------------|---------------|
| Landing | `app/page.tsx`, `src/components/landing/*` (Hero, LogInvestigation, ProjectsAwareness, FindSignal, GetStarted) |
| Documentation site | `app/docs/*`, `src/components/docs/*` (5 pages + index) |
| Sign up / sign in (email+password) | `src/domains/auth/components/SignUpForm.tsx`, `SignInForm.tsx` via `better-auth` |
| Social login (Google, GitHub) | `src/domains/auth/components/SocialLogin.tsx` via `AuthService.signInGoogle/Github` |
| Email verification | `src/views/auth/VerifyEmailPage.tsx`, `EmailVerifiedPage.tsx` |
| Forgot / reset password | `ForgotPasswordForm`, `ResetPasswordForm` |
| Organizations CRUD | `src/domains/organization/*`, `src/views/orgs/*` (list, create, getBySlug, update, delete) |
| Projects CRUD (per org) | `src/domains/project/*`, `src/views/orgs/organization/projects/*` (listByOrganization, create, getById, update, delete) |
| Project log explorer | `src/domains/log-explorer/components/LogExplorer.tsx`, `src/views/orgs/organization/projects/project/ProjectPage.tsx` (paginated list + filters + detail panel) |
| API keys (per project) | `src/domains/api-key/*` (list, create, rename, revoke) |
| Realtime logs | `src/domains/log-explorer/hooks/useLogExplorerRealtime.ts` (`log.created`) |
| Realtime project log counts | `src/domains/project/hooks/useProjectsRealtime.ts` (`project.log_count.updated`) |
| 404 page | `app/not-found.tsx` |

## User Flows

### Authentication

```
Visit / -> AuthRoutingProvider checks session
 ├─ unauthenticated: stay on landing, click Sign In / Sign Up (ROUTES.AUTH.*) -> forms -> better-auth -> toasts + redirect
 └─ authenticated + not on /orgs or /docs -> redirect to /orgs/:lastOrg/projects or /orgs
SignUp -> Verify Email (/sign-up/verify-email) -> Verified (/sign-up/verified)
SignIn -> Forgot Password (/sign-in/forgot-password) -> Reset Password (/sign-in/reset-password?token=...)
Social -> OAuth callback -> HOME -> AuthRoutingProvider redirects to orgs
```

### Organization

```
 /orgs (OrganizationsPage) -> OrganizationList / OrganizationEmptyState
  ├─ Create Organization (CreateOrganizationModal -> POST /api/organization -> invalidate ["organizations"])
  └─ Click org card -> /orgs/:slug (OrganizationPage) -> sets localStorage lastOrganizationSlug

 /orgs/:slug/settings (OrganizationSettingsView) -> OrganizationSettings (rename) + OrganizationDangerZone (delete)
```

### Project

```
 /orgs/:slug/projects (ProjectsPage) -> ProjectList / ProjectEmptyState
  ├─ Create Project (CreateProjectModal -> POST /api/organizations/:slug/projects)
  └─ Click project -> /orgs/:slug/projects/:projectId (ProjectPage)

 ProjectPage: useProject fetches -> setLastProjectId(slug, projectId) -> <LogExplorer>

 /orgs/:slug/projects/:projectId/settings (ProjectSettingsView) -> ProjectSettings + ApiKeyList/GenerateApiKeyModal + ProjectDangerZone
```

### Log Explorer

```
LogExplorer (layout: LogFilters top, LogsPanel list, LogDetailPanel drawer)
 ├─ Filters: search, level, environment, from, to (useLogExplorer -> LogService.listByProject with URLSearchParams)
 ├─ Pagination: page/limit (limit via setLimit, page via setPage)
 ├─ Realtime: useLogExplorerRealtime subscribes to projectId, filters via matchesLogFilters, prepends isRealtime logs
 └─ Detail: click row -> selectLog -> LogDetailPanel shows payload, timestamps (formatLogDate/Time)
```

### Navigation and Persistence

- `Sidebar` + `Topbar` inside `OrganizationLayout` drive org/project switching.
- `OrganizationSwitcher` and `UserMenu` in Topbar.
- `lastOrganizationSlug` and `lastProjectByOrganization` in localStorage drive redirects and "return to last" behavior.

### Docs

- `/docs` sections: Getting Started (Introduction, Quickstart), SDK (Installation, Logging), Reference (Log Event)
- `/docs/*` uses `DocsLayout` (`DocsNavbar` + `DocsSidebar` + `DocsSearch`)

## Route to API Mapping

```
 /orgs                              -> organization -> OrganizationsPage -> useOrganizations      -> GET /api/organization
 /orgs/:slug                        -> organization -> OrganizationPage  -> useOrganization       -> GET /api/organization/:slug
 /orgs/:slug/projects               -> project       -> ProjectsPage      -> useProjects (+ realtime) -> GET /api/organizations/:slug/projects + WS project.log_count.updated
 /orgs/:slug/projects/:projectId    -> log-explorer -> ProjectPage/LogExplorer -> useLogExplorer -> GET /api/projects/:projectId/logs + WS log.created
 /orgs/:slug/projects/:projectId/settings -> project+api-key -> ProjectSettingsView -> useProjectSettings, useProjectApiKeys -> PATCH/DELETE project, GET/POST/PATCH api-keys
 /sign-in,/sign-up                  -> auth         -> SignInForm/SignUpForm -> useSignIn/useSignUp -> better-auth + /api/auth/*
```

## Limitations

- Authentication redirects are client-side (`AuthRoutingProvider`, `HomeGate`). No `middleware.ts` exists.
- WebSocket reconnection restores subscriptions (`resubscribeAll` on open) but does not restore transient UI state.
- Log filters are not synced to the URL; direct linking to a filtered view is not supported.
