
-- 🚨 SCRIPT D'URGENCE POUR DÉBLOQUER LA CONNEXION (ERREUR 500) 🚨

-- Ce script va temporairement désactiver les sécurités complexes qui pourraient faire planter le serveur.
-- Si la connexion marche après ça, on saura que c'était un problème de règles de sécurité (RLS) ou de Triggers.

BEGIN;

-- 1. DÉSACTIVER RLS (Pour tester si c'est une boucle infinie de sécurité)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
-- Note: On ne touche pas à auth.users car on ne peut pas, mais on touche aux tables liées.

-- 2. SUPPRIMER TOUS LES TRIGGERS SUSPECTS SUR AUTH.USERS
-- (On essaie toutes les variantes de noms possibles)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_logged_in ON auth.users;
DROP TRIGGER IF EXISTS user_created_trigger ON auth.users;

-- 3. NETTOYER LES FONCTIONS LIÉES
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();
DROP FUNCTION IF EXISTS public.create_profile_for_user();

COMMIT;

-- Verification
SELECT 'RLS desactivé et Triggers supprimés. Essai connexion...' as status;
