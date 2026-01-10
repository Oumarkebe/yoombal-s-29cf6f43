
-- 1. Create USER_ROLES table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'merchant', 'driver');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 2. Sync Profiles from Auth Users (Fix missing profiles)
INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT 
    id, 
    raw_user_meta_data->>'first_name', 
    raw_user_meta_data->>'last_name', 
    'client' -- Default role in profile
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 3. Ensure Admin Role for specific user (yoombal28)
-- Update Profile Role
UPDATE public.profiles 
SET role = 'admin', permissions = '{"ai_assistant": true, "ai_vision": true, "ai_analytics": true}'::jsonb
WHERE id = (SELECT id FROM auth.users WHERE email = 'yoombal28@gmail.com');

-- Update User Role Table (if used)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'yoombal28@gmail.com'
ON CONFLICT DO NOTHING;
