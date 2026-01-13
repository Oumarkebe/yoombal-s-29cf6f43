-- Fix RLS policies for profiles table to allow registration
-- This allows users to insert their own profile during registration

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can view own profile" ON "public"."profiles";

-- Allow authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON "public"."profiles"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON "public"."profiles"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Optional: Allow admins to view all profiles
-- CREATE POLICY "Admins can view all profiles" ON "public"."profiles"
-- AS PERMISSIVE FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM user_roles
--     WHERE user_id = auth.uid() AND role = 'admin'
--   )
-- );
