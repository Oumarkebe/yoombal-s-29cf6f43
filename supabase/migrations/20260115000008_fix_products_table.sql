-- Fix products table schema - Add missing columns and configure RLS

-- 1. Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;

-- 2. Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Merchants can insert own products" ON products;
DROP POLICY IF EXISTS "Merchants can view own products" ON products;
DROP POLICY IF EXISTS "Merchants can update own products" ON products;
DROP POLICY IF EXISTS "Merchants can delete own products" ON products;
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Enable all for service role" ON products;

-- 4. Create policies for merchants to manage their own products
-- Allow merchants to insert their own products
CREATE POLICY "Merchants can insert own products" ON products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = merchant_id);

-- Allow merchants to view their own products
CREATE POLICY "Merchants can view own products" ON products
FOR SELECT
TO authenticated
USING (auth.uid() = merchant_id);

-- Allow merchants to update their own products
CREATE POLICY "Merchants can update own products" ON products
FOR UPDATE
TO authenticated
USING (auth.uid() = merchant_id)
WITH CHECK (auth.uid() = merchant_id);

-- Allow merchants to delete their own products
CREATE POLICY "Merchants can delete own products" ON products
FOR DELETE
TO authenticated
USING (auth.uid() = merchant_id);

-- 5. Allow public (including clients) to view active products
CREATE POLICY "Public can view active products" ON products
FOR SELECT
TO public
USING (is_active = true OR is_active IS NULL);

-- 6. Allow service role full access (for backend operations)
CREATE POLICY "Enable all for service role" ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
