-- Script SQL pour SUPPRIMER et RECRÉER les utilisateurs marchand et livreur
-- À exécuter dans le SQL Editor de Supabase

BEGIN;

-- ========================================
-- ÉTAPE 1: SUPPRESSION COMPLÈTE
-- ========================================

-- Supprimer les rôles
DELETE FROM public.user_roles 
WHERE user_id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22');

-- Supprimer les profils
DELETE FROM public.profiles 
WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22');

-- Supprimer les utilisateurs de auth.users
DELETE FROM auth.users 
WHERE id IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22');

-- ========================================
-- ÉTAPE 2: RECRÉATION DES UTILISATEURS
-- ========================================

-- Extension pour le cryptage (si pas déjà activée)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- MARCHAND
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, recovery_token, 
    email_change_token_new, email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated', 
    'authenticated',
    'marchand@gmail.com',
    crypt('Touba28', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Marchand","last_name":"Yoombal"}',
    NOW(), NOW(), '', '', '', ''
);

-- Profil Marchand
INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name, phone, kyc_status)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'marchand@gmail.com', 
    'Marchand', 
    'Yoombal', 
    'merchant', 
    'Boutique Yoombal Test',
    '+221 77 111 11 11',
    'verified'
);

-- Rôle Marchand
INSERT INTO public.user_roles (user_id, role) 
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'merchant');

-- LIVREUR
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, recovery_token, 
    email_change_token_new, email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'authenticated', 
    'authenticated',
    'livreur@gmail.com',
    crypt('Touba28', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Livreur","last_name":"Express"}',
    NOW(), NOW(), '', '', '', ''
);

-- Profil Livreur
INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type, phone, kyc_status)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
    'livreur@gmail.com', 
    'Livreur', 
    'Express', 
    'delivery', 
    'scooter',
    '+221 77 222 22 22',
    'verified'
);

-- Rôle Livreur
INSERT INTO public.user_roles (user_id, role) 
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'delivery');

COMMIT;

-- Vérification
SELECT 'Utilisateurs recréés avec succès!' as resultat;
SELECT email, email_confirmed_at FROM auth.users WHERE email IN ('marchand@gmail.com', 'livreur@gmail.com');
