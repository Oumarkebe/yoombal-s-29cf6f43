
-- 🛑 SCRIPT DE RÉINITIALISATION COMPLÈTE (CORRIGÉ & ROBUSTE) 🛑
-- 1. Nettoyage complet des données (Cascade manuelle pour éviter les erreurs FK)
-- 2. Recréation des utilisateurs de test

BEGIN;

-- Activer pgcrypto pour le hachage des mots de passe
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. NETTOYAGE (Ordre: Enfants -> Parents)

-- Supprimer les éléments liés aux commandes
DELETE FROM public.order_items;

-- Supprimer les livraisons (si la table existe et est liée)
-- DELETE FROM public.deliveries; -- Décommentez si la table existe

-- Supprimer les commandes
DELETE FROM public.orders;

-- Supprimer les produits (C'est ici que ça bloquait : un produit ne peut pas exister sans marchand)
DELETE FROM public.products;

-- Supprimer les rôles
DELETE FROM public.user_roles;

-- Supprimer les profils
DELETE FROM public.profiles;

-- Supprimer les utilisateurs de l'authentification
DELETE FROM auth.users;


-- 2. RECRÉATION DES UTILISATEURS

-- === MARCHAND (marchand@gmail.com / Touba28) ===
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated', 'authenticated',
    'marchand@gmail.com',
    crypt('Touba28', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Marchand","last_name":"Yoombal"}',
    now(), now()
);

INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'marchand@gmail.com', 'Marchand', 'Yoombal', 'merchant', 'Boutique Yoombal Test');

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

INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'livreur@gmail.com', 'Livreur', 'Express', 'delivery', 'scooter');

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

INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'yombal28@gmail.com', 'Admin', 'Yoombal', 'admin', 'Yoombal HQ');

INSERT INTO public.user_roles (user_id, role) VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'admin');
INSERT INTO public.user_roles (user_id, role) VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'merchant');

COMMIT;

SELECT email, role, id FROM auth.users;
