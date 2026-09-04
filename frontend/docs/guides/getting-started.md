# Getting Started

## Prerequisites

- Node.js (version implied by `next 16.2.9` — use Node 18+)
- Backend running at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000` in dev)

## Setup

```bash
npm install
cp .env.example .env.local  # if exists; otherwise create .env.local
# .env.local must contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_WS_URL=ws://localhost:8000
# NEXT_PUBLIC_APP_URL=http://localhost:3000
npm run dev
```

Open `http://localhost:3000`.

## Environment

| Var | Required | Default (dev) | Where used |
|-----|----------|---------------|------------|
| `NEXT_PUBLIC_API_URL` | Yes in prod | `http://localhost:8000` | `src/lib/auth/auth-client.ts:8`, all `*.service.ts` |
| `NEXT_PUBLIC_WS_URL` | Yes in prod | `ws://localhost:8000` | `src/lib/websocket/websocket.ts:8` |
| `NEXT_PUBLIC_APP_URL` | No (but needed for password reset/OAuth) | — | `src/domains/auth/api/auth.service.ts:33,58` |

Production requires `NEXT_PUBLIC_WS_URL` to be `wss://` when served over `https` (`src/lib/websocket/websocket.ts:17-25`).

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint with `next/core-web-vitals` |

## Where to look

- Routes: `app/` + `src/constants/routes.ts`
- Providers: `src/providers/AppProvider.tsx`
- Domains: `src/domains/<name>/`
- Views: `src/views/` (page compositions)
