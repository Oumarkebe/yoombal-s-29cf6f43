
-- Insert a default instance into auth.instances if missing
-- Using the same UUID for both id and uuid
INSERT INTO auth.instances (id, uuid, raw_base_config, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    '{}',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Update the user to point to this instance
UPDATE auth.users 
SET instance_id = '00000000-0000-0000-0000-000000000000'
WHERE email = 'yoombal28@gmail.com';
