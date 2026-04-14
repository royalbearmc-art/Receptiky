-- Supabase Storage setup for recipe-app
-- Run this in Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: all statements are idempotent.

-- 1. Create the public bucket for recipe photos.
insert into storage.buckets (id, name, public)
values ('recipe-photos', 'recipe-photos', true)
on conflict (id) do nothing;

-- 2. Policies on storage.objects for this bucket.
-- NOTE: these allow anonymous writes because the app has no auth yet.
-- When auth is added, tighten the insert/update/delete policies to
-- `auth.role() = 'authenticated'` or scope by owner.
--
-- We intentionally DO NOT create a SELECT policy: the bucket is public,
-- so files are served via their direct public URL without needing one.
-- Adding a SELECT policy would let anyone list every filename in the bucket.

-- Make sure no stale SELECT policy exists from earlier runs.
drop policy if exists "recipe-photos public read" on storage.objects;

-- Anon insert (temporary, pre-auth)
drop policy if exists "recipe-photos anon insert" on storage.objects;
create policy "recipe-photos anon insert"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'recipe-photos');

-- Anon update (needed if we ever use upsert)
drop policy if exists "recipe-photos anon update" on storage.objects;
create policy "recipe-photos anon update"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'recipe-photos')
with check (bucket_id = 'recipe-photos');

-- Anon delete (so old images can be cleaned up)
drop policy if exists "recipe-photos anon delete" on storage.objects;
create policy "recipe-photos anon delete"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'recipe-photos');
