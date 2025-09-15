-- Table to hold user credits
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now(),
  -- YYYYMM key of the last month top-up was applied (UTC)
  last_month_key integer not null default to_char(date_trunc('month', (now() at time zone 'utc')), 'YYYYMM')::int
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

-- Helper: compute YYYYMM integer for a timestamp in UTC
create or replace function public._month_key_utc(ts timestamptz)
returns integer
language sql
immutable
as $$
  select to_char(date_trunc('month', (ts at time zone 'utc')), 'YYYYMM')::int;
$$;

-- Ensure monthly top-up without cron: lazily grant p_monthly credits for each elapsed month
-- Returns the current credit balance after any top-up.
create or replace function public.ensure_monthly_topup(p_user_id uuid, p_monthly integer default 3)
returns integer
language plpgsql
security definer
as $$
declare
  cur_key integer := public._month_key_utc(now());
  prev_key integer;
  months_diff integer := 0;
  new_credits integer;
begin
  -- Enforce caller is the same user when invoked with anon key
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'not allowed';
  end if;

  -- Lock row for update to avoid races
  insert into public.user_credits(user_id, credits, last_month_key)
  values (p_user_id, 0, cur_key)
  on conflict (user_id) do nothing;

  select last_month_key into prev_key from public.user_credits where user_id = p_user_id for update;
  if prev_key is null then prev_key := cur_key; end if;

  months_diff := ((cur_key / 100) * 12 + (cur_key % 100)) - ((prev_key / 100) * 12 + (prev_key % 100));
  if months_diff > 0 then
    update public.user_credits
    set credits = credits + (p_monthly * months_diff),
        last_month_key = cur_key,
        updated_at = now()
    where user_id = p_user_id;
  end if;

  select credits into new_credits from public.user_credits where user_id = p_user_id;
  return new_credits;
end;
$$;

-- Policies: authenticated users can read their own credits
alter table public.user_credits enable row level security;

create policy "read own credits" on public.user_credits
for select
to authenticated
using ( auth.uid() = user_id );

-- Only service role (server) can update via RPC; no direct update policy


