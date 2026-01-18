-- Fix Ads Schema to match useAds.ts expectations
ALTER TABLE public.ads_campaigns 
RENAME COLUMN budget TO daily_budget;

ALTER TABLE public.ads_campaigns
ADD COLUMN IF NOT EXISTS current_spend NUMERIC DEFAULT 0;

ALTER TABLE public.ads_analytics
ADD COLUMN IF NOT EXISTS event_type TEXT;

ALTER TABLE public.ads_analytics
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Optional: Drop impressions, clicks, conversions if we want to move to per-event tracking entirely
-- But keeping them doesn't hurt.
