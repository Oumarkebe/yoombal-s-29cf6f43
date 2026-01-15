-- Add all missing columns to products table

-- Features: array of product features/benefits
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[];

-- Images: array of additional product images
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

-- Tags: array of product tags for search/filtering
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Weight: product weight (for shipping calculations)
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight NUMERIC;

-- Dimensions: product dimensions (for shipping)
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT;

-- Brand: product brand name
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;

-- Condition: product condition (new, used, refurbished, etc.)
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'new';

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
