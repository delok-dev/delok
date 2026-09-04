# Delok Frontend — Internal Documentation

Internal technical documentation for developers maintaining and extending the Delok frontend.

## Structure

| Area | Path | Covers |
|------|------|--------|
| Architecture | `docs/architecture/` | Routing, providers, state, API, shared components, infrastructure, folder structure |
| Design | `docs/design/` | Design tokens, typography, spacing, theming, Tailwind config |
| Application | `docs/application/` | Capabilities, user flows, navigation, realtime behavior |
| Domains | `docs/domains/` | Per-domain components, hooks, schemas, types, API, consumers |
| Decisions | `docs/decisions/` | Technical decisions and rationale |
| Guides | `docs/guides/` | Setup, conventions, adding domains and routes |

## Index

### Architecture
- [Overview](architecture/README.md)
- [Routing](architecture/routing.md)
- [Providers](architecture/providers.md)
- [State Management](architecture/state-management.md)
- [API Integration](architecture/api-integration.md)
- [Shared Components](architecture/components.md)
- [Infrastructure](architecture/infrastructure.md)

### Design
- [Design System](design/README.md)

### Application
- [Application](application/README.md)

### Domains
- [Domains Overview](domains/README.md)
- [auth](domains/auth.md)
- [organization](domains/organization.md)
- [project](domains/project.md)
- [log](domains/log.md)
- [log-explorer](domains/log-explorer.md)
- [api-key](domains/api-key.md)

### Guides
- [Getting Started](guides/getting-started.md)
- [Conventions](guides/conventions.md)
- [Adding a Domain](guides/adding-a-domain.md)
- [Adding a Route](guides/adding-a-route.md)

### Decisions
- [Decisions](decisions/README.md)

## Maintenance

Documentation follows the codebase.

| Change | Review |
|--------|--------|
| Adding a domain (`src/domains/<name>`) | `docs/domains/README.md` + new `docs/domains/<name>.md` |
| Adding a route (`app/...`) | `docs/architecture/routing.md` and `docs/application/README.md` |
| Changing providers (`src/providers/`) | `docs/architecture/providers.md` |
| Changing design tokens (`app/globals.css`, Tailwind) | `docs/design/README.md` |
| Changing auth (`src/lib/auth/*`, `src/domains/auth/*`) | `docs/domains/auth.md` + `docs/architecture/api-integration.md` |
| Changing API client / base URL | `docs/architecture/api-integration.md` |
| Changing realtime (`src/lib/websocket/*`) | `docs/architecture/api-integration.md` + `docs/domains/log-explorer.md` |
