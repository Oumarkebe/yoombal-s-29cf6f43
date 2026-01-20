export const FEATURE_TRANSLATIONS: Record<string, string> = {
  // Core & Store
  custom_store: 'Boutique personnalisée',
  unlimited_products: 'Produits illimités',
  export_data: 'Export Excel (Données)',
  bulk_actions: 'Actions en masse',
  api_access: 'Accès API',

  // Delivery
  delivery_dashboard: 'Tableau de bord livraison',
  route_optimization: "Optimisation d'itinéraires",
  multi_deliveries: 'Livraisons multiples',
  unlimited_history: 'Historique illimité',

  // AI & Intelligence
  ai_assistant: 'Assistant IA Teranga',
  content_generation: 'Génération de Contenu IA',
  ai_smart_search: 'Recherche Intelligente (Visuelle/Vocale)',
  ai_vision: "Vision IA (Analyse d'images)",
  ai_pricing: 'Pricing Dynamique IA',
  product_recommendations: 'Recommandations Produits',
  predictions: 'Analyses Prédictives',
  fraud_detection: 'Détection de Fraude',
  stock_prediction: 'Prédiction de Stocks',

  // Marketing
  customer_notifications: 'Notifications Clients (SMS/Email)',
  marketing_automation: 'Marketing Automatisé',
  sales_analytics: 'Analyses de ventes',
  monthly_reports: 'Rapports mensuels',

  // Loyalty & Support
  referral_system: 'Système de Parrainage',
  vip_program: 'Programme VIP',
  gamification: 'Gamification',
  priority_support: 'Support Prioritaire',
  premium_support: 'Support Premium',
};

export type FeatureKey = keyof typeof FEATURE_TRANSLATIONS;

export const FEATURE_CATEGORIES: Record<string, string[]> = {
  merchant: [
    'custom_store',
    'unlimited_products',
    'sales_analytics',
    'customer_notifications',
    'ai_product_descriptions',
    'ai_pricing',
    'marketing_automation',
    'monthly_reports',
    'referral_system',
    'vip_program',
    'gamification',
    'product_recommendations',
    'predictions',
    'fraud_detection',
    'stock_prediction',
    'export_data',
    'bulk_actions',
    'api_access',
    'ai_assistant',
    'content_generation',
    'ai_smart_search',
    'ai_vision',
  ],
  delivery: [
    'delivery_dashboard',
    'route_optimization',
    'multi_deliveries',
    'unlimited_history',
    'priority_support',
  ],
  user: ['priority_support', 'ai_smart_search'], // Standard users might just get search/support
};

export function translateFeature(featureKey: string): string {
  return FEATURE_TRANSLATIONS[featureKey] || featureKey;
}
