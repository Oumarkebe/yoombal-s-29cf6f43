
-- 🧹 SCRIPT DE NETTOYAGE TOTAL (Avant création manuelle) 🧹
-- On supprime tout pour repartir sur une base saine.

-- 1. Supprimer les profils et rôles
DELETE FROM public.user_roles;
DELETE FROM public.profiles;

-- 2. Supprimer les utilisateurs
DELETE FROM auth.users;

-- 3. Vérification (Doit retourner 0 ligne)
SELECT count(*) as nombre_utilisateurs FROM auth.users;
