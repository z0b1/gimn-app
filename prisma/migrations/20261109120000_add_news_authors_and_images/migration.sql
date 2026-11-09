-- AlterTable (additive only, safe to run more than once)
ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "authors" TEXT;
ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
