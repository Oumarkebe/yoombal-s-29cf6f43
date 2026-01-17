-- Add Yoombal Ads fields to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ad_priority INTEGER DEFAULT 0, -- 0 to 10
ADD COLUMN IF NOT EXISTS ad_expiry TIMESTAMPTZ;

-- Index for fast ad retrieval
CREATE INDEX IF NOT EXISTS idx_products_ads ON public.products(is_sponsored) WHERE is_sponsored = true;
