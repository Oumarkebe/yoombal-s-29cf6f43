
-- Set search_path for authenticator role
ALTER ROLE authenticator SET search_path TO public, auth, extensions;
-- Also for authenticated and anon just in case
ALTER ROLE authenticated SET search_path TO public, auth, extensions;
ALTER ROLE anon SET search_path TO public, auth, extensions;

-- Ensure supabase_admin can see auth
ALTER ROLE supabase_admin SET search_path TO public, auth, extensions;

-- Re-verify auth schema migrations just in case
-- This is just to see if we can query it now with the new path
SELECT count(*) FROM auth.users;
