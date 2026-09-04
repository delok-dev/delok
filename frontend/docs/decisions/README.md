# Decisions

| Decision | Implementation | Notes |
|----------|---------------|-------|
| Next.js App Router | `app/layout.tsx`, `next.config.ts` | File-based routing, Server Components for layout. |
| Tailwind CSS 4 with CSS tokens | `app/globals.css`, `postcss.config.mjs` | Dark default via `:root`, `.light` override, `@theme inline` bridge. |
| `better-auth` | `src/lib/auth/auth-client.ts` | Wrapped by `AuthService` to isolate UI from auth client. |
| TanStack Query | `src/providers/QueryProvider.tsx`, domain hooks | Server state caching with `staleTime 30s`, `retry 1`, `refetchOnWindowFocus: false`. |
| Native `fetch` | `src/domains/*/api/*.service.ts` | Each service uses `fetch` + `credentials: include` + `getApiBaseUrl()`. No shared wrapper. |
| Singleton `WebSocketManager` | `src/lib/websocket/websocket.ts` | Single connection, exponential backoff reconnect, `resubscribeAll` on open. Domain hooks only subscribe. |
| Domain layer `src/domains/<name>/` | `src/domains/*` | Feature isolation; each domain owns components, hooks, schemas, types, API. |
| Separate `src/views/` | `src/views/orgs/*` vs `app/(root)/orgs/*` | Thin `app` routes delegate to `views` for composition. |
| Cookie auth (`credentials:"include"`) | All services | Session via cookie. |
| `localStorage` for last org/project | `src/constants/storage.ts`, `AuthRoutingProvider` | Persists return-to-last behavior. |
| `next-themes` with `attribute="class"` | `src/providers/ThemeProvider.tsx` | System theme support. |

Place new ADRs as `docs/decisions/<number>-<title>.md` and link here.
