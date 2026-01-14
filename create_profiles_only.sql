
-- 🛑 SCRIPT V2 : JUSTE LES PROFILS (Exécutez APRÈS avoir créé les users via l'interface)
-- Ce script ne touche PAS à l'authentification (auth.users), il ajoute juste les infos métier.

-- 1. Nettoyage des rôles et profils SEULEMENT
DELETE FROM public.user_roles;
DELETE FROM public.profiles;

-- 2. Création des profils pour les emails que vous aurez créés
-- REMARQUE : Cela suppose que vous avez créé les users avec ces emails exacts.

-- MARCHAND
INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
SELECT id, email, 'Marchand', 'Yoombal', 'merchant', 'Boutique Yoombal Test'
FROM auth.users WHERE email = 'marchand@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'merchant' FROM auth.users WHERE email = 'marchand@gmail.com';


-- LIVREUR
INSERT INTO public.profiles (id, email, first_name, last_name, role, vehicle_type)
SELECT id, email, 'Livreur', 'Express', 'delivery', 'scooter'
FROM auth.users WHERE email = 'livreur@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'delivery' FROM auth.users WHERE email = 'livreur@gmail.com';


-- ADMIN
INSERT INTO public.profiles (id, email, first_name, last_name, role, business_name)
SELECT id, email, 'Admin', 'Yoombal', 'admin', 'Yoombal HQ'
FROM auth.users WHERE email = 'yombal28@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'yombal28@gmail.com';
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'merchant' FROM auth.users WHERE email = 'yombal28@gmail.com';
