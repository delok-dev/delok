# Providers

## Hierarchy

Mounted once in `app/layout.tsx`:

```
AppProvider (src/providers/AppProvider.tsx)
 └─ ThemeProvider (src/providers/ThemeProvider.tsx)
     └─ QueryProvider (src/providers/QueryProvider.tsx)
         └─ SocketProvider (src/providers/SocketProvider.tsx)
             └─ AuthRoutingProvider (src/providers/AuthRoutingProvider.tsx)
                 └─ {children}
```

## Provider Details

| Provider | File | Provides | Consumers |
|----------|------|----------|-----------|
| `ThemeProvider` | `src/providers/ThemeProvider.tsx` | `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem` | Components using `useTheme()` or `.light` class |
| `QueryProvider` | `src/providers/QueryProvider.tsx` | Single `QueryClient` (`staleTime: 30s`, `retry:1`, `refetchOnWindowFocus:false`) | `useOrganizations`, `useProjects`, `useProject`, `useProjectApiKeys` |
| `SocketProvider` | `src/providers/SocketProvider.tsx` | Calls `websocketManager.connect()` on mount, `disconnect()` on unmount | Realtime hooks (`useLogExplorerRealtime`, `useProjectsRealtime`) |
| `AuthRoutingProvider` | `src/providers/AuthRoutingProvider.tsx` | Redirect for authenticated users outside `/orgs` and `/docs` | Uses `usePathname()`, `useRouter()`, `authClient.useSession()` |

### AuthRoutingProvider Logic

- Reads `authClient.useSession()` (`isPending`, `session.user.id`) and `usePathname()`.
- If pending, unauthenticated, or already on `/orgs/*` or `/docs/*`, no redirect.
- Otherwise redirects to `ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)` if `localStorage["lastOrganizationSlug"]` exists, else `/orgs`.

### Interactions

- `ThemeProvider` is outermost so the theme class is available before queries and sockets.
- `QueryProvider` wraps `SocketProvider` consumers that call `queryClient.setQueryData` (`useProjectsRealtime`).
- `SocketProvider` owns the WebSocket lifecycle via the `websocketManager` singleton.

## Session Access

Session is accessed directly via `authClient.useSession()` wherever needed. No additional `AuthProvider` context exists.
