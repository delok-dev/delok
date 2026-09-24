/*
  Add project slug as public human-readable identifier.

  Steps:
  1. Add nullable slug column
  2. Backfill existing projects with generated slugs (normalized name + random suffix)
  3. Verify all projects have valid slugs
  4. Add unique constraint on (organizationId, slug)
  5. Make slug required
*/

-- Step 1: Add nullable slug column
ALTER TABLE "project" ADD COLUMN "slug" TEXT;

-- Step 2: Backfill existing projects with slugs
-- Generate slug as: lower(trim(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'))) with spaces->dashes, collapse dashes + '-' + substr(md5(id || name || random()), 1, 12)
UPDATE "project"
SET "slug" = (
  lower(
    regexp_replace(
      regexp_replace(trim("name"), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  )
  || '-'
  || substr(md5("id" || "name" || random()::text), 1, 12)
);

-- Step 3: Verify all projects have valid slugs (will fail if any NULL)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "project" WHERE "slug" IS NULL) THEN
    RAISE EXCEPTION 'Some projects still have NULL slug after backfill';
  END IF;
END $$;

-- Step 4: Add unique constraint on (organizationId, slug)
CREATE UNIQUE INDEX "project_organizationId_slug_key" ON "project" ("organizationId", "slug");

-- Step 5: Make slug required
ALTER TABLE "project" ALTER COLUMN "slug" SET NOT NULL;