
-- Fix search path for non-reserved roles
ALTER ROLE postgres SET search_path TO auth, public, extensions;
ALTER ROLE anon SET search_path TO public, extensions;
ALTER ROLE authenticated SET search_path TO public, extensions;
ALTER ROLE service_role SET search_path TO public, extensions;

-- Attempt to grant usage on auth to other roles if needed
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO service_role;
