# Delok Frontend

Next.js frontend for Delok — organization and project management, API key issuance, and realtime log exploration.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.9 (App Router) + React 19.2.4 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4, design tokens in `app/globals.css` |
| Server state | TanStack React Query 5 |
| Auth | better-auth 1.6.23 |
| Forms | react-hook-form + zod + @hookform/resolvers |
| Theming | next-themes |
| Realtime | Native WebSocket singleton (`src/lib/websocket/websocket.ts`) |

## Repository Structure

```
app/                  # Routes (App Router): (auth), (root)/orgs, docs, globals.css, layout.tsx
src/
  components/         # ui, landing, docs, layout (Sidebar/Topbar)
  domains/            # auth, organization, project, log, log-explorer, api-key
  lib/                # auth-client, websocket
  providers/          # AppProvider -> Theme/Query/Socket/AuthRouting
  constants/          # routes, assets, storage, external-links
  hooks/              # useCooldown
  utils/              # api-error, format-date
  views/              # Page compositions consumed by app/
public/               # Static assets
```

Path alias: `@/* -> ./*`.

## Setup

```bash
npm install
# create .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_WS_URL=ws://localhost:8000
# NEXT_PUBLIC_APP_URL=http://localhost:3000
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start prod |
| `npm run lint` | ESLint |

See `docs/guides/getting-started.md` for environment details.

## Architecture

- **Routing:** File-based App Router with groups `(auth)` and `(root)`. Paths in `src/constants/routes.ts`. See `docs/architecture/routing.md`.
- **Providers:** `AppProvider` wraps `Theme > Query > Socket > AuthRouting`. See `docs/architecture/providers.md`.
- **State:** React Query for server state, local `useState` for explorer, `localStorage` for last org/project, WebSocket for realtime. See `docs/architecture/state-management.md`.
- **API:** Native `fetch` with cookie auth to `NEXT_PUBLIC_API_URL`; WebSocket to `NEXT_PUBLIC_WS_URL`. See `docs/architecture/api-integration.md`.
- **Design:** Tokens in `app/globals.css` (dark default, `.light` override). See `docs/design/README.md`.

## Documentation

Full index: `docs/README.md`

- Architecture: `docs/architecture/`
- Design: `docs/design/`
- Application: `docs/application/`
- Domains: `docs/domains/`
- Guides: `docs/guides/`
- Decisions: `docs/decisions/`

## Contributing

Follow conventions in `docs/guides/conventions.md`.
