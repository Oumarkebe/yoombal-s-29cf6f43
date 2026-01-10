-- Activation des fonctionnalités AI Pricing et Analytics
-- Mise à jour dans premium_features
UPDATE premium_features 
SET is_enabled = true 
WHERE feature_key IN ('ai_pricing', 'ai_analytics', 'ai_vision');

-- Mise à jour dans ai_module_settings (pour la synchronisation logicielle)
-- On s'assure que les entrées existent avant de mettre à jour, ou on les insère si absentes
INSERT INTO ai_module_settings (key, is_enabled, configuration)
VALUES 
('pricing', true, '{"algorithm": "market_based", "min_margin": 0.1}'),
('predictions', true, '{"prediction_horizon_days": 7}')
ON CONFLICT (key) DO UPDATE SET is_enabled = true;

-- Vérification
SELECT feature_key, is_enabled FROM premium_features WHERE feature_key IN ('ai_pricing', 'ai_analytics', 'ai_vision');
SELECT key, is_enabled FROM ai_module_settings WHERE key IN ('pricing', 'predictions');
