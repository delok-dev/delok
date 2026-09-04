# Conventions

## File Organization

- `src/domains/<domain>/` owns its `api/`, `components/`, `hooks/`, `schemas/`, `types/`, `index.ts` barrel.
- `src/views/` holds page-level compositions consumed by `app/` routes. `app/` pages are thin wrappers.
- `src/components/ui/` holds reusable primitives; `src/components/landing/`, `docs/`, `layout/` hold feature layout.
- `src/constants/` holds `routes.ts`, `assets.ts`, `storage.ts`, `external-links.ts`.

## Naming

- Services: `*Service` class with static methods (`OrganizationService`, `ProjectService`, etc.)
- Hooks: `use<Domain><Thing>` (e.g., `useOrganizations`, `useProjectApiKeys`, `useLogExplorer`)
- Schemas: `<domain>Schema` / `<action>Schema` (e.g., `organizationSchema`, `projectSchema`, `signUpSchema`)
- Types: PascalCase (`Organization`, `Project`, `LogEvent`, `ApiKey`)
- Route helpers: `ROUTES.ORGANIZATION.PROJECTS(slug)` — functions for dynamic segments.

## API

- Use native `fetch` with `credentials:"include"`; no axios.
- `getApiBaseUrl()` helper per service file (identical logic).
- Normalize `created_at/updated_at` -> `createdAt/updatedAt` in organization/project services.
- Errors via `getApiErrorMessage` / `getApiErrorCode` (`src/utils/api-error.ts`).

## Validation

- `zod` schemas + `react-hook-form` + `@hookform/resolvers` in forms/modals.
- Schemas live in `src/domains/<domain>/schemas/*.schema.ts`.

## State

- Server state: TanStack Query with keys like `["projects", slug]`.
- Local UI: `useState`/`useRef` in hooks like `useLogExplorer`.
- Realtime: singleton `websocketManager` + per-hook `subscribe`/`on`.

## Styling

- Tailwind v4 with design tokens in `app/globals.css` (`--background`, `--surface`, etc.).
- Use token classes (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`).
- No CSS modules; `clsx` for conditional classes.
