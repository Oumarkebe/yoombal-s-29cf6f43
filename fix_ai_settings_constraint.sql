-- Fix the restrictive CHECK constraint on user_ai_settings
-- This script adds all 27 feature keys used by the application

ALTER TABLE public.user_ai_settings 
DROP CONSTRAINT IF EXISTS user_ai_feature_settings_feature_key_check;

ALTER TABLE public.user_ai_settings
ADD CONSTRAINT user_ai_feature_settings_feature_key_check 
CHECK (feature_key = ANY (ARRAY[
    'custom_store',
    'unlimited_products',
    'export_data',
    'bulk_actions',
    'api_access',
    'delivery_dashboard',
    'route_optimization',
    'multi_deliveries',
    'unlimited_history',
    'ai_assistant',
    'content_generation',
    'ai_smart_search',
    'ai_vision',
    'ai_pricing',
    'product_recommendations',
    'predictions',
    'fraud_detection',
    'stock_prediction',
    'customer_notifications',
    'marketing_automation',
    'sales_analytics',
    'monthly_reports',
    'referral_system',
    'vip_program',
    'gamification',
    'priority_support',
    'premium_support'
]::text[]));

-- Verify the migration by ensuring a common key like 'ai_assistant' now works
-- (The user reported failures precisely because 'ai_assistant' or others weren't in the initial 3 keys)
