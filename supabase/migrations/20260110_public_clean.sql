--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_ai_feature_settings DROP CONSTRAINT IF EXISTS user_ai_feature_settings_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_merchant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.delivery_tracking DROP CONSTRAINT IF EXISTS delivery_tracking_delivery_id_fkey;
ALTER TABLE IF EXISTS ONLY public.deliveries DROP CONSTRAINT IF EXISTS deliveries_merchant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.deliveries DROP CONSTRAINT IF EXISTS deliveries_driver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.deliveries DROP CONSTRAINT IF EXISTS deliveries_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_service_id_fkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_driver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart DROP CONSTRAINT IF EXISTS cart_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart DROP CONSTRAINT IF EXISTS cart_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_plans DROP CONSTRAINT IF EXISTS bnpl_plans_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_plans DROP CONSTRAINT IF EXISTS bnpl_plans_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_applications DROP CONSTRAINT IF EXISTS bnpl_applications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_applications DROP CONSTRAINT IF EXISTS bnpl_applications_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.user_ai_feature_settings DROP CONSTRAINT IF EXISTS user_ai_feature_settings_user_id_feature_key_key;
ALTER TABLE IF EXISTS ONLY public.user_ai_feature_settings DROP CONSTRAINT IF EXISTS user_ai_feature_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.premium_features DROP CONSTRAINT IF EXISTS premium_features_pkey;
ALTER TABLE IF EXISTS ONLY public.premium_features DROP CONSTRAINT IF EXISTS premium_features_feature_key_key;
ALTER TABLE IF EXISTS ONLY public.platform_settings DROP CONSTRAINT IF EXISTS platform_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_pkey;
ALTER TABLE IF EXISTS ONLY public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_pkey;
ALTER TABLE IF EXISTS ONLY public.delivery_tracking DROP CONSTRAINT IF EXISTS delivery_tracking_pkey;
ALTER TABLE IF EXISTS ONLY public.deliveries DROP CONSTRAINT IF EXISTS deliveries_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.cart DROP CONSTRAINT IF EXISTS cart_user_id_product_id_key;
ALTER TABLE IF EXISTS ONLY public.cart DROP CONSTRAINT IF EXISTS cart_pkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_plans DROP CONSTRAINT IF EXISTS bnpl_plans_user_id_order_id_key;
ALTER TABLE IF EXISTS ONLY public.bnpl_plans DROP CONSTRAINT IF EXISTS bnpl_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.bnpl_applications DROP CONSTRAINT IF EXISTS bnpl_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_module_settings DROP CONSTRAINT IF EXISTS ai_module_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_module_settings DROP CONSTRAINT IF EXISTS ai_module_settings_key_key;
ALTER TABLE IF EXISTS ONLY public.ai_feature_profile_settings DROP CONSTRAINT IF EXISTS ai_feature_profile_settings_profile_type_feature_key_key;
ALTER TABLE IF EXISTS ONLY public.ai_feature_profile_settings DROP CONSTRAINT IF EXISTS ai_feature_profile_settings_pkey;
--
-- Name: get_latest_delivery_locations(uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_latest_delivery_locations(p_delivery_ids uuid[]) RETURNS TABLE(delivery_id uuid, latitude numeric, longitude numeric, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
begin
  return query
      with latest_tracking as (
          select
              dt.delivery_id,
              dt.latitude,
              dt.longitude,
              dt.created_at,
              row_number() over(partition by dt.delivery_id order by dt.created_at desc) as rn
          from public.delivery_tracking dt
          where dt.delivery_id = any(p_delivery_ids)
      )
      select
          lt.delivery_id,
          lt.latitude,
          lt.longitude,
          lt.created_at
      from latest_tracking lt
      where lt.rn = 1;
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, role, email, business_name, business_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'client'),
    NEW.email,
    NEW.raw_user_meta_data ->> 'business_name',
    NEW.raw_user_meta_data ->> 'business_type'
  );
  RETURN NEW;
END;
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Vérifie si l'utilisateur a le rôle 'admin' dans son profil
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_feature_profile_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_feature_profile_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_type text NOT NULL,
    feature_key text NOT NULL,
    is_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_module_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_module_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    is_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    configuration jsonb DEFAULT '{}'::jsonb
);


--
-- Name: bnpl_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bnpl_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    merchant_id uuid NOT NULL,
    requested_amount numeric NOT NULL,
    plan_duration integer NOT NULL,
    monthly_payment numeric NOT NULL,
    fees_amount numeric DEFAULT 0 NOT NULL,
    first_payment_amount numeric NOT NULL,
    application_status text DEFAULT 'pending'::text NOT NULL,
    merchant_decision text,
    merchant_decision_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bnpl_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bnpl_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid NOT NULL,
    total_amount numeric NOT NULL,
    monthly_payment numeric NOT NULL,
    remaining_months integer NOT NULL,
    next_payment_date date,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    plan_duration integer,
    fees_amount numeric DEFAULT 0,
    first_payment_amount numeric,
    application_status text DEFAULT 'pending'::text
);


--
-- Name: cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_id uuid NOT NULL,
    service_id uuid,
    driver_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deliveries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    merchant_id uuid NOT NULL,
    driver_id uuid,
    pickup_address text NOT NULL,
    delivery_address text NOT NULL,
    customer_phone text NOT NULL,
    customer_name text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    estimated_delivery_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    delivery_fee numeric DEFAULT 0 NOT NULL,
    distance_km numeric,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ref text,
    client text,
    date date,
    CONSTRAINT deliveries_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'assigned'::text, 'picked_up'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text])))
);


--
-- Name: delivery_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_id uuid NOT NULL,
    latitude numeric,
    longitude numeric,
    status_update text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_zones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    areas text[] NOT NULL,
    base_fee numeric DEFAULT 0 NOT NULL,
    price_per_km numeric DEFAULT 0 NOT NULL,
    max_delivery_time_minutes integer DEFAULT 60 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    merchant_id uuid NOT NULL,
    total_amount numeric DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text,
    payment_status text DEFAULT 'pending'::text,
    delivery_address text,
    delivery_phone text,
    delivery_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_settings (
    key text NOT NULL,
    value jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: premium_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.premium_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_key text NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    is_premium boolean DEFAULT false,
    price_monthly numeric DEFAULT 0,
    is_enabled boolean DEFAULT false,
    configuration jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    merchant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    category_id uuid,
    image_url text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    bnpl_enabled boolean DEFAULT false,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text, 'out_of_stock'::text]))),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    first_name text,
    last_name text,
    phone text,
    role text DEFAULT 'client'::text,
    business_name text,
    business_type text,
    vehicle_type text,
    zone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    address text,
    birth_date timestamp with time zone,
    email text,
    city text,
    postal_code text,
    business_address text,
    business_city text,
    business_postal_code text,
    business_tax_id text,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['client'::text, 'livreur'::text, 'admin'::text, 'marchand'::text]))),
    CONSTRAINT "profiles_rôle_check" CHECK ((role = ANY (ARRAY['client'::text, 'merchant'::text, 'delivery'::text, 'admin'::text])))
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_ai_feature_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_ai_feature_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    feature_key text NOT NULL,
    is_enabled boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_ai_feature_settings_feature_key_check CHECK ((feature_key = ANY (ARRAY['content_generation'::text, 'pricing'::text, 'predictions'::text])))
);


--
-- Name: TABLE user_ai_feature_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_ai_feature_settings IS 'Stores user-specific overrides for AI feature enablement.';


--
-- Name: COLUMN user_ai_feature_settings.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_ai_feature_settings.user_id IS 'References the user profile.';


--
-- Name: COLUMN user_ai_feature_settings.feature_key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_ai_feature_settings.feature_key IS 'The key of the AI feature (e.g., content_generation).';


--
-- Name: COLUMN user_ai_feature_settings.is_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_ai_feature_settings.is_enabled IS 'Whether the feature is enabled or disabled for this user.';


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_feature_profile_settings ai_feature_profile_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feature_profile_settings
    ADD CONSTRAINT ai_feature_profile_settings_pkey PRIMARY KEY (id);


--
-- Name: ai_feature_profile_settings ai_feature_profile_settings_profile_type_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feature_profile_settings
    ADD CONSTRAINT ai_feature_profile_settings_profile_type_feature_key_key UNIQUE (profile_type, feature_key);


--
-- Name: ai_module_settings ai_module_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_module_settings
    ADD CONSTRAINT ai_module_settings_key_key UNIQUE (key);


--
-- Name: ai_module_settings ai_module_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_module_settings
    ADD CONSTRAINT ai_module_settings_pkey PRIMARY KEY (id);


--
-- Name: bnpl_applications bnpl_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_applications
    ADD CONSTRAINT bnpl_applications_pkey PRIMARY KEY (id);


--
-- Name: bnpl_plans bnpl_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_plans
    ADD CONSTRAINT bnpl_plans_pkey PRIMARY KEY (id);


--
-- Name: bnpl_plans bnpl_plans_user_id_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_plans
    ADD CONSTRAINT bnpl_plans_user_id_order_id_key UNIQUE (user_id, order_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart cart_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);


--
-- Name: delivery_tracking delivery_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_tracking
    ADD CONSTRAINT delivery_tracking_pkey PRIMARY KEY (id);


--
-- Name: delivery_zones delivery_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (key);


--
-- Name: premium_features premium_features_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.premium_features
    ADD CONSTRAINT premium_features_feature_key_key UNIQUE (feature_key);


--
-- Name: premium_features premium_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.premium_features
    ADD CONSTRAINT premium_features_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: user_ai_feature_settings user_ai_feature_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ai_feature_settings
    ADD CONSTRAINT user_ai_feature_settings_pkey PRIMARY KEY (id);


--
-- Name: user_ai_feature_settings user_ai_feature_settings_user_id_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ai_feature_settings
    ADD CONSTRAINT user_ai_feature_settings_user_id_feature_key_key UNIQUE (user_id, feature_key);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: idx_bnpl_applications_merchant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bnpl_applications_merchant_id ON public.bnpl_applications USING btree (merchant_id);


--
-- Name: idx_bnpl_applications_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bnpl_applications_product_id ON public.bnpl_applications USING btree (product_id);


--
-- Name: idx_bnpl_applications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bnpl_applications_status ON public.bnpl_applications USING btree (application_status);


--
-- Name: idx_bnpl_applications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bnpl_applications_user_id ON public.bnpl_applications USING btree (user_id);


--
-- Name: idx_cart_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_user_id ON public.cart USING btree (user_id);


--
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_client_id ON public.orders USING btree (client_id);


--
-- Name: idx_orders_merchant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_merchant_id ON public.orders USING btree (merchant_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: product_reviews_product_id_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_reviews_product_id_user_id_idx ON public.product_reviews USING btree (product_id, user_id);


--
-- Name: user_roles_user_id_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_roles_user_id_role_idx ON public.user_roles USING btree (user_id, role);


--
-- Name: platform_settings handle_platform_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_ai_feature_settings handle_user_ai_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_user_ai_settings_updated_at BEFORE UPDATE ON public.user_ai_feature_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cart update_cart_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deliveries update_deliveries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: delivery_zones update_delivery_zones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON public.delivery_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: premium_features update_premium_features_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_premium_features_updated_at BEFORE UPDATE ON public.premium_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bnpl_applications bnpl_applications_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_applications
    ADD CONSTRAINT bnpl_applications_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: bnpl_applications bnpl_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_applications
    ADD CONSTRAINT bnpl_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bnpl_plans bnpl_plans_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_plans
    ADD CONSTRAINT bnpl_plans_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: bnpl_plans bnpl_plans_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bnpl_plans
    ADD CONSTRAINT bnpl_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cart cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: courses courses_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.profiles(id);


--
-- Name: courses courses_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: deliveries deliveries_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id);


--
-- Name: deliveries deliveries_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES auth.users(id);


--
-- Name: deliveries deliveries_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES auth.users(id);


--
-- Name: delivery_tracking delivery_tracking_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_tracking
    ADD CONSTRAINT delivery_tracking_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id);


--
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_ai_feature_settings user_ai_feature_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_ai_feature_settings
    ADD CONSTRAINT user_ai_feature_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: courses Admin full manage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin full manage" ON public.courses USING ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));


--
-- Name: user_roles Admins can delete user roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete user roles" ON public.user_roles FOR DELETE USING (public.is_admin());


--
-- Name: user_roles Admins can insert user roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert user roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: user_ai_feature_settings Admins can manage all user AI feature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all user AI feature settings" ON public.user_ai_feature_settings USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: premium_features Admins can manage premium features; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage premium features" ON public.premium_features TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: user_roles Admins can read all user roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can read all user roles" ON public.user_roles FOR SELECT USING (public.is_admin());


--
-- Name: ai_module_settings Admins can update AI module settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update AI module settings" ON public.ai_module_settings FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- Name: user_roles Admins can update user roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update user roles" ON public.user_roles FOR UPDATE USING (public.is_admin());


--
-- Name: services Allow admin manage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admin manage" ON public.services USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- Name: ai_module_settings Allow authenticated read access to AI module settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated read access to AI module settings" ON public.ai_module_settings FOR SELECT TO authenticated USING (true);


--
-- Name: services Allow read to all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read to all" ON public.services FOR SELECT USING (true);


--
-- Name: delivery_zones Anyone can view active delivery zones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active delivery zones" ON public.delivery_zones FOR SELECT USING ((is_active = true));


--
-- Name: products Anyone can view active products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (((status = 'active'::text) OR (merchant_id = auth.uid())));


--
-- Name: categories Anyone can view categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);


--
-- Name: courses Client can read own courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Client can read own courses" ON public.courses FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.deliveries d
  WHERE ((d.id = courses.delivery_id) AND (d.customer_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))) OR (driver_id = auth.uid())));


--
-- Name: delivery_tracking Drivers can insert tracking updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Drivers can insert tracking updates" ON public.delivery_tracking FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.deliveries d
  WHERE ((d.id = delivery_tracking.delivery_id) AND (d.driver_id = auth.uid())))));


--
-- Name: platform_settings Les administrateurs peuvent gérer les paramètres de la platef; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les administrateurs peuvent gérer les paramètres de la platef" ON public.platform_settings USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: products Les administrateurs peuvent gérer les produits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les administrateurs peuvent gérer les produits" ON public.products USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: delivery_zones Les administrateurs peuvent gérer les zones de livraison; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les administrateurs peuvent gérer les zones de livraison" ON public.delivery_zones USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: profiles Les administrateurs peuvent gérer tous les profils; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les administrateurs peuvent gérer tous les profils" ON public.profiles USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: user_roles Les administrateurs peuvent lire tous les roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les administrateurs peuvent lire tous les roles" ON public.user_roles FOR SELECT USING (public.is_admin());


--
-- Name: products Les produits sont visibles publiquement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les produits sont visibles publiquement" ON public.products FOR SELECT USING (true);


--
-- Name: delivery_zones Les utilisateurs authentifiés peuvent voir les zones de livrai; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les utilisateurs authentifiés peuvent voir les zones de livrai" ON public.delivery_zones FOR SELECT TO authenticated USING (true);


--
-- Name: profiles Les utilisateurs peuvent mettre à jour leur propre profil; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: profiles Les utilisateurs peuvent voir leur propre profil; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: deliveries Merchants and drivers can update deliveries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants and drivers can update deliveries" ON public.deliveries FOR UPDATE USING (((auth.uid() = merchant_id) OR (auth.uid() = driver_id)));


--
-- Name: deliveries Merchants can create deliveries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can create deliveries" ON public.deliveries FOR INSERT WITH CHECK ((auth.uid() = merchant_id));


--
-- Name: products Merchants can delete their own products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can delete their own products" ON public.products FOR DELETE USING ((merchant_id = auth.uid()));


--
-- Name: products Merchants can insert their own products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can insert their own products" ON public.products FOR INSERT WITH CHECK ((merchant_id = auth.uid()));


--
-- Name: bnpl_applications Merchants can update applications for their products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can update applications for their products" ON public.bnpl_applications FOR UPDATE USING ((auth.uid() = merchant_id));


--
-- Name: products Merchants can update their own products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can update their own products" ON public.products FOR UPDATE USING ((merchant_id = auth.uid()));


--
-- Name: bnpl_applications Merchants can view applications for their products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Merchants can view applications for their products" ON public.bnpl_applications FOR SELECT USING ((auth.uid() = merchant_id));


--
-- Name: user_roles Un utilisateur peut insérer ses rôles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Un utilisateur peut insérer ses rôles" ON public.user_roles FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: user_roles Un utilisateur peut lire ses rôles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Un utilisateur peut lire ses rôles" ON public.user_roles FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: user_roles Un utilisateur peut mettre à jour ses rôles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Un utilisateur peut mettre à jour ses rôles" ON public.user_roles FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: user_roles Un utilisateur peut supprimer ses rôles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Un utilisateur peut supprimer ses rôles" ON public.user_roles FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: order_items Users can create items for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create items for their orders" ON public.order_items FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_items.order_id) AND (orders.client_id = auth.uid())))));


--
-- Name: bnpl_applications Users can create their own BNPL applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own BNPL applications" ON public.bnpl_applications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bnpl_plans Users can create their own BNPL plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own BNPL plans" ON public.bnpl_plans FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: orders Users can create their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK ((auth.uid() = client_id));


--
-- Name: favorites Users can delete their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: favorites Users can insert their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: cart Users can manage their own cart; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own cart" ON public.cart USING ((auth.uid() = user_id));


--
-- Name: user_ai_feature_settings Users can read their own AI feature settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read their own AI feature settings" ON public.user_ai_feature_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bnpl_plans Users can update their own BNPL plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own BNPL plans" ON public.bnpl_plans FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: orders Users can update their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING ((auth.uid() = client_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: order_items Users can view items of their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view items of their orders" ON public.order_items FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_items.order_id) AND (orders.client_id = auth.uid())))));


--
-- Name: premium_features Users can view premium features; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view premium features" ON public.premium_features FOR SELECT TO authenticated USING (true);


--
-- Name: bnpl_applications Users can view their own BNPL applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own BNPL applications" ON public.bnpl_applications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: bnpl_plans Users can view their own BNPL plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own BNPL plans" ON public.bnpl_plans FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: deliveries Users can view their own deliveries as customer; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own deliveries as customer" ON public.deliveries FOR SELECT USING ((auth.uid() = customer_id));


--
-- Name: deliveries Users can view their own deliveries as driver; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own deliveries as driver" ON public.deliveries FOR SELECT USING ((auth.uid() = driver_id));


--
-- Name: deliveries Users can view their own deliveries as merchant; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own deliveries as merchant" ON public.deliveries FOR SELECT USING ((auth.uid() = merchant_id));


--
-- Name: favorites Users can view their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: orders Users can view their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING ((auth.uid() = client_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: delivery_tracking Users can view tracking for their deliveries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view tracking for their deliveries" ON public.delivery_tracking FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.deliveries d
  WHERE ((d.id = delivery_tracking.delivery_id) AND ((d.customer_id = auth.uid()) OR (d.merchant_id = auth.uid()) OR (d.driver_id = auth.uid()))))));


--
-- Name: ai_feature_profile_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_feature_profile_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_module_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_module_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: product_reviews all-can-select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "all-can-select" ON public.product_reviews FOR SELECT USING (true);


--
-- Name: bnpl_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bnpl_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: bnpl_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bnpl_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: cart; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: deliveries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

--
-- Name: delivery_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: delivery_zones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: premium_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

--
-- Name: product_reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: product_reviews user-can-delete-own-review; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "user-can-delete-own-review" ON public.product_reviews FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: product_reviews user-can-insert-own-review; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "user-can-insert-own-review" ON public.product_reviews FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: product_reviews user-can-update-own-review; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "user-can-update-own-review" ON public.product_reviews FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_ai_feature_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_ai_feature_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

