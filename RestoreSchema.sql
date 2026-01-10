
-- 1. Base Schema (from init.sql)
-- Table categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table users (Simple version to avoid confusion with auth.users for now)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table profiles (The main user table used in App)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  business_name TEXT,
  business_type TEXT,
  vehicle_type TEXT,
  zone TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL, -- Link to profiles?
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  status TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- 2. New AI Tables
-- Premium Features Config
CREATE TABLE IF NOT EXISTS premium_features (
    feature_key TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    category TEXT,
    is_premium BOOLEAN DEFAULT true,
    price_monthly NUMERIC,
    is_enabled BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}'::jsonb
);

-- Cart
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, 
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- AI Settings
CREATE TABLE IF NOT EXISTS public.ai_module_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_ai_feature_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

-- 3. RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Merchants can insert products" ON products FOR INSERT WITH CHECK (true); -- Simplification for dev
CREATE POLICY "Merchants can update products" ON products FOR UPDATE USING (true); 

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage cart" ON cart FOR ALL USING (auth.uid() = user_id);

ALTER TABLE ai_module_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View AI Settings" ON ai_module_settings FOR SELECT USING (true);

-- 4. Defaults
INSERT INTO premium_features (feature_key, name, description, category, is_premium, price_monthly, is_enabled, configuration)
VALUES 
('ai_analytics', 'Analytics IA', 'Prévisions de ventes et stocks', 'analytics', true, 15000, false, '{"prediction_horizon_days": 7}'),
('ai_vision', 'Vision IA', 'Recherche visuelle et contrôle qualité image', 'intelligence_artificielle', true, 12000, false, '{"qc_enabled": true, "visual_search_enabled": true}'),
('ai_pricing', 'Pricing Dynamique', 'Optimisation automatique des prix', 'intelligence_artificielle', true, 20000, false, '{"algorithm": "market_based", "min_margin": 0.1}')
ON CONFLICT DO NOTHING;

INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
VALUES 
    ('chatbot', true, '{"provider": "openai", "model": "gpt-4o-mini"}'),
    ('visual_search', true, '{"provider": "openai"}'),
    ('dynamic_pricing', true, '{"algorithm": "v1"}')
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

