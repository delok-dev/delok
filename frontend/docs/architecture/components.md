# Shared Components

## UI Primitives (`src/components/ui/`)

Reusable and domain-agnostic. All use `clsx` + Tailwind tokens (`bg-surface`, `border-border`, `text-foreground`), no CSS modules.

| Component | File | Props | Consumers |
|-----------|------|-------|-----------|
| `Button` | `ui/Button.tsx` | variant `primary\|secondary\|danger\|success\|ghost`, size `sm\|md\|lg`, `loading`, `href` (renders as Next `Link`) | Domain modals, `not-found.tsx`, `LogExplorer`, auth forms |
| `Input` | `ui/Input.tsx` | `label`, `error`, `helperText`, password toggle with `showPassword` state | `SignInForm`, `SignUpForm`, `CreateOrganizationModal`, `CreateProjectModal`, `GenerateApiKeyModal` |
| `Modal` | `ui/Modal.tsx` | `open`, `onClose`, `title`, `description`, portal to `document.body`, Escape close | `CreateOrganizationModal`, `CreateProjectModal`, `GenerateApiKeyModal` |
| `ConfirmModal` | `ui/ConfirmModal.tsx` | Wraps `Modal` + `Button` danger variant | `OrganizationDangerZone`, `ProjectDangerZone`, `ApiKeyList` revoke |
| `Card` | `ui/Card.tsx` | — | `OrganizationCard`, `ProjectCard` |
| `Badge` | `ui/Badge.tsx` | — | `LogEventRow` level badges |
| `Alert` | `ui/Alert.tsx` | variant `info\|warning\|danger\|success` | Auth error, form errors |
| `EmptyState` | `ui/EmptyState.tsx` | `title`, `description`, `action` | `OrganizationEmptyState`, `ProjectEmptyState`, `LogsPanel` empty |
| `Skeleton` | `ui/Skeleton.tsx` | — | `OrganizationListSkeleton`, `ProjectListSkeleton` |
| `Loader` | `ui/Loader.tsx` | `label` — 3-bar `animate-delok-loader-bar` | `ProjectPage`, `OrganizationsLoading` |
| `toast` | `ui/toast.tsx` | Wrapper over `sonner` `Toaster` at `app/layout.tsx` | `useSignUp`, `useOrganizations`, etc. |

Exported via `src/components/ui/index.ts`.

## Layout Components (`src/components/layout/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Sidebar` + `SidebarHeader`/`Footer`/`Navigation`/`NavigationItem` | `layout/sidebar/*` | Left nav for org area. Config in `sidebar.config.ts` (Overview disabled, Projects, Members disabled, Settings) |
| `Topbar` + `OrganizationSwitcher` + `UserMenu`/`UserAvatar` | `layout/topbar/*` | Top bar inside `OrganizationLayout`. `OrganizationSwitcher` lists orgs via `useOrganizations` |
| `OrganizationsTopbar` | `layout/topbar/OrganizationsTopbar.tsx` | Top bar for `/orgs` list page |

Mounted only inside `src/views/orgs/organization/OrganizationLayout.tsx` (org shell) and `src/views/orgs/OrganizationsLayout.tsx`.

## Landing (`src/components/landing/`)

`Navbar`, `Hero`, `DelokLogPreview`, `LogInvestigationSection`, `ProjectsAwarenessSection`, `FindSignalSection`, `GetStartedSection`, `Footer`, `HomeGate` (`HomeGate.tsx` gates `/` for authenticated users). Data in `delok-*.data.ts`, `find-signal.data.ts`.

## Docs (`src/components/docs/`)

Docs-only: `DocsLayout`, `DocsNavbar`, `DocsSidebar`, `DocsSearch`, `DocsHomeSearch`, `Callout`, `CodeBlock`, `navigation.ts`. Used only under `app/docs/`.

## Styling Conventions

- Tokens from `app/globals.css` via `bg-*`, `text-*`, `border-*`.
- `clsx` for conditional classes, `rounded-md/lg` mapped to `--radius`.
- No `cva` — inline `clsx` objects (see `Button.tsx`).
- Dark default, light via `.light` class (next-themes).

Design tokens are defined in `app/globals.css`. Other documents reference that file rather than duplicating token tables.
