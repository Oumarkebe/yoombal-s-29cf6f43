-- Migration: Full Test Data Restoration
-- Description: Restores essential test accounts and populates products for the 12 Univers.
-- Created: 2026-01-19

BEGIN;

-- 1. Nettoyage préventif
DELETE FROM public.user_roles WHERE user_id IN (
    '623553ab-12c9-40ad-8528-dd7e7b496c76', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'
);

DELETE FROM public.profiles WHERE id IN (
    '623553ab-12c9-40ad-8528-dd7e7b496c76', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'
);

DELETE FROM auth.users WHERE id IN (
    '623553ab-12c9-40ad-8528-dd7e7b496c76', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'
) OR email IN ('yoombal28@gmail.com', 'marchand@gmail.com', 'livreur@gmail.com', 'client@gmail.com');

-- 2. Recréation des Utilisateurs dans auth.users
-- Password: Touba28
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ADMIN
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
    '623553ab-12c9-40ad-8528-dd7e7b496c76', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    'yoombal28@gmail.com', crypt('Touba28', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"first_name":"Admin","last_name":"Yoombal"}',
    NOW(), NOW(), false, '', '', '', ''
);

-- MARCHAND
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    'marchand@gmail.com', crypt('Touba28', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"first_name":"Marchand","last_name":"Test"}',
    NOW(), NOW(), false, '', '', '', ''
);

-- LIVREUR
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    'livreur@gmail.com', crypt('Touba28', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"first_name":"Livreur","last_name":"Express"}',
    NOW(), NOW(), false, '', '', '', ''
);

-- CLIENT
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    'client@gmail.com', crypt('Touba28', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"first_name":"Client","last_name":"Fidèle"}',
    NOW(), NOW(), false, '', '', '', ''
);

-- Identities
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, format('{"sub":"%s","email":"%s"}', id, email)::jsonb, 'email', id::text, NOW(), NOW(), NOW()
FROM auth.users
WHERE email IN ('yoombal28@gmail.com', 'marchand@gmail.com', 'livreur@gmail.com', 'client@gmail.com');

-- 3. Initialisation des Profils (public.profiles)
-- Harmonisation des rôles en Anglais pour correspondre au frontend (AppRole)
-- On met à jour la contrainte si nécessaire
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'merchant', 'driver', 'user', 'moderator'));

INSERT INTO public.profiles (id, email, first_name, last_name, role, kyc_status)
VALUES ('623553ab-12c9-40ad-8528-dd7e7b496c76', 'yoombal28@gmail.com', 'Admin', 'Yoombal', 'admin', 'verified')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'admin', kyc_status = 'verified';

INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name, kyc_status)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'marchand@gmail.com', 'Marchand', 'Test', 'merchant', 'Ma Belle Boutique', 'verified')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'merchant', business_name = 'Ma Belle Boutique', kyc_status = 'verified';

INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type, kyc_status)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'livreur@gmail.com', 'Livreur', 'Express', 'driver', 'scooter', 'verified')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'driver', vehicle_type = 'scooter', kyc_status = 'verified';

INSERT INTO public.profiles (id, email, first_name, last_name, role, kyc_status)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'client@gmail.com', 'Client', 'Fidèle', 'user', 'verified')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'user', kyc_status = 'verified';

-- 4. Attribution des Rôles (public.user_roles) - Identité Universelle pour Admin
INSERT INTO public.user_roles (user_id, role) VALUES 
('623553ab-12c9-40ad-8528-dd7e7b496c76', 'admin'),
('623553ab-12c9-40ad-8528-dd7e7b496c76', 'merchant'),
('623553ab-12c9-40ad-8528-dd7e7b496c76', 'driver'),
('623553ab-12c9-40ad-8528-dd7e7b496c76', 'user'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'merchant'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'driver'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'user')
ON CONFLICT DO NOTHING;

-- 5. Peuplement de Produits d'Exemple pour les 12 Univers
-- On utilise le marchand de test comme propriétaire par défaut.

DO $$
DECLARE
    m_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    cat_id uuid;
BEGIN
    -- Mode & Style
    cat_id := (SELECT id FROM public.categories WHERE name = 'Vêtements' LIMIT 1);
    IF cat_id IS NOT NULL THEN
        INSERT INTO public.products (merchant_id, category_id, name, description, price, stock, status)
        VALUES (m_id, cat_id, 'Chemise Oxford', 'Chemise élégante 100% coton', 15000, 20, 'active');
    END IF;

    -- High-Tech & Digital
    cat_id := (SELECT id FROM public.categories WHERE name = 'Smartphones' LIMIT 1);
    IF cat_id IS NOT NULL THEN
        INSERT INTO public.products (merchant_id, category_id, name, description, price, stock, status, bnpl_enabled)
        VALUES (m_id, cat_id, 'iPhone 15 Pro', 'Le top du top.', 750000, 10, 'active', true);
    END IF;

    -- Maison & Espace
    cat_id := (SELECT id FROM public.categories WHERE name = 'Mobilier' LIMIT 1);
    IF cat_id IS NOT NULL THEN
        INSERT INTO public.products (merchant_id, category_id, name, description, price, stock, status)
        VALUES (m_id, cat_id, 'Table en Bois Massif', 'Table artisanale pour 6 personnes', 120000, 5, 'active');
    END IF;

    -- Beauté (instead of Soins & Cosmétiques)
    cat_id := (SELECT id FROM public.categories WHERE name = 'Beauté' LIMIT 1);
    IF cat_id IS NOT NULL THEN
        INSERT INTO public.products (merchant_id, category_id, name, description, price, stock, status)
        VALUES (m_id, cat_id, 'Crème Hydratante Bio', 'Soin naturel visage et corps', 4500, 50, 'active');
    END IF;

    -- Auto & Mobilité
    cat_id := (SELECT id FROM public.categories WHERE name = 'Pièces détachées' LIMIT 1);
    IF cat_id IS NOT NULL THEN
        INSERT INTO public.products (merchant_id, category_id, name, description, price, stock, status)
        VALUES (m_id, cat_id, 'Plaquettes de frein', 'Haute performance pour citadines', 8000, 15, 'active');
    END IF;

END $$;

COMMIT;
