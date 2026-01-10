
-- Clean up first to ensure fresh state
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'yoombal28@gmail.com');
DELETE FROM public.profiles WHERE email = 'yoombal28@gmail.com';
DELETE FROM auth.users WHERE email = 'yoombal28@gmail.com';

-- Variables for IDs
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- Insert into auth.users (Password is 'Admin123!')
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        is_super_admin
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
        'yoombal28@gmail.com', crypt('Admin123!', gen_salt('bf')), now(), now(),
        '{"provider":"email","providers":["email"]}', '{"first_name":"Admin","last_name":"Yoombal"}', 
        now(), now(), false
    );

    -- Insert into public.profiles
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (new_user_id, 'yoombal28@gmail.com', 'Admin', 'Yoombal', 'admin');

    -- Insert into public.user_roles
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'admin'::app_role);
END $$;
