-- Guest reviews for each space. Anyone can submit one; it stays hidden until an admin approves it.
-- Admins are users whose app_metadata.role is "admin" (see README).
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  apartment_id text not null,
  name text not null check (char_length(trim(name)) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(trim(body)) between 10 and 1200),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_apartment_idx on public.reviews (apartment_id, created_at desc);

alter table public.reviews enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- Visitors see approved reviews; admins see everything.
drop policy if exists "read approved reviews" on public.reviews;
create policy "read approved reviews" on public.reviews
  for select using (approved or public.is_admin());

-- Anyone can submit, but never as already approved.
drop policy if exists "submit reviews" on public.reviews;
create policy "submit reviews" on public.reviews
  for insert to anon, authenticated with check (approved = false);

drop policy if exists "admins approve reviews" on public.reviews;
create policy "admins approve reviews" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete reviews" on public.reviews;
create policy "admins delete reviews" on public.reviews
  for delete using (public.is_admin());
