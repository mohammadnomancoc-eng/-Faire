-- Add start_date to goal_landmarks to support multi-day milestone ranges.
-- target_date becomes the end/due date; start_date is the beginning of the milestone window.
-- Run this in your Supabase SQL Editor.

ALTER TABLE public.goal_landmarks
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Backfill existing rows: start_date = target_date (single-day milestones)
UPDATE public.goal_landmarks
SET start_date = target_date
WHERE start_date IS NULL;
