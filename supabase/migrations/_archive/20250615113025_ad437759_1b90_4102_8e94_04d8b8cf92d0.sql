
-- Définit 'openai' comme fournisseur par défaut pour les modules de traduction et de génération de contenu
-- s'ils n'en ont pas déjà un de configuré.
UPDATE public.ai_module_settings
SET configuration = jsonb_set(COALESCE(configuration, '{}'::jsonb), '{provider}', '"openai"')
WHERE key IN ('content_generation', 'translation') AND (configuration->>'provider') IS NULL;
