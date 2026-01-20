-- Check and fix the role constraint and RLS policies for profiles table

-- 1. First, let's check what constraint exists on the role column
-- Run this to see the current constraint:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'profiles'::regclass AND conname LIKE '%role%';

-- 2. Drop the existing role check constraint if it's too restrictive
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 3. Add a new constraint that matches our application's roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('client', 'marchand', 'livreur', 'admin'));

-- 4. Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable all for service role" ON profiles;

-- 6. Create new policies that work for our use case
-- Allow authenticated users to insert their own profile (for registration)
CREATE POLICY "Enable insert for authenticated users only" ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Optional: Allow service role full access (for backend operations)
CREATE POLICY "Enable all for service role" ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
