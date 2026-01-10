
-- Comprehensive population of premium_features
INSERT INTO public.premium_features (feature_key, name, description, category, is_premium, price_monthly, is_enabled, configuration)
VALUES 
-- Intelligence Artificielle
('ai_assistant', 'Assistant IA (Yoombal Bot)', 'Chatbot intelligent pour l''aide aux clients et marchands', 'intelligence_artificielle', true, 10000, false, '{"language": "fr", "support_wolof": true, "response_tone": "professional", "engine": "gpt-4o"}'),
('ai_content_gen', 'Génération de Contenu IA', 'Génération automatique de descriptions de produits', 'intelligence_artificielle', true, 5000, false, '{"max_length": 500, "tone": "commercial", "include_seo": true}'),
('ai_smart_search', 'Recherche Intelligente', 'Recherche sémantique, vocale et visuelle', 'intelligence_artificielle', true, 7500, false, '{"voice_enabled": true, "semantic_threshold": 0.7, "visual_search": true}'),
('ai_vision', 'Vision IA', 'Analyse d''images pour le contrôle qualité et la recherche', 'intelligence_artificielle', true, 12000, false, '{"qc_enabled": true, "visual_search_enabled": true}'),
('ai_pricing', 'Pricing Dynamique', 'Optimisation automatique des prix via IA', 'intelligence_artificielle', true, 20000, false, '{"algorithm": "market_based", "min_margin": 0.1}'),

-- Analytics & BI
('ai_analytics', 'Analytics Prédictifs', 'Prévision des ventes et analyse des tendances', 'analytics', true, 15000, false, '{"prediction_horizon_days": 7, "confidence_interval": 0.95}'),
('advanced_stats', 'Statistiques Avancées', 'Tableaux de bord et graphiques BI détaillés', 'analytics', true, 5000, false, '{"realtime": true, "export_enabled": true}'),

-- Automatisation
('fraud_detection', 'Détection de Fraude', 'Analyse automatique des risques sur les commandes', 'automatisation', true, 10000, false, '{"risk_threshold": 0.75, "auto_hold_orders": true}'),
('stock_prediction', 'Gestion Intelligente des Stocks', 'Alertes de réapprovisionnement prédictives', 'automatisation', true, 8000, false, '{"safety_stock_level": 0.15, "lead_time_days": 5}'),

-- Marketing
('product_recommendations', 'Recommandations de Produits', 'Moteur de recommandation personnalisé pour les clients', 'marketing', true, 7000, false, '{"algorithm": "hybrid", "max_recommendations": 8}'),
('marketing_automation', 'Marketing Automatisé', 'Campagnes SMS/Email automatiques basées sur le comportement', 'marketing', true, 12000, false, '{"channels": ["sms", "email", "push"], "frequency_limit": 2}'),

-- Fidélisation (Services Financiers / Marketing)
('referral_system', 'Système de Parrainage', 'Gérez les bonus de parrainage client/marchand', 'marketing', true, 5000, false, '{"reward_amount": 5000, "require_first_purchase": true}'),
('vip_program', 'Programme VIP', 'Gestion des paliers de fidélité et avantages exclusifs', 'marketing', true, 15000, false, '{"tiers": ["Silver", "Gold", "Platinum"], "discount_rate": 0.05}'),
('gamification', 'Gamification', 'Système de points, badges et défis pour les utilisateurs', 'marketing', true, 8000, false, '{"points_per_1000cffa": 10, "badges_enabled": true}')

ON CONFLICT (feature_key) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price_monthly = EXCLUDED.price_monthly,
  configuration = CASE 
    WHEN premium_features.configuration = '{}'::jsonb THEN EXCLUDED.configuration 
    ELSE premium_features.configuration 
  END;
