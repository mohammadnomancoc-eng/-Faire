-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USER PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- DAILY TASKS
create table public.daily_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  is_done boolean default false,
  due_date date not null,
  reminder_time time,
  created_at timestamptz default now()
);

-- LONG-TERM GOALS
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- GOAL DAILY TASKS
create table public.goal_tasks (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid references public.goals(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  due_date date not null,
  is_done boolean default false,
  created_at timestamptz default now()
);

-- GOAL LANDMARKS
create table public.goal_landmarks (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid references public.goals(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_date date not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.goals enable row level security;
alter table public.goal_tasks enable row level security;
alter table public.goal_landmarks enable row level security;

-- POLICIES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users manage own daily tasks" on public.daily_tasks for all using (auth.uid() = user_id);
create policy "Users manage own goals" on public.goals for all using (auth.uid() = user_id);
create policy "Users manage own goal tasks" on public.goal_tasks for all using (auth.uid() = user_id);
create policy "Users manage own landmarks" on public.goal_landmarks for all using (
  exists (
    select 1 from public.goals
    where goals.id = goal_landmarks.goal_id and goals.user_id = auth.uid()
  )
);

-- TRIGGER: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
