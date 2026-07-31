-- Run this in your Supabase SQL Editor to link daily tasks to goal tasks
-- This enables syncing between Monthly and Daily Planners and cascade deletions.

ALTER TABLE public.daily_tasks 
ADD COLUMN IF NOT EXISTS goal_task_id UUID REFERENCES public.goal_tasks(id) ON DELETE CASCADE;
