# Routing

## Routes

| Route | File | Type |
|-------|------|------|
| `/` | `app/page.tsx` | Page — marketing home wrapped in `HomeGate` |
| `/docs` | `app/docs/page.tsx` | Page — docs index using `DocsLayout` |
| `/docs/introduction` | `app/docs/introduction/page.tsx` | Page |
| `/docs/quickstart` | `app/docs/quickstart/page.tsx` | Page |
| `/docs/installation` | `app/docs/installation/page.tsx` | Page |
| `/docs/logging` | `app/docs/logging/page.tsx` | Page |
| `/docs/reference/log-event` | `app/docs/reference/log-event/page.tsx` | Page |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | Page — route group `(auth)` |
| `/sign-in/forgot-password` | `app/(auth)/sign-in/forgot-password/page.tsx` | Page |
| `/sign-in/reset-password` | `app/(auth)/sign-in/reset-password/page.tsx` | Page — expects `?token=` |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | Page |
| `/sign-up/verify-email` | `app/(auth)/sign-up/verify-email/page.tsx` | Page |
| `/sign-up/verified` | `app/(auth)/sign-up/verified/page.tsx` | Page |
| `/auth/error` | `app/(auth)/auth/error/page.tsx` | Page |
| `/orgs` | `app/(root)/orgs/page.tsx` | Page — org list, layout `app/(root)/orgs/layout.tsx` |
| `/orgs/:organizationSlug` | `app/(root)/orgs/[organizationSlug]/page.tsx` | Dynamic |
| `/orgs/:organizationSlug/settings` | `app/(root)/orgs/[organizationSlug]/settings/page.tsx` | Dynamic |
| `/orgs/:organizationSlug/projects` | `app/(root)/orgs/[organizationSlug]/projects/page.tsx` | Dynamic |
| `/orgs/:organizationSlug/projects/:projectId` | `app/(root)/orgs/[organizationSlug]/projects/[projectId]/page.tsx` | Dynamic nested — log explorer |
| `/orgs/:organizationSlug/projects/:projectId/settings` | `app/(root)/orgs/[organizationSlug]/projects/[projectId]/settings/page.tsx` | Dynamic nested — project settings |

Special files:
- `app/layout.tsx` — root layout (fonts `Space_Grotesk`, `JetBrains_Mono`, `AppProvider`, `Toaster`)
- `app/not-found.tsx` — global 404
- `app/docs/layout.tsx` — docs segment layout wrapping `DocsLayout`

## Layout Hierarchy

```
app/layout.tsx (RootLayout)
 ├─ app/page.tsx (Home - no org layout)
 ├─ app/docs/layout.tsx (DocsLayout -> DocsNavbar + DocsSidebar)
 ├─ app/(auth)/* (AuthLayout via views/auth)
 └─ app/(root)/orgs/layout.tsx (OrganizationsLayout)
     └─ app/(root)/orgs/[organizationSlug]/layout.tsx (OrganizationLayout -> Sidebar + Topbar)
```

`src/views/orgs/OrganizationsLayout.tsx` and `src/views/orgs/organization/OrganizationLayout.tsx` provide the authenticated shell. `Sidebar` (`src/components/layout/sidebar/Sidebar.tsx`) and `Topbar` (`src/components/layout/topbar/Topbar.tsx`) mount only inside the org layout.

## Navigation

- Route strings are centralized in `src/constants/routes.ts` (`ROUTES`).
- Sidebar items derive from `src/components/layout/sidebar/sidebar.config.ts`.
- `HomeGate` (`src/components/landing/HomeGate.tsx`) gates `/` for authenticated users.
- `AuthRoutingProvider` (`src/providers/AuthRoutingProvider.tsx`) redirects authenticated users outside `/orgs` and `/docs` to `ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)` or `/orgs`.
- Docs navigation is defined in `src/components/docs/navigation.ts`.

## Protected Routes

No `middleware.ts` exists. Authentication checks are client-side via `authClient.useSession()` in `AuthRoutingProvider` and individual views (e.g., `ProjectPage` handles `isError`).

## Loading and Error States

No `loading.tsx` / `error.tsx` files in `app/`. Loading is handled per-view with `Loader` (`src/components/ui/Loader.tsx`) and skeletons (`ProjectListSkeleton`, `OrganizationListSkeleton`, `OrganizationsLoading`). Error handling is per-page (`ProjectPage`, `not-found.tsx`).

## Route Groups

`(auth)` and `(root)` are Next.js route groups — they organize files without affecting the URL.
