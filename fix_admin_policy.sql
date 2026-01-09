
-- Enable RLS if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policy if it exists to avoid error
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create admin policy
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Do the same for other tables if needed, but let's start with profiles
