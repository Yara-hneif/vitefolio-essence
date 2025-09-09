-- ==============================================
-- Initial Schema Migration
-- ==============================================

-- ENUM for user roles
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM (
  'super_admin',
  'site_owner',
  'site_admin',
  'editor',
  'viewer'
);

-- user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  site_id uuid REFERENCES sites(id) NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, site_id)
);

-- site_messages table
CREATE TABLE IF NOT EXISTS public.site_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) NOT NULL,
  user_id uuid,
  name varchar(100),
  email varchar(100),
  subject varchar(200),
  message text,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Ensure contact table exists
CREATE TABLE IF NOT EXISTS public.contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name varchar(100),
  email varchar(100),
  subject varchar(200),
  message text,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  replied_at timestamptz,
  updated_at timestamptz DEFAULT now()
);
