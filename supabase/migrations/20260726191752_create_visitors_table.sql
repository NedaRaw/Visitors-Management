/*
# Create visitors table (single-tenant, no auth)

1. Purpose
   Stores every visitor registration for the Medical Laboratory
   Visitor Management System. This is the primary database; the app
   also mirrors each insert to Google Sheets via Apps Script when
   GOOGLE_SCRIPT_URL is configured.

2. New Tables
   - `visitors`
     - `id` (uuid, primary key)
     - `visitor_id` (text, unique) — human-readable ID like LAB-2026-000001
     - `first_name` (text, not null)
     - `last_name` (text, not null)
     - `national_id` (text, not null)
     - `phone` (text, not null)
     - `email` (text, not null)
     - `company` (text, nullable — optional field)
     - `department` (text, not null)
     - `employee` (text, not null)
     - `purpose` (text, not null)
     - `visit_date` (date, not null)
     - `arrival_time` (text, not null) — HH:mm
     - `qr_url` (text, not null) — URL encoded in the QR code
     - `status` (text, not null, default 'Pending') — Pending/Checked In/Checked Out/Expired
     - `timestamp` (timestamptz, default now()) — when the registration was submitted

3. Indexes
   - Unique index on `visitor_id` for fast lookups and ID generation.
   - Index on `visit_date` for date filtering in the admin dashboard.
   - Index on `department` for department filtering.

4. Security
   - Enable RLS on `visitors`.
   - Allow anon + authenticated CRUD because this is a public
     registration app (no sign-in screen). The admin dashboard is
     gated client-side; the data itself is intentionally shared.
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  national_id text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  company text,
  department text NOT NULL,
  employee text NOT NULL,
  purpose text NOT NULL,
  visit_date date NOT NULL,
  arrival_time text NOT NULL,
  qr_url text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitors_visit_date ON visitors (visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_department ON visitors (department);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_visitors" ON visitors;
CREATE POLICY "anon_select_visitors" ON visitors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_visitors" ON visitors;
CREATE POLICY "anon_insert_visitors" ON visitors FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_visitors" ON visitors;
CREATE POLICY "anon_update_visitors" ON visitors FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_visitors" ON visitors;
CREATE POLICY "anon_delete_visitors" ON visitors FOR DELETE
  TO anon, authenticated USING (true);
