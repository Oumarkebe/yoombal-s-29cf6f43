-- Add status column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'blocked', 'pending'));

-- Create an index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Update RLS policies to allow admins to update status
CREATE POLICY "Admins can update user status"
ON public.profiles
FOR UPDATE
USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
);
