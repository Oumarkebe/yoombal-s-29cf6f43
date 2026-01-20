-- Migration pour corriger les problèmes d'authentification
-- Supprime tous les triggers problématiques et nettoie le schéma auth

BEGIN;

-- 1. Supprimer tous les triggers sur auth.users qui peuvent causer des problèmes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;

-- 2. Supprimer les fonctions associées
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_auth_user_created() CASCADE;

-- 3. VérifierDatabase que les politiques RLS sur profiles ne bloquent pas les insertions
-- Temporairement désactiver RLS sur profiles pour le debugging
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS avec des politiques simplifiées
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Créer des politiques RLS simples et fonctionnelles
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
CREATE POLICY "Allow public read access" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Faire de même pour user_roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to roles" ON public.user_roles;
CREATE POLICY "Allow public read access to roles" ON public.user_roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage their roles" ON public.user_roles;
CREATE POLICY "Allow authenticated users to manage their roles" ON public.user_roles
    FOR ALL USING (auth.uid() = user_id);

COMMIT;

SELECT '✅ Nettoyage du schéma auth terminé' as resultat;
