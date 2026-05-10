-- ============================================================
-- ShiftLink — Full Migration
-- Paste this in Supabase SQL Editor and click Run
-- ============================================================

-- ENUMS
create type user_type     as enum ('professional', 'facility');
create type shift_role    as enum (
  'Registered Nurse', 'Licensed Vocational Nurse',
  'Certified Nursing Assistant', 'Medical-Surgical Nurse',
  'ICU Nurse', 'Emergency Room Nurse', 'Surgical Tech');
create type urgency_level as enum ('standard', 'urgent');
create type shift_status  as enum ('open', 'claimed', 'completed', 'cancelled');

-- ============================================================
-- PROFILES — mirrors auth.users, created by trigger
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  user_type   user_type not null,
  full_name   text not null default '',
  email       text not null default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- PROFESSIONALS
-- ============================================================
create table professionals (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  role             shift_role not null,
  license_number   text not null,
  years_experience integer default 0,
  is_verified      boolean default false,
  created_at       timestamptz default now()
);
create unique index professionals_profile_idx on professionals(profile_id);

-- ============================================================
-- FACILITIES
-- ============================================================
create table facilities (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references profiles(id) on delete cascade,
  facility_name  text not null,
  facility_type  text not null,
  address        text default '',
  contact_person text not null,
  created_at     timestamptz default now()
);
create unique index facilities_profile_idx on facilities(profile_id);

-- ============================================================
-- SHIFTS
-- ============================================================
create table shifts (
  id             uuid primary key default gen_random_uuid(),
  facility_id    uuid not null references facilities(id) on delete cascade,
  role           shift_role not null,
  shift_date     date not null,
  start_time     time not null,
  end_time       time not null,
  rate_per_hour  numeric(8,2) not null check (rate_per_hour > 0),
  urgency        urgency_level default 'standard' not null,
  status         shift_status  default 'open'     not null,
  claimed_by     uuid references professionals(id) on delete set null,
  claimed_at     timestamptz,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index shifts_status_idx    on shifts(status);
create index shifts_role_idx      on shifts(role);
create index shifts_date_idx      on shifts(shift_date);
create index shifts_facility_idx  on shifts(facility_id);

-- updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger shifts_updated_at   before update on shifts   for each row execute function set_updated_at();
create trigger profiles_updated_at before update on profiles for each row execute function set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, user_type, full_name, email)
  values (
    new.id,
    (new.raw_user_meta_data->>'user_type')::user_type,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles      enable row level security;
alter table professionals enable row level security;
alter table facilities    enable row level security;
alter table shifts        enable row level security;

-- Profiles: own read & update
create policy "profiles: own read"   on profiles for select using (auth.uid() = id);
create policy "profiles: own update" on profiles for update using (auth.uid() = id);

-- Professionals: owner full access
create policy "professionals: own" on professionals for all using (profile_id = auth.uid());

-- Facilities: owner full access
create policy "facilities: own" on facilities for all using (profile_id = auth.uid());

-- Shifts: any authenticated user can read open shifts
create policy "shifts: read open" on shifts for select to authenticated using (true);

-- Shifts: facility inserts their own
create policy "shifts: facility insert" on shifts for insert to authenticated
  with check (facility_id = (select id from facilities where profile_id = auth.uid()));

-- Shifts: facility updates their own
create policy "shifts: facility update" on shifts for update to authenticated
  using (facility_id = (select id from facilities where profile_id = auth.uid()));

-- Shifts: professional can claim (update status/claimed_by on open shifts)
create policy "shifts: professional claim" on shifts for update to authenticated
  using (status = 'open')
  with check (claimed_by = (select id from professionals where profile_id = auth.uid()));

-- ============================================================
-- VIEW — shifts with facility info joined (used by the app)
-- ============================================================
create or replace view shifts_with_facility as
  select
    s.id,
    s.facility_id,
    s.role,
    s.shift_date,
    s.start_time,
    s.end_time,
    s.rate_per_hour,
    s.urgency,
    s.status,
    s.claimed_by,
    s.claimed_at,
    s.notes,
    s.created_at,
    f.facility_name,
    f.facility_type,
    f.address        as facility_location
  from shifts s
  join facilities f on f.id = s.facility_id;

grant select on shifts_with_facility to authenticated;

-- ============================================================
-- SEED DATA — 10 demo shifts (dates relative to today)
-- ============================================================

-- Seed a demo facility (bypasses auth — for demo only)
insert into profiles (id, user_type, full_name, email) values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'facility', 'Demo Facility', 'demo@shiftlink.dev')
on conflict do nothing;

insert into facilities (id, profile_id, facility_name, facility_type, address, contact_person) values
  ('00000000-0000-0000-0000-000000000010'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'St. Luke''s Medical Center',    'Hospital',       'Quezon City, NCR',     'Maria Santos'),
  ('00000000-0000-0000-0000-000000000011'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Makati Medical Center',         'Hospital',       'Makati City, NCR',     'James Reyes'),
  ('00000000-0000-0000-0000-000000000012'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Asian Hospital',                'Hospital',       'Alabang, Muntinlupa',  'Linda Cruz'),
  ('00000000-0000-0000-0000-000000000013'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'The Medical City',              'Hospital',       'Ortigas, Pasig City',  'Robert Kim'),
  ('00000000-0000-0000-0000-000000000014'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Cardinal Santos Medical',       'Hospital',       'San Juan, Metro Manila','Angela Torres')
on conflict do nothing;

insert into shifts (facility_id, role, shift_date, start_time, end_time, rate_per_hour, urgency, status) values
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Registered Nurse',           current_date + 1,  '07:00', '19:00', 650, 'urgent',   'open'),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'ICU Nurse',                  current_date + 2,  '19:00', '07:00', 780, 'urgent',   'open'),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Certified Nursing Assistant', current_date + 2, '08:00', '16:00', 380, 'standard', 'open'),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'Medical-Surgical Nurse',     current_date + 3,  '07:00', '19:00', 700, 'standard', 'open'),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Emergency Room Nurse',       current_date + 3,  '15:00', '23:00', 820, 'urgent',   'open'),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'Surgical Tech',              current_date + 4,  '06:00', '14:00', 540, 'standard', 'open'),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'Licensed Vocational Nurse',  current_date + 4,  '23:00', '07:00', 480, 'standard', 'open'),
  ('00000000-0000-0000-0000-000000000012'::uuid, 'Registered Nurse',           current_date + 5,  '07:00', '19:00', 650, 'standard', 'open'),
  ('00000000-0000-0000-0000-000000000013'::uuid, 'ICU Nurse',                  current_date + 6,  '19:00', '07:00', 800, 'urgent',   'open'),
  ('00000000-0000-0000-0000-000000000014'::uuid, 'Certified Nursing Assistant', current_date + 7, '09:00', '17:00', 360, 'standard', 'open');
