/*
# Create customer satisfaction survey table

1. New Tables
- `survey_responses`
  - `id` (uuid, primary key)
  - `service_used` (text) — which service the customer used
  - `satisfaction` (int 1-5) — overall satisfaction rating
  - `rating_staff_professionalism` (int 1-5)
  - `rating_speed_of_service` (int 1-5)
  - `rating_ease_of_submitting_samples` (int 1-5)
  - `rating_clarity_of_reports` (int 1-5)
  - `rating_communication` (int 1-5)
  - `rating_cleanliness` (int 1-5)
  - `rating_overall_experience` (int 1-5)
  - `results_on_time` (text) — Yes / No / Partially
  - `reports_easy_to_understand` (text) — Yes / Somewhat / No
  - `nps_score` (int 0-10) — likelihood to recommend
  - `liked_most` (text) — open text
  - `improvements` (text) — open text
  - `wants_contact` (boolean) — whether customer wants to be contacted
  - `contact_name` (text, nullable)
  - `contact_email` (text, nullable)
  - `contact_phone` (text, nullable)
  - `additional_comments` (text, nullable) — open text
  - `referral_source` (text, nullable) — how they heard about us
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `survey_responses`.
- Allow anon + authenticated INSERT (public survey submission).
- Allow authenticated SELECT/UPDATE/DELETE (admin management).
*/

CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_used text,
  satisfaction int CHECK (satisfaction >= 1 AND satisfaction <= 5),
  rating_staff_professionalism int CHECK (rating_staff_professionalism >= 1 AND rating_staff_professionalism <= 5),
  rating_speed_of_service int CHECK (rating_speed_of_service >= 1 AND rating_speed_of_service <= 5),
  rating_ease_of_submitting_samples int CHECK (rating_ease_of_submitting_samples >= 1 AND rating_ease_of_submitting_samples <= 5),
  rating_clarity_of_reports int CHECK (rating_clarity_of_reports >= 1 AND rating_clarity_of_reports <= 5),
  rating_communication int CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_cleanliness int CHECK (rating_cleanliness >= 1 AND rating_cleanliness <= 5),
  rating_overall_experience int CHECK (rating_overall_experience >= 1 AND rating_overall_experience <= 5),
  results_on_time text CHECK (results_on_time IN ('Yes', 'No', 'Partially')),
  reports_easy_to_understand text CHECK (reports_easy_to_understand IN ('Yes', 'Somewhat', 'No')),
  nps_score int CHECK (nps_score >= 0 AND nps_score <= 10),
  liked_most text,
  improvements text,
  wants_contact boolean NOT NULL DEFAULT false,
  contact_name text,
  contact_email text,
  contact_phone text,
  additional_comments text,
  referral_source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Public can submit surveys (no sign-in required)
DROP POLICY IF EXISTS "anon_insert_surveys" ON survey_responses;
CREATE POLICY "anon_insert_surveys" ON survey_responses FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Admins (authenticated) can view, update, delete survey responses
DROP POLICY IF EXISTS "auth_select_surveys" ON survey_responses;
CREATE POLICY "auth_select_surveys" ON survey_responses FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_surveys" ON survey_responses;
CREATE POLICY "auth_update_surveys" ON survey_responses FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_surveys" ON survey_responses;
CREATE POLICY "auth_delete_surveys" ON survey_responses FOR DELETE
TO authenticated USING (true);
