
-- AUTOMATIC TEST USER CREATION
-- Using DO block to avoid function persistence issues during seed

DO $$
DECLARE
    v_user_id uuid;
    v_email text;
    v_password text := 'Touba28';
    v_role text;       -- The intent role (for user_roles)
    v_profile_role text; -- The role to put in profiles table (constrained)
    v_fname text;
    v_lname text;
    user_record record;
BEGIN
    FOR user_record IN 
        SELECT * FROM (VALUES 
            ('admin@yoombal.com', 'admin', 'Super', 'Admin'),
            ('client@yoombal.com', 'client', 'Client', 'Test'),
            ('livreur@yoombal.com', 'driver', 'Livreur', 'Express')
        ) AS t(email, role, fname, lname)
    LOOP
        v_email := user_record.email;
        v_role := user_record.role;
        v_fname := user_record.fname;
        v_lname := user_record.lname;

        -- Determine valid profile role to satisfy conflicting CHECK constraints
        -- Constraints allow: 'admin', 'client' (intersection of English/French checks)
        IF v_role = 'admin' THEN
            v_profile_role := 'admin';
        ELSE
            v_profile_role := 'client';
        END IF;

        -- Check if user exists
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

        IF v_user_id IS NULL THEN
            -- Insert into auth.users
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_email, crypt(v_password, gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('role', v_role, 'first_name', v_fname, 'last_name', v_lname), now(), now(), '', '', '', ''
            ) RETURNING id INTO v_user_id;

            -- Insert into auth.identities
            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                v_user_id, v_user_id, jsonb_build_object('sub', v_user_id, 'email', v_email), 'email', v_email, now(), now(), now()
            );
        END IF;

        -- Ensure profile with VALID constrained role
        INSERT INTO public.profiles (id, email, first_name, last_name, role)
        VALUES (v_user_id, v_email, v_fname, v_lname, v_profile_role)
        ON CONFLICT (id) DO UPDATE SET role = v_profile_role;

        -- Ensure user_role with ACTUAL intent role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, v_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
    END LOOP;
END $$;
