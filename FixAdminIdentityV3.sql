
-- Insert identity for yoombal28@gmail.com
-- Including provider_id (which is the user id for email provider)
INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    id,
    id::text, -- provider_id is text and matches user id for email provider
    jsonb_build_object(
        'sub', id,
        'email', email,
        'email_verified', true
    ),
    'email',
    now(),
    now(),
    now()
FROM auth.users
WHERE email = 'yoombal28@gmail.com'
ON CONFLICT DO NOTHING;
