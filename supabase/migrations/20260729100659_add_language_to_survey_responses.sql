/*
# Add language column to survey_responses

1. Modified Tables
- `survey_responses`
  - Add `language` (text, nullable) — stores which language the survey was taken in ("en" or "ar").

2. Security
- No RLS changes. Existing policies already cover INSERT for anon/authenticated.
*/

ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS language text;
