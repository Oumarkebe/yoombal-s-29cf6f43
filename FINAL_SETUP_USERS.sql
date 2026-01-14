
-- 🚀 SCRIPT ULTIME D'INSTALLATION (TOUT-EN-UN) 🚀
-- Ce script fait TOUT :
-- 1. Active l'extension secrète pour les mots de passe (pgcrypto)
-- 2. Nettoie tout.
-- 3. Crée les utilisateurs ET les profils correctement.

BEGIN;

-- 1. ACTIVATION ET NETTOYAGE TECHNIQUE
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Désactiver les triggers qui causent l'erreur "Database error querying schema"
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_user();

-- 2. GRAND NETTOYAGE DES DONNÉES (Ordre intelligent)
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.products;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM auth.users;


-- 3. CRÉATION DES UTILISATEURS (Avec le bon cryptage)

-- === MARCHAND (marchand@gmail.com / Touba28) ===
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated', 'authenticated',
    'marchand@gmail.com',
    crypt('Touba28', gen_salt('bf')), -- Le cryptage magique 🔮
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Marchand","last_name":"Yoombal"}',
    now(), now()
);
-- Profil Marchand
INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'marchand@gmail.com', 'Marchand', 'Yoombal', 'merchant', 'Boutique Yoombal Test');
-- Rôle Marchand
INSERT INTO public.user_roles (user_id, role) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'merchant');


-- === LIVREUR (livreur@gmail.com / Touba28) ===
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'authenticated', 'authenticated',
    'livreur@gmail.com',
    crypt('Touba28', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Livreur","last_name":"Express"}',
    now(), now()
);
-- Profil Livreur
INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'livreur@gmail.com', 'Livreur', 'Express', 'delivery', 'scooter');
-- Rôle Livreur
INSERT INTO public.user_roles (user_id, role) VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'delivery');


-- === ADMIN (yombal28@gmail.com / Darousalam2828Touba) ===
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
    'authenticated', 'authenticated',
    'yombal28@gmail.com',
    crypt('Darousalam2828Touba', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"Yoombal"}',
    now(), now()
);
-- Profil Admin
INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'yombal28@gmail.com', 'Admin', 'Yoombal', 'admin', 'Yoombal HQ');
-- Rôles Admin
INSERT INTO public.user_roles (user_id, role) VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'admin');
INSERT INTO public.user_roles (user_id, role) VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'merchant');

COMMIT;

SELECT '✅ TOUT EST PRÊT ! Connectez-vous maintenant.' as resultat;
