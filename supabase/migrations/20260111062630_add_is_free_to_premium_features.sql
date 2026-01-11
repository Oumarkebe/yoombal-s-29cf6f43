-- Add is_free column to premium_features table
ALTER TABLE public.premium_features ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.premium_features.is_free IS 'If true, the feature is accessible for free without subscription';
