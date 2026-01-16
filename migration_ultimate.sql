-- Migration Yoombal - Ajout colonnes produits avancés
-- Exécuter ce script pour mettre à jour la structure de la table products

ALTER TABLE products
-- Identification & Logistique
ADD COLUMN IF NOT EXISTS sku text UNIQUE,
ADD COLUMN IF NOT EXISTS barcode text,
ADD COLUMN IF NOT EXISTS min_stock int DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight float,
ADD COLUMN IF NOT EXISTS dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0}'::jsonb,

-- Offre & Pricing
ADD COLUMN IF NOT EXISTS unit text DEFAULT 'pièce',
ADD COLUMN IF NOT EXISTS cost_price float DEFAULT 0,
ADD COLUMN IF NOT EXISTS compare_at_price float,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'XOF',

-- Caractéristiques & Contenu
ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url text,

-- IA & SEO
ADD COLUMN IF NOT EXISTS ai_description boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_pricing_strategy text CHECK (ai_pricing_strategy IN ('aggressive', 'balanced', 'premium')),
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS slug text UNIQUE,

-- Digital & B2B
ADD COLUMN IF NOT EXISTS is_digital boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS download_url text,
ADD COLUMN IF NOT EXISTS wholesale_price float,
ADD COLUMN IF NOT EXISTS min_order_quantity int DEFAULT 1,
ADD COLUMN IF NOT EXISTS published_at timestamptz DEFAULT CURRENT_TIMESTAMP;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- Migration des données existantes
DO $$
BEGIN
    -- Générer des SKU uniques pour produits existants s'ils n'en ont pas
    UPDATE products 
    SET sku = 'PROD-' || LPAD(id::text, 6, '0') -- Fallback simple, idéalement use a sequence or more robust logic if id is uuid
    WHERE sku IS NULL;
    -- Note: UUID cast to text is safe but LPAD(uuid) is weird. 
    -- Better logic for existing UUIDs: just use prefix + substring
    UPDATE products
    SET sku = 'PROD-' || substring(id::text from 1 for 8)
    WHERE sku IS NULL;

    -- Générer des slugs basiques pour les produits existants
    -- Note: unaccent needs extension, trying without first or assuming it exists
    -- Using simple regexp replace for now to avoid errors if unaccent missing
    UPDATE products 
    SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL;
    
    -- Si ancien champ 'stock_alert' existe (ce n'est pas le cas ici a priori mais bonne pratique)
    -- UPDATE products 
    -- SET min_stock = stock_alert 
    -- FROM (SELECT id, stock_alert FROM products WHERE stock_alert IS NOT NULL) AS old
    -- WHERE products.id = old.id;
    
    -- Définir published_at pour produits existants
    UPDATE products 
    SET published_at = COALESCE(created_at, CURRENT_TIMESTAMP)
    WHERE published_at IS NULL;
END $$;
