-- 1. Sync data from premium_features to ai_module_settings ONE LAST TIME
INSERT INTO public.ai_module_settings (key, is_enabled, configuration, updated_at)
SELECT feature_key, is_enabled, configuration, NOW()
FROM public.premium_features
WHERE category = 'intelligence_artificielle'
ON CONFLICT (key) DO UPDATE SET
    is_enabled = EXCLUDED.is_enabled,
    configuration = EXCLUDED.configuration,
    updated_at = EXCLUDED.updated_at;

-- 2. Delete legacy keys from ai_module_settings
DELETE FROM public.ai_module_settings
WHERE key IN ('chatbot', 'visual_search', 'dynamic_pricing');

-- 3. Create function for synchronization
CREATE OR REPLACE FUNCTION sync_premium_feature_to_ai_module()
RETURNS TRIGGER AS $$
BEGIN
    -- Only sync features in the 'intelligence_artificielle' category
    IF NEW.category = 'intelligence_artificielle' THEN
        INSERT INTO public.ai_module_settings (key, is_enabled, configuration, updated_at)
        VALUES (NEW.feature_key, NEW.is_enabled, NEW.configuration, NOW())
        ON CONFLICT (key) DO UPDATE SET
            is_enabled = EXCLUDED.is_enabled,
            configuration = EXCLUDED.configuration,
            updated_at = EXCLUDED.updated_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger
DROP TRIGGER IF EXISTS tr_sync_premium_feature_to_ai_module ON public.premium_features;
CREATE TRIGGER tr_sync_premium_feature_to_ai_module
AFTER INSERT OR UPDATE ON public.premium_features
FOR EACH ROW
EXECUTE FUNCTION sync_premium_feature_to_ai_module();
