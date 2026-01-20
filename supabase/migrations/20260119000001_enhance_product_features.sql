-- Enhance product_reviews table
ALTER TABLE product_reviews
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified_purchase boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved';



-- Migration for images
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url') THEN
        UPDATE public.products
        SET images = ARRAY[image_url]
        WHERE (images IS NULL OR images = '{}') AND image_url IS NOT NULL;
    END IF;
END $$;
