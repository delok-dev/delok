# Adding a Route

Based on `app/(root)/orgs/...` and `src/constants/routes.ts`.

## Steps

1. Add route constant to `src/constants/routes.ts`:

```ts
MY_NEW: (slug: string) => `/orgs/${slug}/my-new`
```

2. Create `app/(root)/orgs/[organizationSlug]/my-new/page.tsx` (or appropriate segment). Keep the file thin — import a view:

```tsx
import MyNewPage from "@/src/views/orgs/organization/my-new/MyNewPage";
export default function Page() { return <MyNewPage />; }
```

3. Create view in `src/views/orgs/organization/my-new/MyNewPage.tsx` (client component if it uses hooks):

```tsx
"use client";
export default function MyNewPage() { /* ... */ }
```

4. If layout is needed, add `layout.tsx` alongside `page.tsx`.

5. Update sidebar if navigable: `src/components/layout/sidebar/sidebar.config.ts`.

6. Update docs: `docs/architecture/routing.md` and `docs/application/README.md`.

## Notes

- Route groups `(auth)` and `(root)` do not affect URL — use them to share layouts.
- Dynamic segments use `[param]` folders; access via `useParams<{param:string}>()`.
- Docs routes live under `app/docs/` with `app/docs/layout.tsx` wrapping `DocsLayout`.
