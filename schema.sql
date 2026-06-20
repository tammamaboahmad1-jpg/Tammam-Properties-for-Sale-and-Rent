-- Tables for Real Estate MVP (Supabase/Postgres)
-- users (admin or future auth)
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  role text default 'visitor',
  created_at timestamptz default now()
);

-- agents (مالكين/وسطاء) — مخفي في الواجهة العامة
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  name text,
  phone text,
  whatsapp text,
  is_owner boolean default false,
  notes_internal text,
  created_at timestamptz default now()
);

-- properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  price numeric,
  currency text default 'EGP',
  property_type text,
  listing_type text, -- sale | rent | offplan
  region text,
  city text,
  address text,
  features jsonb default '[]'::jsonb,
  owner_id uuid references agents(id),
  created_by uuid references users(id),
  status text default 'pending', -- pending | published | rejected | paused | draft
  ai_generated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- property_images
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  url text,
  caption text,
  sort_index int default 0,
  is_main boolean default false,
  ai_score numeric,
  uploaded_at timestamptz default now()
);

-- submissions queue (optional explicit queue)
create table if not exists submissions_queue (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id),
  submitted_by uuid references users(id),
  submitted_at timestamptz default now(),
  review_status text default 'new', -- new | flagged | reviewed
  reviewer_id uuid references users(id),
  review_notes text
);

-- contact messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  property_id uuid,
  name text,
  contact_method text,
  message text,
  sent_to_admin boolean default false,
  created_at timestamptz default now()
);

-- moderation logs
create table if not exists moderation_logs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid,
  issue_type text,
  details text,
  automated_flag boolean default true,
  reviewed boolean default false,
  reviewer_id uuid,
  created_at timestamptz default now()
);
