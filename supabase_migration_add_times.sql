-- Run this in your Supabase SQL Editor to add start_time and end_time columns
-- These columns are optional (nullable) so existing tasks are unaffected.

ALTER TABLE daily_tasks ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT NULL;
ALTER TABLE daily_tasks ADD COLUMN IF NOT EXISTS end_time TIME DEFAULT NULL;
