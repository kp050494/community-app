-- Adds the new community fields without dropping anything (safe to re-run).
-- gotra on families; yskId, yuvaSanghFamilyId, maritalStatus on members.
ALTER TABLE "families" ADD COLUMN IF NOT EXISTS "gotra" TEXT;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "yskId" TEXT;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "yuvaSanghFamilyId" TEXT;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "maritalStatus" TEXT;
