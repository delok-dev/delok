# Architecture

## Stack

- **Framework:** Next.js 16.2.9 (App Router), React 19.2.4
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 (`postcss.config.mjs`, `app/globals.css`)
- **State/Server:** `@tanstack/react-query` 5.101.4
- **Auth:** `better-auth` 1.6.23 via `src/lib/auth/auth-client.ts`
- **Forms/Validation:** `react-hook-form`, `zod`, `@hookform/resolvers`
- **Theming:** `next-themes` (`src/providers/ThemeProvider.tsx`)
- **UI:** `clsx`, `lucide-react`, `sonner` (toasts in `app/layout.tsx`)

## Folder Structure

```
app/                      # Next.js App Router — routes, layouts
  (auth)/                 # route group (no URL segment)
  (root)/orgs/            # authenticated organization area
  docs/                   # documentation pages
  globals.css             # design tokens + Tailwind bridge
  layout.tsx              # root layout, fonts, providers
  not-found.tsx           # global 404
src/
  components/             # shared UI and layout
    ui/                   # primitives: Button, Input, Modal, etc.
    landing/              # home page sections
    docs/                 # DocsLayout, DocsNavbar, DocsSidebar, ...
    layout/               # Sidebar, Topbar
  domains/                # feature domains (see docs/domains/)
    auth/ organization/ project/ log/ log-explorer/ api-key/
  lib/
    auth/auth-client.ts   # better-auth client
    websocket/            # WebSocketManager + realtime types
  providers/              # AppProvider hierarchy
  constants/              # routes, assets, storage, external-links
  hooks/                  # useCooldown
  utils/                  # api-error, format-date
  views/                  # page-level view components (consumed by app/)
public/                   # static assets
next.config.ts            # NextConfig
eslint.config.mjs         # next/core-web-vitals + next/typescript
```

Path alias: `@/* -> ./*` (`tsconfig.json`), so `@/src/...` and `@/app/...` are valid.

## Rendering

- Root layout `app/layout.tsx` is a Server Component that mounts `AppProvider` (client) and `Toaster`.
- Views under `src/views/` are `"use client"` components.
- No `loading.tsx` / `error.tsx` files in `app/`. Loading states are per-view with `Loader` and skeletons.
- Route groups `(auth)` and `(root)` are organizational only, not in URL.

## Dependency Direction

```
app/page or app/(root)/.../page.tsx
  -> src/views/...              (page composition)
    -> src/domains/...          (hooks, components, services)
      -> src/lib/*              (auth-client, websocket)
      -> src/constants/*        (ROUTES, STORAGE_KEYS)
      -> src/utils/*            (api-error, format-date)
      -> src/components/ui/*    (presentational)
providers/ wraps everything via AppProvider
```

`log-explorer` imports from `log`; no other cross-domain imports.

## Build and Lint

- `npm run dev` -> `next dev`
- `npm run build` -> `next build`
- `npm run lint` -> `eslint` with `eslint-config-next`
