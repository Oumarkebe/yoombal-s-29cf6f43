
-- ============================================================================
-- YOOMBAL AUTOMATION HELPER
-- Ce script permet au robot d'exécuter du SQL automatiquement en local
-- ============================================================================

-- 1. Création de la fonction helper pour exécuter du SQL via API (Service Role Only)
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS void AS $$
BEGIN
    EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création de la table de log des migrations
CREATE TABLE IF NOT EXISTS public._migrations_log (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sécurité (Réservé au service_role)
REVOKE ALL ON FUNCTION exec_sql(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO service_role;

SELECT 'Automatisation prête ! Désormais, vos fichiers .sql dans /supabase/migrations seront appliqués tout seuls.' as message;
