-- Auth migration for recipe-app
-- Paste in Supabase SQL Editor and Run.
--
-- WARNING: This DELETES ALL existing rows in the `recipes` table.
-- You chose to start fresh. No backups made here.
--
-- Prerequisite: Email provider enabled under Authentication → Sign In / Providers.

-- ── 1. Wipe existing recipes ────────────────────────────────────────────────
delete from recipes;

-- ── 2. Add user_id column, NOT NULL, FK to auth.users ───────────────────────
alter table recipes add column if not exists user_id uuid;
alter table recipes
  add constraint recipes_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade
  not valid;
alter table recipes validate constraint recipes_user_id_fkey;
alter table recipes alter column user_id set not null;

-- ── 3. Enable RLS (in case it isn't already) ────────────────────────────────
alter table recipes enable row level security;

-- ── 4. Drop any existing recipes policies (old names we might have used) ───
drop policy if exists "Enable read access for all users" on recipes;
drop policy if exists "Enable insert for all users" on recipes;
drop policy if exists "Enable update for all users" on recipes;
drop policy if exists "Enable delete for all users" on recipes;
drop policy if exists "recipes select" on recipes;
drop policy if exists "recipes insert" on recipes;
drop policy if exists "recipes update" on recipes;
drop policy if exists "recipes delete" on recipes;
drop policy if exists "recipes owner select" on recipes;
drop policy if exists "recipes owner insert" on recipes;
drop policy if exists "recipes owner update" on recipes;
drop policy if exists "recipes owner delete" on recipes;
drop policy if exists "Allow all" on recipes;
drop policy if exists "Public recipes" on recipes;

-- ── 5. New owner-scoped policies ────────────────────────────────────────────
create policy "recipes owner select" on recipes
  for select to authenticated
  using (auth.uid() = user_id);

create policy "recipes owner insert" on recipes
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "recipes owner update" on recipes
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "recipes owner delete" on recipes
  for delete to authenticated
  using (auth.uid() = user_id);

-- ── 6. Tighten storage policies for recipe-photos bucket ────────────────────
-- Drop the anon write policies from storage_setup.sql
drop policy if exists "recipe-photos anon insert" on storage.objects;
drop policy if exists "recipe-photos anon update" on storage.objects;
drop policy if exists "recipe-photos anon delete" on storage.objects;

-- Recreate as authenticated-only
drop policy if exists "recipe-photos auth insert" on storage.objects;
create policy "recipe-photos auth insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'recipe-photos');

drop policy if exists "recipe-photos auth update" on storage.objects;
create policy "recipe-photos auth update" on storage.objects
  for update to authenticated
  using (bucket_id = 'recipe-photos')
  with check (bucket_id = 'recipe-photos');

drop policy if exists "recipe-photos auth delete" on storage.objects;
create policy "recipe-photos auth delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'recipe-photos');
