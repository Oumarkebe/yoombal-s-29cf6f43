-- Activation de llama.cpp (local) comme fournisseur par défaut
UPDATE public.ai_module_settings 
SET configuration = '{"provider": "local"}' 
WHERE key = 'content_generation';

-- Vérification
SELECT key, configuration FROM public.ai_module_settings WHERE key = 'content_generation';
