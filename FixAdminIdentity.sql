
-- Insert identity for yoombal28@gmail.com
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    email
)
SELECT 
    gen_random_uuid(),
    id,
    jsonb_build_object(
        'sub', id,
        'email', email,
        'email_verified', true
    ),
    'email',
    now(),
    now(),
    now(),
    email
FROM auth.users
WHERE email = 'yoombal28@gmail.com'
ON CONFLICT DO NOTHING;
