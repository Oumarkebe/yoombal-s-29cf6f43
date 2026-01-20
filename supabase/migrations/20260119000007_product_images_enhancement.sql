-- Migration: Add multi-images support to products
-- Created: 2026-01-19

-- Add images column for multiple product images (if not already added in a previous migration)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add video_url column for product videos (YouTube, Vimeo, etc.)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS video_url text;

-- Migrate existing single image_url to images array
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url') THEN
        UPDATE public.products 
        SET images = ARRAY[image_url] 
        WHERE image_url IS NOT NULL AND (images IS NULL OR images = '{}');
    END IF;
END $$;

-- Comment on new columns
COMMENT ON COLUMN products.images IS 'Array of product image URLs for gallery';
COMMENT ON COLUMN products.video_url IS 'Optional product video URL (YouTube, Vimeo, etc.)';
