
-- Add email column to profiles and sync from auth.users
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing profiles with emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Create a trigger to keep email in sync on insert/update if needed, 
-- but for now, let's just do a one-time sync and manual update on trigger if it exists.
