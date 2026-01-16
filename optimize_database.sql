-- 🚀 Optimisation Finale des Performances Yoombal-s

-- 1. Index GIN pour la recherche textuelle (Name & Description)
-- Nécessite l'extension pg_trgm pour les recherches ILIKE performantes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON public.products USING gin (description gin_trgm_ops);

-- 2. Index pour les filtres fréquents
CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON public.products (merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);

-- 3. Index pour le tri par date (Marketplace)
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- 4. Optimisation des commandes (Admin/Merchant)
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

ANALYZE public.products;
ANALYZE public.orders;
