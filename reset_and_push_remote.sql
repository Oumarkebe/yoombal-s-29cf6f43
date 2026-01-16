-- ============================================================================
-- SCRIPT DE RESET COMPLET ET PUSH LOCAL → REMOTE
-- ⚠️ ATTENTION: Ce script SUPPRIME TOUTES les données de la base distante!
-- ============================================================================

-- Étape 1: Supprimer complètement le schéma public
DROP SCHEMA IF EXISTS public CASCADE;

-- Étape 2: Recréer le schéma public vierge
CREATE SCHEMA public;

-- Étape 3: Restaurer les permissions par défaut
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- ============================================================================
-- MAINTENANT, COPIEZ-COLLEZ LE CONTENU DE "full_schema_export.sql" ICI
-- OU EXÉCUTEZ-LE EN TANT QUE DEUXIÈME SCRIPT JUSTE APRÈS CELUI-CI
-- ============================================================================
