-- ============================================================
-- À Faire — Consolidated Migration
-- Run this in your Supabase SQL Editor.
-- All statements use IF NOT EXISTS / IF EXISTS so they are
-- safe to re-run on an already partially-migrated database.
-- ============================================================


-- ── 1. daily_tasks: task time-range columns ─────────────────
-- Needed by: DailyTaskCard.jsx (start_time, end_time display)
ALTER TABLE public.daily_tasks
  ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT NULL;

ALTER TABLE public.daily_tasks
  ADD COLUMN IF NOT EXISTS end_time TIME DEFAULT NULL;


-- ── 2. daily_tasks: link to goal_tasks (cascade delete) ─────
-- Needed by: useGoals.js deleteGoalTask, useDailyTasks.js toggleTask
ALTER TABLE public.daily_tasks
  ADD COLUMN IF NOT EXISTS goal_task_id UUID
    REFERENCES public.goal_tasks(id) ON DELETE CASCADE;


-- ── 3. goal_landmarks: multi-day milestone start date ───────
-- Needed by: LandmarkList.jsx (start_date → target_date range display)
ALTER TABLE public.goal_landmarks
  ADD COLUMN IF NOT EXISTS start_date DATE;

-- Backfill: treat existing single-day milestones as start = target
UPDATE public.goal_landmarks
SET start_date = target_date
WHERE start_date IS NULL;
