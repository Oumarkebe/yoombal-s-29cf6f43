
-- Clean up first
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'yoombal28@gmail.com');
DELETE FROM public.profiles WHERE email = 'yoombal28@gmail.com';
DELETE FROM auth.users WHERE email = 'yoombal28@gmail.com';

-- Re-create admin user in auth.users
-- Password is 'Admin123!'
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_super_admin
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'yoombal28@gmail.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    NULL,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"Yoombal"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
);

-- Sync to public.profiles
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT id, email, (raw_user_meta_data->>'first_name'), (raw_user_meta_data->>'last_name'), 'admin'
FROM auth.users
WHERE email = 'yoombal28@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;

-- Ensure user_roles has 'admin'
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'yoombal28@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
