-- Normalize premium_features
INSERT INTO public.premium_features (feature_key, name, description, is_enabled, configuration)
VALUES 
('predictions', 'Analyses Prédictives', 'Prévisions de ventes et tendances', true, '{"prediction_horizon_days": 7}'),
('pricing', 'Pricing Dynamique', 'Optimisation des prix par l''IA', true, '{"algorithm": "market_based", "min_margin": 0.1}'),
('ai_assistant', 'Assistant IA', 'Chatbot d''assistance intelligent', true, '{}'),
('ai_vision', 'Vision IA', 'Contrôle qualité des images', true, '{"qc_enabled": true}'),
('ai_smart_search', 'Recherche Intelligente', 'Recherche vocale et visuelle', true, '{}'),
('content_generation', 'Génération de Contenu', 'Génération automatique de descriptions', true, '{}')
ON CONFLICT (feature_key) DO UPDATE SET 
  is_enabled = EXCLUDED.is_enabled,
  configuration = (public.premium_features.configuration || EXCLUDED.configuration);

-- Clean up redundant keys if any
DELETE FROM public.premium_features WHERE feature_key IN ('ai_analytics', 'ai_pricing');

-- Sync ai_module_settings
INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
VALUES 
('predictions', true, '{}'),
('pricing', true, '{}'),
('ai_assistant', true, '{}'),
('ai_vision', true, '{}'),
('ai_smart_search', true, '{}'),
('content_generation', true, '{}')
ON CONFLICT (key) DO UPDATE SET is_enabled = true;

-- Update Admin user (yoombal28@gmail.com) permissions to ensure all true
-- First find the ID
DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM auth.users WHERE email = 'yoombal28@gmail.com';
    
    IF admin_id IS NOT NULL THEN
        UPDATE public.profiles 
        SET role = 'admin',
            permissions = jsonb_build_object(
                'predictions', jsonb_build_object('active', true),
                'pricing', jsonb_build_object('active', true),
                'ai_assistant', jsonb_build_object('active', true),
                'ai_vision', jsonb_build_object('active', true),
                'ai_smart_search', jsonb_build_object('active', true),
                'content_generation', jsonb_build_object('active', true)
            )
        WHERE id = admin_id;
    END IF;
END $$;
