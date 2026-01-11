-- Script to create test users. Run this in Supabase SQL Editor.

-- 1. Helper function to create user if not exists
CREATE OR REPLACE FUNCTION create_test_user(
    p_email text,
    p_password text,
    p_role text,
    p_first_name text,
    p_last_name text
) RETURNS void AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Check if user exists in auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;

    IF v_user_id IS NULL THEN
        -- Insert into auth.users
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
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            p_email,
            crypt(p_password, gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('role', p_role, 'first_name', p_first_name, 'last_name', p_last_name),
            now(),
            now(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO v_user_id;

        -- Insert into auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            v_user_id,
            v_user_id,
            jsonb_build_object('sub', v_user_id, 'email', p_email),
            'email',
            now(),
            now(),
            now()
        );
    END IF;

    -- Ensure profile exists (Triggers should handle this, but for safety)
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (v_user_id, p_email, p_first_name, p_last_name, p_role)
    ON CONFLICT (id) DO UPDATE SET role = p_role;

    -- Ensure role in user_roles
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, p_role::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

END;
$$ LANGUAGE plpgsql;

-- 2. Create the requested users
SELECT create_test_user('admin@yoombal.com', 'Touba28', 'admin', 'Super', 'Admin');
SELECT create_test_user('client@yoombal.com', 'Touba28', 'client', 'Client', 'Test');
SELECT create_test_user('livreur@yoombal.com', 'Touba28', 'driver', 'Livreur', 'Express');

-- 3. Cleanup function (optional)
DROP FUNCTION create_test_user;
