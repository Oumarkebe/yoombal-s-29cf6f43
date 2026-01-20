-- 1. Activer le module de génération de contenu
INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
VALUES ('content_generation', true, '{"provider": "local"}')
ON CONFLICT (key) DO UPDATE SET is_enabled = true, configuration = '{"provider": "local"}';

-- 2. Configurer les clés API (valeurs par défaut pour le local)
INSERT INTO public.platform_settings (key, value)
VALUES ('ai_keys', '{"openaiApiKey": "", "groqApiKey": "", "perplexityApiKey": "", "mistralApiKey": "", "togetherApiKey": ""}')
ON CONFLICT (key) DO NOTHING;
