# Domains Overview

All domains live under `src/domains/`. Each domain is traced below — no assumption that they share the same structure.

| Domain | Purpose | Structure | Routes using it |
|--------|---------|-----------|-----------------|
| [auth](auth.md) | Email/password + OAuth + email verification + password reset | `components/`, `hooks/`, `schemas/`, `types/`, `api/` | `/sign-in`, `/sign-up`, `/sign-up/verify-email`, `/sign-up/verified`, `/sign-in/forgot-password`, `/sign-in/reset-password`, `/auth/error` |
| [organization](organization.md) | CRUD for organizations (slug-identified) | `components/`, `hooks/`, `schemas/`, `types/`, `api/` | `/orgs`, `/orgs/:slug`, `/orgs/:slug/settings`, `/orgs/:slug/projects` |
| [project](project.md) | CRUD for projects scoped to org | `components/`, `hooks/`, `api/`, `types/`, `schemas/` + realtime | `/orgs/:slug/projects`, `/orgs/:slug/projects/:projectId`, `.../settings` |
| [log](log.md) | Log types, service, formatting, row/detail components | `types/`, `api/`, `utils/`, `components/` | Used via `log-explorer` on `/orgs/:slug/projects/:projectId` |
| [log-explorer](log-explorer.md) | Log listing, filtering, pagination, realtime, detail | `components/`, `hooks/`, `utils/` | `/orgs/:slug/projects/:projectId` |
| [api-key](api-key.md) | API key lifecycle per project | `api/`, `components/`, `hooks/`, `schemas/`, `types/` | `/orgs/:slug/projects/:projectId/settings` |

Cross-domain dependency verified: `log-explorer -> log` (imports `LogService`, `LogEvent` types). No other cross-domain imports found.

External dependencies per domain: see per-domain pages.
