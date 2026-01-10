
-- Mise à jour des configurations par défaut pour les fonctionnalités premium
-- Cette commande remplit la colonne 'configuration' avec des paramètres robustes

UPDATE premium_features SET configuration = '{"language": "fr", "support_wolof": true, "response_tone": "professional", "engine": "gpt-4o", "max_tokens": 1000}' 
WHERE feature_key = 'ai_assistant';

UPDATE premium_features SET configuration = '{"max_length": 500, "tone": "commercial", "include_seo": true, "engine": "gpt-4-turbo"}' 
WHERE feature_key = 'ai_content_gen';

UPDATE premium_features SET configuration = '{"voice_enabled": true, "semantic_threshold": 0.7, "visual_search": false}' 
WHERE feature_key = 'ai_smart_search';

UPDATE premium_features SET configuration = '{"prediction_horizon_days": 7, "confidence_interval": 0.95, "include_seasonality": true}' 
WHERE feature_key = 'ai_analytics';

UPDATE premium_features SET configuration = '{"algorithm": "hybrid", "min_relevance_score": 0.65, "max_recommendations": 8}' 
WHERE feature_key = 'product_recommendations';

UPDATE premium_features SET configuration = '{"risk_threshold": 0.75, "auto_hold_orders": true, "notify_admin": true}' 
WHERE feature_key = 'fraud_detection';

UPDATE premium_features SET configuration = '{"safety_stock_level": 0.15, "lead_time_days": 5, "predictive_alerts": true}' 
WHERE feature_key = 'stock_prediction';

UPDATE premium_features SET configuration = '{"reward_amount": 5000, "max_referrals": 10, "require_first_purchase": true}' 
WHERE feature_key = 'referral_system';

UPDATE premium_features SET configuration = '{"channels": ["sms", "email", "push"], "frequency_limit": 2, "segments_enabled": true}' 
WHERE feature_key = 'marketing_automation';

UPDATE premium_features SET configuration = '{"tiers": ["Silver", "Gold", "Platinum"], "entry_threshold": 500000, "discount_rate": 0.05}' 
WHERE feature_key = 'vip_program';

UPDATE premium_features SET configuration = '{"points_per_1000cffa": 10, "badges_enabled": true, "leaderboard_public": true}' 
WHERE feature_key = 'gamification';

-- S'assurer que les clés manquantes sont créées si nécessaire (fallback au cas où la migration archive n'a pas tout mis)
INSERT INTO premium_features (feature_key, name, description, category, is_premium, price_monthly, is_enabled, configuration)
VALUES 
('ai_analytics', 'Analytics IA', 'Prévisions de ventes et stocks', 'analytics', true, 15000, false, '{"prediction_horizon_days": 7}'),
('ai_vision', 'Vision IA', 'Recherche visuelle et contrôle qualité image', 'intelligence_artificielle', true, 12000, false, '{"qc_enabled": true, "visual_search_enabled": true}'),
('ai_pricing', 'Pricing Dynamique', 'Optimisation automatique des prix', 'intelligence_artificielle', true, 20000, false, '{"algorithm": "market_based", "min_margin": 0.1}')
ON CONFLICT (feature_key) DO UPDATE SET configuration = EXCLUDED.configuration;
