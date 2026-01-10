
-- Set search_path for authenticator role
ALTER ROLE authenticator SET search_path TO public, auth, extensions;
-- Also for authenticated and anon just in case
ALTER ROLE authenticated SET search_path TO public, auth, extensions;
ALTER ROLE anon SET search_path TO public, auth, extensions;

-- Verify
SHOW search_path;
