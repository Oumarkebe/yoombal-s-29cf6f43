
-- 1. Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'merchant', 'driver');

-- 2. Create user_roles table (security best practice)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 5. Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  business_name TEXT,
  business_type TEXT,
  vehicle_type TEXT,
  zone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  bnpl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 7. Create delivery_zones table
CREATE TABLE public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  areas TEXT[],
  base_fee NUMERIC DEFAULT 0,
  price_per_km NUMERIC DEFAULT 0,
  max_delivery_time_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- 8. Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 9. Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 10. Create deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES auth.users(id),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  distance_km NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  date TIMESTAMPTZ DEFAULT now(),
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  driver_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- 11. Create delivery_tracking table
CREATE TABLE public.delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  latitude NUMERIC,
  longitude NUMERIC,
  status_update TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

-- 12. Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 13. Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 14. Create bnpl_plans table
CREATE TABLE public.bnpl_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  duration_months INTEGER NOT NULL,
  remaining_months INTEGER NOT NULL,
  next_payment_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bnpl_plans ENABLE ROW LEVEL SECURITY;

-- 15. Create premium_features table
CREATE TABLE public.premium_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_premium BOOLEAN DEFAULT true,
  price_monthly NUMERIC DEFAULT 0,
  is_enabled BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

-- 16. Create ai_module_settings table
CREATE TABLE public.ai_module_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_module_settings ENABLE ROW LEVEL SECURITY;

-- 17. Create user_ai_settings table
CREATE TABLE public.user_ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, feature_key)
);

ALTER TABLE public.user_ai_settings ENABLE ROW LEVEL SECURITY;

-- =====================
-- RLS POLICIES
-- =====================

-- user_roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- products policies
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active' OR merchant_id = auth.uid());
CREATE POLICY "Merchants can manage their products" ON public.products FOR ALL USING (merchant_id = auth.uid());
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- delivery_zones policies (public read, admin write)
CREATE POLICY "Anyone can view active zones" ON public.delivery_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage zones" ON public.delivery_zones FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- orders policies
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (client_id = auth.uid() OR merchant_id = auth.uid());
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Merchants can update their orders" ON public.orders FOR UPDATE USING (merchant_id = auth.uid());
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- order_items policies
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.client_id = auth.uid() OR orders.merchant_id = auth.uid()))
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid())
);

-- deliveries policies
CREATE POLICY "Users can view their deliveries" ON public.deliveries FOR SELECT USING (customer_id = auth.uid() OR merchant_id = auth.uid() OR driver_id = auth.uid());
CREATE POLICY "Merchants can create deliveries" ON public.deliveries FOR INSERT WITH CHECK (merchant_id = auth.uid());
CREATE POLICY "Drivers can update assigned deliveries" ON public.deliveries FOR UPDATE USING (driver_id = auth.uid());
CREATE POLICY "Admins can manage all deliveries" ON public.deliveries FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- delivery_tracking policies
CREATE POLICY "Users can view tracking for their deliveries" ON public.delivery_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.deliveries WHERE deliveries.id = delivery_tracking.delivery_id AND (deliveries.customer_id = auth.uid() OR deliveries.driver_id = auth.uid()))
);
CREATE POLICY "Drivers can add tracking" ON public.delivery_tracking FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.deliveries WHERE deliveries.id = delivery_tracking.delivery_id AND deliveries.driver_id = auth.uid())
);

-- favorites policies
CREATE POLICY "Users can view their favorites" ON public.favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their favorites" ON public.favorites FOR ALL USING (user_id = auth.uid());

-- reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their reviews" ON public.reviews FOR ALL USING (user_id = auth.uid());

-- bnpl_plans policies
CREATE POLICY "Users can view their BNPL plans" ON public.bnpl_plans FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create BNPL plans" ON public.bnpl_plans FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all BNPL plans" ON public.bnpl_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- premium_features policies (public read, admin write)
CREATE POLICY "Anyone can view premium features" ON public.premium_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage premium features" ON public.premium_features FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ai_module_settings policies
CREATE POLICY "Anyone can view AI settings" ON public.ai_module_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage AI settings" ON public.ai_module_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- user_ai_settings policies
CREATE POLICY "Users can view their AI settings" ON public.user_ai_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their AI settings" ON public.user_ai_settings FOR ALL USING (user_id = auth.uid());

-- =====================
-- TRIGGERS
-- =====================

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON public.delivery_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_premium_features_updated_at BEFORE UPDATE ON public.premium_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_module_settings_updated_at BEFORE UPDATE ON public.ai_module_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_ai_settings_updated_at BEFORE UPDATE ON public.user_ai_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
