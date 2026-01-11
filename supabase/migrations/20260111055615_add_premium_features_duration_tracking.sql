-- Add duration tracking fields to premium_features table

ALTER TABLE public.premium_features 
ADD COLUMN IF NOT EXISTS activated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'disabled' CHECK (status IN ('active', 'trial', 'expired', 'disabled'));

-- Update existing enabled features to have activated_at and status
UPDATE public.premium_features 
SET 
    activated_at = NOW(),
    status = 'active'
WHERE is_enabled = true AND activated_at IS NULL;

-- Create function to auto-update status based on expiration
CREATE OR REPLACE FUNCTION update_feature_status()
RETURNS trigger AS $$
BEGIN
    -- If feature is being enabled
    IF NEW.is_enabled = true AND OLD.is_enabled = false THEN
        NEW.activated_at = NOW();
        
        -- If trial_days is set, this is a trial
        IF NEW.trial_days > 0 THEN
            NEW.expires_at = NOW() + (NEW.trial_days || ' days')::interval;
            NEW.status = 'trial';
        ELSE
            NEW.status = 'active';
        END IF;
    END IF;
    
    -- If feature is being disabled
    IF NEW.is_enabled = false AND OLD.is_enabled = true THEN
        NEW.status = 'disabled';
    END IF;
    
    -- Check expiration
    IF NEW.expires_at IS NOT NULL AND NOW() > NEW.expires_at THEN
        NEW.status = 'expired';
        NEW.is_enabled = false;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_premium_feature_status ON public.premium_features;
CREATE TRIGGER update_premium_feature_status
    BEFORE UPDATE ON public.premium_features
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_status();

-- Add comment
COMMENT ON COLUMN public.premium_features.activated_at IS 'Date when the feature was first activated';
COMMENT ON COLUMN public.premium_features.expires_at IS 'Date when the feature subscription expires';
COMMENT ON COLUMN public.premium_features.trial_days IS 'Number of days for trial period (0 = no trial)';
COMMENT ON COLUMN public.premium_features.status IS 'Current status: active, trial, expired, or disabled';
