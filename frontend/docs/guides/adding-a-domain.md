# Adding a Domain

Based on existing domains (`src/domains/organization`, `project`, `api-key`).

## Steps

1. Create `src/domains/<name>/` with structure as needed (not every domain uses all folders):

```
src/domains/<name>/
  api/<name>.service.ts      # fetch wrappers, getApiBaseUrl(), normalize helper if needed
  components/                # presentational + modals
    index.ts                 # barrel
  hooks/                     # React Query hooks or local logic
  schemas/<name>.schema.ts   # zod schema (if forms)
  types/<name>.type.ts       # domain types
  index.ts                   # public barrel re-exporting api/components/hooks/schemas/types
```

2. Follow existing patterns:
   - Service: static class, `GET/POST/PATCH/DELETE` with `credentials:"include"`, error via `getApiErrorMessage`.
   - Hooks: `useQuery` with key `["<name>", ...]` and `useMutation` with `invalidateQueries` on success.
   - Validation: `zod` schema with `react-hook-form` in components.

3. Add routes/views if needed:
   - New view in `src/views/<area>/` and new route in `app/(root)/...` or `app/...`.
   - Add route constants to `src/constants/routes.ts`.

4. Add docs: create `docs/domains/<name>.md` following `docs/domains/organization.md` template and link from `docs/domains/README.md`.

## Checklist

- [ ] Service uses `NEXT_PUBLIC_API_URL` fallback correctly
- [ ] Query keys are stable and invalidated on mutations
- [ ] Schema validates input (trim, min/max)
- [ ] Barrel `index.ts` exports only public API
- [ ] Docs updated
