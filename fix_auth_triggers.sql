
-- 🛠️ SCRIPT DE RÉPARATION DES TRIGGERS AUTH 🛠️
-- L'erreur "Database error querying schema" vient souvent d'un "Trigger" automatique qui plante.
-- Ce script va nettoyer les triggers obsolètes sur la création d'utilisateur.

-- 1. Supprimer le trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Supprimer la fonction associée
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Supprimer d'autres variantes courantes (au cas où)
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_user();

-- Confirmation
SELECT 'Triggers nettoyés avec succès' as staatus;
