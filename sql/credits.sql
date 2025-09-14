-- Table to hold user credits
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

-- RPC to increment credits atomically
create or replace function public.increment_credits(p_user_id uuid, p_delta integer)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.user_credits (user_id, credits)
  values (p_user_id, p_delta)
  on conflict (user_id)
  do update set credits = public.user_credits.credits + p_delta, updated_at = now();
end;
$$;

-- Policies: authenticated users can read their own credits
alter table public.user_credits enable row level security;

create policy "read own credits" on public.user_credits
for select
to authenticated
using ( auth.uid() = user_id );

-- Only service role (server) can update via RPC; no direct update policy


