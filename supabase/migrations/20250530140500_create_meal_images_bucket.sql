-- Migration: Create 'meal-images' storage bucket in Supabase
-- This script uses the storage API to create a bucket for meal images

-- This is a custom SQL migration for Supabase CLI
-- See: https://supabase.com/docs/guides/storage#managing-storage-buckets-with-sql

-- Create the bucket if it does not exist
insert into storage.buckets (id, name, public)
values ('meal-images', 'meal-images', true)
on conflict (id) do nothing;

-- You may want to set up RLS policies for more fine-grained control.
-- See Supabase docs for details.
