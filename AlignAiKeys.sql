
-- Align keys in ai_module_settings
UPDATE public.ai_module_settings SET key = 'pricing' WHERE key = 'ai_pricing';
UPDATE public.ai_module_settings SET key = 'predictions' WHERE key = 'ai_analytics';

-- Align keys in user_ai_feature_settings
UPDATE public.user_ai_feature_settings SET feature_key = 'pricing' WHERE feature_key = 'ai_pricing';
UPDATE public.user_ai_feature_settings SET feature_key = 'predictions' WHERE feature_key = 'ai_analytics';

-- Ensure both keys exist in ai_module_settings if they were missing
INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
SELECT 'pricing', false, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.ai_module_settings WHERE key = 'pricing');

INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
SELECT 'predictions', false, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.ai_module_settings WHERE key = 'predictions');
