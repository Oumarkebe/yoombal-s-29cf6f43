
-- 1. Marchand (marchand@gmail.com / Touba28)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marchand@gmail.com') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated', 'authenticated',
        'marchand@gmail.com',
        crypt('Touba28', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Marchand","last_name":"Yoombal"}',
        now(), now()
    );

    -- Insert into public.profiles
    INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
    VALUES (v_user_id, 'marchand@gmail.com', 'Marchand', 'Yoombal', 'merchant', 'Boutique Yoombal Test');

    -- Insert into public.user_roles
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'merchant');
  END IF;
END $$;

-- 2. Livreur (livreur@gmail.com / Touba28)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'livreur@gmail.com') THEN
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated', 'authenticated',
        'livreur@gmail.com',
        crypt('Touba28', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Livreur","last_name":"Express"}',
        now(), now()
    );

    INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type)
    VALUES (v_user_id, 'livreur@gmail.com', 'Livreur', 'Express', 'delivery', 'scooter');

    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'delivery');
  END IF;
END $$;

-- 3. Admin (yombal28@gmail.com / Darousalam2828Touba)
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yombal28@gmail.com') THEN
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated', 'authenticated',
        'yombal28@gmail.com',
        crypt('Darousalam2828Touba', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"first_name":"Admin","last_name":"Yoombal"}',
        now(), now()
    );

    -- Admin profile
    INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
    VALUES (v_user_id, 'yombal28@gmail.com', 'Admin', 'Yoombal', 'admin', 'Yoombal HQ');

    -- Roles: Admin AND Merchant
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'merchant');
  END IF;
END $$;
