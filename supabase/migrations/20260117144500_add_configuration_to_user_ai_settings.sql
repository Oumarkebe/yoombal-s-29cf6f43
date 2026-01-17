-- Migration pour ajouter une colonne de configuration aux réglages IA utilisateur
ALTER TABLE public.user_ai_settings 
ADD COLUMN IF NOT EXISTS configuration JSONB DEFAULT '{}'::jsonb;

-- Commentaire pour expliquer le but de la colonne
COMMENT ON COLUMN public.user_ai_settings.configuration IS 'Paramètres spécifiques à la fonctionnalité (ex: authority_level, quota, etc.)';
