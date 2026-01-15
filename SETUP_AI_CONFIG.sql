-- 🧠 SCRIPT DE CONFIGURATION IA & PARAMÈTRES GLOBAUX 🧠
-- Ce script met en place la table de stockage des paramètres JSON (IA, Pricing, etc.)
-- et active la synchronisation automatique mentionnée dans le guide.

BEGIN;

-- 1. CRÉATION DE LA TABLE DE CONFIGURATION
CREATE TABLE IF NOT EXISTS public.app_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL DEFAULT '{}'::jsonb,
    description text,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) -- Optionnel : pour savoir qui a modifié
);

-- 2. SÉCURITÉ (RLS) 🛡️
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Tout le monde (l'appli) peut lire les configs pour s'adapter (ex: langue, pricing)
CREATE POLICY "Allow public read access" ON public.app_settings
    FOR SELECT USING (true);

-- Seuls les admins peuvent modifier (On se base sur la table user_roles)
CREATE POLICY "Allow admin update" ON public.app_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. INSERTION DES VALEURS PAR DÉFAUT (Selon ADMIN_AI_GUIDE.md) 📝
INSERT INTO public.app_settings (key, value, description)
VALUES
('ai_assistant', '{
    "language": "fr",
    "support_wolof": true,
    "response_tone": "friendly",
    "engine": "gpt-4o"
}', 'Configuration de l''assistant virtuel (Griot)'),

('content_generation', '{
    "max_length": 500,
    "tone": "commercial",
    "include_seo": true
}', 'Paramètres de génération de descriptions produits'),

('ai_smart_search', '{
    "voice_enabled": true,
    "semantic_threshold": 0.75
}', 'Configuration de la recherche intelligente'),

('ai_vision', '{
    "qc_enabled": true,
    "visual_search_enabled": true
}', 'Paramètres de vision par ordinateur'),

('pricing', '{
    "algorithm": "market_based",
    "min_margin": 0.15
}', 'Algorithme de prix dynamique'),

('predictions', '{
    "prediction_horizon_days": 30,
    "confidence_interval": 0.9
}', 'Paramètres prédictifs des ventes'),

('referral_system', '{
    "reward_amount": 1000,
    "max_referrals": 10,
    "require_first_purchase": true
}', 'Système de parrainage'),

('marketing_automation', '{
    "channels": ["email", "push"],
    "frequency_limit": 3
}', 'Limites du marketing automatisé')

ON CONFLICT (key) DO UPDATE
SET description = EXCLUDED.description; 
-- Note: On ne met pas à jour 'value' en cas de conflit pour ne pas écraser vos réglages actuels si la table existe déjà.

-- 4. TRIGGER DE SYNCHRONISATION ⚡
-- Notifie l'application (Realtime) à chaque changement de configuration
CREATE OR REPLACE FUNCTION public.notify_app_settings_change()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  PERFORM pg_notify('app_settings_changed', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_app_settings_change ON public.app_settings;
CREATE TRIGGER on_app_settings_change
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE PROCEDURE public.notify_app_settings_change();

COMMIT;

SELECT '✅ Configurations IA installées et synchronisation active.' as resultat;