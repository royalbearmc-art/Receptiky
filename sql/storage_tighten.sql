-- One-off tightening after storage_setup.sql
-- Run this in Supabase SQL editor to drop the SELECT policy.
-- Rationale: the bucket is public, so files are already reachable via their
-- direct public URL. A SELECT policy on storage.objects only enables *listing*
-- the bucket contents, which leaks every filename to anyone. We don't need it.

drop policy if exists "recipe-photos public read" on storage.objects;
