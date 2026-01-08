
-- Ajouter de nouveaux modules IA et fonctionnalités avancées
INSERT INTO ai_module_settings (key, is_enabled, configuration) VALUES 
-- IA Avancée
('ai_assistant', false, '{"language": "fr", "support_wolof": true, "response_tone": "professional"}'),
('product_recommendations', false, '{"algorithm": "collaborative", "min_score": 0.7}'),
('fraud_detection', false, '{"risk_threshold": 0.8, "auto_reject": false}'),
('stock_prediction', false, '{"prediction_days": 30, "confidence_threshold": 0.85}'),

-- Analytics & BI
('advanced_analytics', false, '{"real_time": true, "retention_days": 365}'),
('custom_reports', false, '{"max_reports": 10, "export_formats": ["pdf", "excel"]}'),
('performance_analysis', false, '{"metrics": ["roi", "conversion", "churn"]}'),
('sales_forecasting', false, '{"model": "arima", "forecast_period": 90}'),

-- Automatisation
('smart_notifications', false, '{"channels": ["sms", "email"], "auto_trigger": true}'),
('auto_stock_management', false, '{"reorder_threshold": 10, "auto_reorder": false}'),
('auto_invoicing', false, '{"template": "standard", "auto_send": true}'),
('multi_platform_sync', false, '{"platforms": [], "sync_interval": 3600}'),

-- Services Financiers
('merchant_microcredit', false, '{"max_amount": 500000, "interest_rate": 0.12}'),
('digital_wallet', false, '{"cashback_rate": 0.02, "max_balance": 1000000}'),
('treasury_management', false, '{"dashboard": true, "alerts": true}'),
('extended_insurance', false, '{"coverage_types": ["goods", "cyber"], "max_coverage": 5000000}'),

-- Expansion
('multi_currency', false, '{"currencies": ["XOF", "EUR", "USD"], "auto_convert": true}'),
('advanced_geolocation', false, '{"dynamic_zones": true, "route_optimization": true}'),
('multi_country', false, '{"countries": ["SN", "ML", "BF"], "compliance": true}'),
('bank_integration', false, '{"partners": [], "real_time_sync": true}'),

-- Marketing
('referral_system', false, '{"reward_amount": 5000, "max_referrals": 10}'),
('marketing_automation', false, '{"campaigns": [], "segmentation": true}'),
('vip_program', false, '{"tiers": 3, "benefits": ["discount", "priority"]}'),
('gamification', false, '{"points_system": true, "badges": true, "contests": true}')

ON CONFLICT (key) DO NOTHING;

-- Créer une table pour les fonctionnalités premium
CREATE TABLE IF NOT EXISTS premium_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  price_monthly NUMERIC DEFAULT 0,
  is_enabled BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insérer les fonctionnalités premium
INSERT INTO premium_features (feature_key, name, description, category, is_premium, price_monthly, is_enabled) VALUES
-- IA Avancée
('ai_assistant', 'Assistant IA Multilingue', 'Chatbot intelligent avec support FR/Wolof', 'intelligence_artificielle', true, 15000, false),
('product_recommendations', 'Recommandations Intelligentes', 'Algorithme de recommandation avancé', 'intelligence_artificielle', true, 12000, false),
('fraud_detection', 'Détection de Fraude', 'Système anti-fraude automatisé', 'intelligence_artificielle', true, 25000, false),
('stock_prediction', 'Prédiction de Stock', 'IA pour anticiper les ruptures', 'intelligence_artificielle', true, 18000, false),

-- Analytics & BI
('advanced_analytics', 'Analytics Avancé', 'Dashboard avec métriques temps réel', 'analytics', true, 20000, false),
('custom_reports', 'Rapports Personnalisés', 'Export PDF/Excel automatisé', 'analytics', true, 10000, false),
('performance_analysis', 'Analyse Performance', 'ROI et taux de conversion détaillés', 'analytics', true, 15000, false),
('sales_forecasting', 'Prévisions Ventes', 'Modèles prédictifs revenus', 'analytics', true, 22000, false),

-- Automatisation
('smart_notifications', 'Notifications Intelligentes', 'SMS/Email automatiques contextuels', 'automatisation', true, 8000, false),
('auto_stock_management', 'Gestion Stock Auto', 'Alertes et réapprovisionnement auto', 'automatisation', true, 12000, false),
('auto_invoicing', 'Facturation Automatisée', 'Génération et envoi factures auto', 'automatisation', true, 10000, false),
('multi_platform_sync', 'Synchronisation Multi-Plateforme', 'API pour systèmes externes', 'automatisation', true, 30000, false),

-- Services Financiers
('merchant_microcredit', 'Micro-crédit Marchands', 'Financement pour développer activité', 'services_financiers', true, 35000, false),
('digital_wallet', 'Wallet Digital', 'Portefeuille électronique avec cashback', 'services_financiers', true, 25000, false),
('treasury_management', 'Gestion Trésorerie', 'Outils suivi financier avancé', 'services_financiers', true, 20000, false),
('extended_insurance', 'Assurance Étendue', 'Protection marchandises et cyber', 'services_financiers', true, 15000, false),

-- Expansion
('multi_currency', 'Multi-Devises', 'Support CFA, Euro, Dollar', 'expansion', true, 18000, false),
('advanced_geolocation', 'Géolocalisation Avancée', 'Zones dynamiques et optimisation', 'expansion', true, 12000, false),
('multi_country', 'Multi-Pays', 'Expansion Mali, Burkina Faso', 'expansion', true, 40000, false),
('bank_integration', 'Intégration Bancaire', 'Connexion banques partenaires', 'expansion', true, 50000, false),

-- Marketing
('referral_system', 'Système Parrainage', 'Récompenses nouveaux utilisateurs', 'marketing', true, 8000, false),
('marketing_automation', 'Marketing Automatisé', 'Campagnes email/SMS ciblées', 'marketing', true, 15000, false),
('vip_program', 'Programme VIP', 'Avantages gros acheteurs', 'marketing', true, 12000, false),
('gamification', 'Gamification', 'Points, badges et concours', 'marketing', true, 10000, false)

ON CONFLICT (feature_key) DO NOTHING;

-- Ajouter des politiques RLS pour premium_features
ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage premium features"
ON premium_features
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can view premium features"
ON premium_features
FOR SELECT
TO authenticated
USING (true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE TRIGGER update_premium_features_updated_at
    BEFORE UPDATE ON premium_features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
