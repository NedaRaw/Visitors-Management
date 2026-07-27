/*
# Create app_users table for admin-managed user accounts

1. Purpose
   Allows the primary admin to create and manage user accounts (usernames + passwords)
   and assign each user a role of either "admin" or "user". Replaces the hardcoded
   ADMIN_CREDENTIALS array with a database-backed user store.

2. New Tables
   - `app_users`
     - `id` (uuid, primary key)
     - `username` (text, unique, not null) — login name
     - `password_hash` (text, not null) — SHA-256 hash of salt+password
     - `password_salt` (text, not null) — per-user random salt
     - `role` (text, not null, default 'user') — 'admin' or 'user'
     - `is_primary` (boolean, default false) — true for the main admin who cannot be deleted
     - `active` (boolean, default true) — can be deactivated without deleting
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())

3. Security
   - RLS enabled on app_users.
   - No policies are added — the table is accessed exclusively through an edge
     function that uses the service role key (which bypasses RLS). The anon-key
     frontend client can NOT read or write this table directly, which is the
     intended security boundary. All authentication and user management goes
     through the edge function.

4. Notes
   - The primary admin (username: "admin", password: "najran2026") is auto-seeded
     by the edge function on first login if the table is empty.
   - Passwords are never stored in plain text — only the salted SHA-256 hash.
*/

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_primary boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
