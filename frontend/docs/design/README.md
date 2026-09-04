# Design System

Implementation: `app/globals.css`, Tailwind CSS 4 (`@import "tailwindcss"`, `@theme inline`).

## Tokens — `app/globals.css`

Dark is default (no `.dark` class needed). Light is opted via `.light`.

| Token | Dark (`:root`) | Light (`.light`) | Usage |
|-------|----------------|------------------|-------|
| `--background` | `#09090b` | `#ffffff` | Page background |
| `--surface` | `#121215` | `#f4f4f5` | Cards, panels |
| `--surface-hover` | `#1c1c21` | `#e4e4e7` | Hover for surface |
| `--foreground` | `#fafafa` | `#09090b` | Primary text |
| `--muted-foreground` | `#a1a1aa` | `#71717a` | Secondary text |
| `--border` | `#27272a` | `#e4e4e7` | Borders, scrollbar |
| `--primary` | `#6366f1` (indigo) | same | Brand / CTA |
| `--primary-foreground` | `#ffffff` | same | Text on primary |
| `--success` | `#22c55e` | same | OK / Healthy |
| `--warning` | `#f59e0b` | same | WARN level |
| `--danger` | `#ef4444` | same | ERROR/FATAL level |
| `--info` | `#06b6d4` | same | INFO level |
| `--radius` | `0.5rem` (8px) | same | Base radius |

Tailwind bridge (`@theme inline` `app/globals.css`) maps these to `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-success`, etc., plus `font-sans`, `font-mono`, `radius-sm/md/lg`.

- `radius-sm: calc(var(--radius) - 2px)` = 6px
- `radius-md: var(--radius)` = 8px
- `radius-lg: calc(var(--radius) + 4px)` = 12px

## Typography

- Fonts: `Space_Grotesk` (`--font-space-grotesk`) for sans, `JetBrains_Mono` (`--font-jetbrains-mono`) for mono. Loaded in `app/layout.tsx` via `next/font/google` with `variable` and `subsets: ["latin"]`.
- `app/globals.css`: `--font-sans: var(--font-space-grotesk), Inter, sans-serif`; `--font-mono: var(--font-jetbrains-mono), JetBrains Mono, monospace`.
- Components use Tailwind text utilities (`text-sm`, `text-xs`, etc.). No explicit `font-size` scale in globals.

## Spacing and Radius

- Radius system is 8pt grid based.
- Components use `rounded-md` / `rounded-lg` / `rounded-full` mapped to the tokens above.
- Cards and modals: `border border-border bg-surface rounded-lg`.

## Scrollbar

Thin, rounded, theme-aware (`app/globals.css`): Firefox `scrollbar-width: thin; scrollbar-color: var(--border) transparent`; WebKit `::-webkit-scrollbar` 8px with `border-radius: 9999px`.

## Animations

- Toast progress: `toast-progress` scaleX 1->0.
- Loader: 3-bar `delok-loader-bar` used by `src/components/ui/Loader.tsx`.
- Log stream: `log-enter` translateY -8px + opacity — `animate-log-enter` on new rows.
- Landing: `detail-crossfade`, `cursor-click-pulse`, `hero-reveal` / `section-reveal`.

## Component Styling

- UI primitives in `src/components/ui/*` use `clsx` for conditional classes, Tailwind tokens, and no CSS modules.
- Variants are props-driven (e.g., `Button` variants), not separate files.
- Dark/light behavior uses `next-themes` with `attribute="class"`; dark is default via `:root`, light via `.light`.
