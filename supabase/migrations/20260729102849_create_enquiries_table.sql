/*
# Create enquiries table

1. New Tables
- `enquiries`
  - `id` (uuid, primary key)
  - `full_name` (text, not null) — customer's full name
  - `company_name` (text, nullable) — company name if applicable
  - `email` (text, not null) — email address
  - `phone` (text, nullable) — phone number
  - `location` (text, nullable) — selected location/market
  - `service_required` (text, nullable) — selected service
  - `message` (text, not null) — enquiry message
  - `status` (text, default 'new') — enquiry status: new, reviewed, responded, closed
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `enquiries`.
- Allow anon + authenticated INSERT (public form submission).
- Allow authenticated SELECT/UPDATE/DELETE (admin management).
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text,
  location text,
  service_required text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries (no sign-in required)
DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Admins (authenticated) can view, update, delete enquiries
DROP POLICY IF EXISTS "auth_select_enquiries" ON enquiries;
CREATE POLICY "auth_select_enquiries" ON enquiries FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries" ON enquiries FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries" ON enquiries FOR DELETE
TO authenticated USING (true);
