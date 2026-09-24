/*
  Fix project slug backfill - the original migration had a bug in the regex
  that removed uppercase letters from project names.
*/

-- Step 1: Update slugs with correct regex (matching a-zA-Z0-9 instead of just a-z0-9)
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

-- Step 2: Verify all projects have valid slugs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "project" WHERE "slug" IS NULL OR "slug" = '') THEN
    RAISE EXCEPTION 'Some projects still have NULL or empty slug after fix';
  END IF;
END $$;