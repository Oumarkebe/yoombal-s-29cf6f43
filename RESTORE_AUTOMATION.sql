-- 🔄 SCRIPT DE RESTAURATION DE L'AUTOMATISATION (TRIGGERS) 🔄
-- Suite au "Grand Nettoyage", ce script réactive l'intelligence automatique.
-- Objectif : Que les futurs inscrits (via le site) aient leur profil créé automatiquement.

BEGIN;

-- 1. FONCTION DE CRÉATION DE PROFIL (ROBUSTE 💪)
-- Cette fonction récupère les métadonnées envoyées par Supabase Auth (ex: Prénom, Nom)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role text;
BEGIN
  -- Récupération du rôle depuis les métadonnées ou par défaut 'customer'
  default_role := COALESCE(new.raw_user_meta_data->>'role', 'customer');

  -- Insertion dans la table PROFILES
  INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    default_role,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING; -- Sécurité anti-crash si le profil existe déjà

  -- Insertion dans la table USER_ROLES (si nécessaire pour votre logique)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    default_role
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RÉACTIVATION DU TRIGGER 🔫
-- On supprime d'abord pour être sûr de ne pas avoir de doublons
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. VERIFICATION DES DROITS (RLS)
-- On s'assure que les triggers ont le droit d'écrire
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

COMMIT;

SELECT '✅ Automatisation réactivée ! Les nouveaux inscrits auront leur profil et rôle.' as resultat;