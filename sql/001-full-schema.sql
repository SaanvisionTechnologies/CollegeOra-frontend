-- ============================================================
-- CollegeOra Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ============================================================
-- 1. EXTEND USERS TABLE (already exists via handle_new_user trigger)
-- ============================================================

alter table public.users add column if not exists first_name text;
alter table public.users add column if not exists last_name text;
alter table public.users add column if not exists date_of_birth date;
alter table public.users add column if not exists phone_country_code text;
alter table public.users add column if not exists phone_number text;
alter table public.users add column if not exists city text;
alter table public.users add column if not exists bio text;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists onboarding_step int default 1;
alter table public.users add column if not exists updated_at timestamptz default now();

-- ============================================================
-- 2. ACADEMIC PROFILES (1:1 with users)
-- ============================================================

create table if not exists public.academic_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null unique,

  -- School
  school_name text,
  graduation_year int,

  -- GPA
  gpa_value decimal,
  gpa_type text check (gpa_type in ('weighted', 'unweighted')),

  -- SAT
  sat_ebrw int,
  sat_math int,

  -- ACT
  act_english int,
  act_math int,
  act_reading int,
  act_science int,

  -- AP/IB Courses (array of course keys)
  courses text[],

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.academic_profiles enable row level security;

create policy "Users can read own academic profile"
  on public.academic_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own academic profile"
  on public.academic_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own academic profile"
  on public.academic_profiles for update
  using (auth.uid() = user_id);

-- ============================================================
-- 3. USER ACTIVITIES — extracurriculars & awards (1:N with users)
-- ============================================================

create table if not exists public.user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  activity_type text not null default 'extracurricular',  -- 'extracurricular' or 'award'
  title text not null,
  subtitle text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.user_activities enable row level security;

create policy "Users can read own activities"
  on public.user_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.user_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on public.user_activities for update
  using (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.user_activities for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 4. USER PREFERENCES — interests, ambitions, help areas (1:1 with users)
-- ============================================================

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null unique,

  academic_interests text[],
  career_ambitions text[],
  help_areas text[],

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can read own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- ============================================================
-- 5. REFERENCE DATA — AP courses, activity types, etc.
-- ============================================================

create table if not exists public.reference_data (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  key text not null,
  label text not null,
  metadata jsonb default '{}',
  sort_order int default 0,
  is_active boolean default true,
  updated_at timestamptz default now(),
  unique(category, key)
);

alter table public.reference_data enable row level security;

create policy "Public read reference data"
  on public.reference_data for select
  using (true);

-- ============================================================
-- 6. UNIVERSITIES — college data for matching engine
-- ============================================================

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  location_city text,
  location_state text,
  location_country text default 'US',

  -- Admissions
  acceptance_rate decimal,
  avg_gpa decimal,
  sat_range_low int,
  sat_range_high int,
  act_range_low int,
  act_range_high int,

  -- Institutional
  tuition_in_state int,
  tuition_out_state int,
  enrollment int,
  graduation_rate decimal,
  setting text,
  size_category text,

  -- Content
  logo_url text,
  description text,
  notable_programs text[],
  tags text[],
  website_url text,

  -- Deadlines
  deadline_early_decision date,
  deadline_early_action date,
  deadline_regular date,

  -- Metadata
  data_source text,
  last_refreshed_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.universities enable row level security;

create policy "Public read universities"
  on public.universities for select
  using (true);

-- ============================================================
-- 7. UNIVERSITY DATA SNAPSHOTS — versioning for audit trail
-- ============================================================

create table if not exists public.university_data_snapshots (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete cascade,
  snapshot_json jsonb not null,
  source text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. INDEXES
-- ============================================================

-- Fast lookup by user
create index if not exists idx_academic_profiles_user on public.academic_profiles(user_id);
create index if not exists idx_user_activities_user on public.user_activities(user_id);
create index if not exists idx_user_preferences_user on public.user_preferences(user_id);

-- Reference data lookups
create index if not exists idx_reference_data_category on public.reference_data(category);

-- University search
create index if not exists idx_universities_slug on public.universities(slug);
create index if not exists idx_universities_name on public.universities using gin(name gin_trgm_ops);

-- GIN indexes for array columns (for future "find users interested in X" queries)
create index if not exists idx_preferences_interests on public.user_preferences using gin(academic_interests);
create index if not exists idx_preferences_ambitions on public.user_preferences using gin(career_ambitions);

-- ============================================================
-- 9. UPDATE HANDLE_NEW_USER TRIGGER (sync first/last name from OAuth)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name, avatar_url, onboarding_completed, onboarding_step)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'last_name', nullif(substring(coalesce(new.raw_user_meta_data->>'full_name', '') from position(' ' in coalesce(new.raw_user_meta_data->>'full_name', '')) + 1), '')),
    new.raw_user_meta_data->>'avatar_url',
    false,
    1
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(users.first_name, excluded.first_name),
    last_name = coalesce(users.last_name, excluded.last_name),
    avatar_url = coalesce(users.avatar_url, excluded.avatar_url);
  return new;
end;
$$ language plpgsql security definer;

-- Ensure trigger exists (safe to re-run)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
