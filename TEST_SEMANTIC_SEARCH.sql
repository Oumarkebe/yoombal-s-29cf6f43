-- 🧪 SCRIPT DE TEST POUR LA RECHERCHE SÉMANTIQUE (AI_SMART_SEARCH) 🧪
--
-- Objectif : Vérifier si la recherche sémantique est active.
--
-- Comment l'utiliser :
-- 1. Exécutez ce script dans votre éditeur SQL Supabase.
-- 2. Lisez le résultat dans l'onglet "Messages" ou "Notifications" de l'éditeur.

DO $$
DECLARE
    search_config jsonb;
    threshold numeric;
    result_message text;
BEGIN
    -- Essayer de récupérer la configuration pour 'ai_smart_search'
    SELECT value INTO search_config FROM public.app_settings WHERE key = 'ai_smart_search';

    -- Gérer le cas où la configuration est totalement absente
    IF NOT FOUND THEN
        result_message := '⚠️ CONFIGURATION MANQUANTE : Aucune entrée ''ai_smart_search'' trouvée dans app_settings. La fonctionnalité est donc inactive.';
        RAISE WARNING '%', result_message;
        RETURN;
    END IF;

    -- Extraire le seuil sémantique (0 si la clé n'existe pas dans le JSON)
    threshold := COALESCE((search_config->>'semantic_threshold')::numeric, 0);

    -- Vérifier si le seuil est suffisant pour activer la fonctionnalité
    result_message := CASE
        WHEN threshold > 0 THEN '✅ ACTIVÉE : La recherche sémantique est fonctionnelle avec un seuil de pertinence de ' || threshold::text || '.'
        ELSE '❌ DÉSACTIVÉE : La recherche sémantique est inactive car son seuil est de ' || threshold::text || ' (doit être > 0).'
    END;

    RAISE NOTICE 'Résultat du test : %', result_message;
END $$;