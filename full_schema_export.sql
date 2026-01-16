-- Supabase Full Schema Export
-- Generated: 2026-01-16T18:46:59.939Z
-- Database: postgres (local)

BEGIN;

CREATE TABLE public._migrations_log (applied_at timestamp with time zone DEFAULT now(), filename text NOT NULL);

CREATE TABLE public.admin_orders_view (status text, client_first_name text, payment_method text, updated_at timestamp with time zone, client_email text, delivery_notes text, delivery_phone text, delivery_address text, total_amount numeric, merchant_business_name text, merchant_last_name text, merchant_first_name text, merchant_email text, client_id uuid, merchant_id uuid, items_count bigint, id uuid, created_at timestamp with time zone, payment_status text, client_phone text, client_last_name text);

CREATE TABLE public.ai_chat_logs (action_detected text, tone_used text, intention text, id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid, commercial_success boolean DEFAULT false, raw_response jsonb, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, message_content text NOT NULL, tone_consistency text, session_id text);

CREATE TABLE public.ai_feature_profile_settings (id uuid DEFAULT gen_random_uuid() NOT NULL, feature_key text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, is_enabled boolean DEFAULT false NOT NULL, profile_type text NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.ai_module_settings (key text NOT NULL, is_enabled boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, configuration jsonb DEFAULT '{}'::jsonb, id uuid DEFAULT gen_random_uuid() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.application_messages (read_at timestamp with time zone, attachment_url text, message_type text DEFAULT 'text'::text, content text NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, application_id uuid, sender_id uuid, is_read boolean DEFAULT false, is_system_message boolean DEFAULT false, created_at timestamp with time zone DEFAULT timezone('utc'::text, now()));

CREATE TABLE public.bnpl_applications (plan_duration integer NOT NULL, requested_amount numeric NOT NULL, merchant_id uuid NOT NULL, application_status text DEFAULT 'pending'::text NOT NULL, merchant_decision text, product_id uuid NOT NULL, applicant_phone text, order_id uuid, contract_signed_at timestamp with time zone, updated_at timestamp with time zone DEFAULT now() NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, merchant_decision_date timestamp with time zone, first_payment_amount numeric NOT NULL, fees_amount numeric DEFAULT 0 NOT NULL, user_id uuid NOT NULL, monthly_payment numeric NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, photo_url text, id_card_url text, applicant_id_number text);

CREATE TABLE public.bnpl_plans (user_id uuid NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, order_id uuid NOT NULL, total_amount numeric NOT NULL, monthly_payment numeric NOT NULL, remaining_months integer NOT NULL, next_payment_date date, created_at timestamp with time zone DEFAULT now() NOT NULL, plan_duration integer, fees_amount numeric DEFAULT 0, first_payment_amount numeric, installments jsonb DEFAULT '[]'::jsonb, merchant_id uuid, product_id uuid, status text DEFAULT 'active'::text NOT NULL, application_status text DEFAULT 'pending'::text);

CREATE TABLE public.bundle_features (bundle_id uuid NOT NULL, feature_id uuid NOT NULL);

CREATE TABLE public.cart (quantity integer DEFAULT 1 NOT NULL, product_id uuid NOT NULL, user_id uuid NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.categories (id uuid DEFAULT gen_random_uuid() NOT NULL, updated_at timestamp with time zone DEFAULT now(), description text, name text NOT NULL, created_at timestamp with time zone DEFAULT now());

CREATE TABLE public.courses (delivery_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, ended_at timestamp with time zone, status text DEFAULT 'pending'::text NOT NULL, started_at timestamp with time zone, driver_id uuid, service_id uuid, updated_at timestamp with time zone DEFAULT now() NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL);

CREATE TABLE public.credit_transactions (type text NOT NULL, reference_id uuid, id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, amount numeric NOT NULL, metadata jsonb DEFAULT '{}'::jsonb, created_at timestamp with time zone DEFAULT now(), description text);

CREATE TABLE public.deliveries (date date, created_at timestamp with time zone DEFAULT now() NOT NULL, distance_km numeric, delivery_fee numeric DEFAULT 0 NOT NULL, actual_delivery_time timestamp with time zone, estimated_delivery_time timestamp with time zone, driver_id uuid, merchant_id uuid NOT NULL, customer_id uuid NOT NULL, order_id uuid NOT NULL, customer_phone text NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, delivery_address text NOT NULL, pickup_address text NOT NULL, customer_name text NOT NULL, status text DEFAULT 'pending'::text NOT NULL, notes text, ref text, client text, updated_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.delivery_tracking (latitude numeric, id uuid DEFAULT gen_random_uuid() NOT NULL, delivery_id uuid NOT NULL, longitude numeric, created_at timestamp with time zone DEFAULT now() NOT NULL, status_update text, notes text);

CREATE TABLE public.delivery_zones (max_delivery_time_minutes integer DEFAULT 60 NOT NULL, base_fee numeric DEFAULT 0 NOT NULL, name text NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, is_active boolean DEFAULT true NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, areas text[] NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, price_per_km numeric DEFAULT 0 NOT NULL);

CREATE TABLE public.favorites (id uuid DEFAULT gen_random_uuid() NOT NULL, product_id uuid NOT NULL, user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.feature_usage_quotas (created_at timestamp with time zone DEFAULT now(), reset_at timestamp with time zone, subscription_id uuid NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, quota_used integer DEFAULT 0, quota_limit integer NOT NULL, updated_at timestamp with time zone DEFAULT now(), quota_type text NOT NULL, reset_period text);

CREATE TABLE public.notifications (type text DEFAULT 'system'::text NOT NULL, title text NOT NULL, message text NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid, data jsonb DEFAULT '{}'::jsonb, is_read boolean DEFAULT false, created_at timestamp with time zone DEFAULT now());

CREATE TABLE public.order_items (created_at timestamp with time zone DEFAULT now() NOT NULL, order_id uuid NOT NULL, price numeric NOT NULL, product_id uuid NOT NULL, quantity integer DEFAULT 1 NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL);

CREATE TABLE public.orders (payment_method text, delivery_address text, payment_status text DEFAULT 'pending'::text, delivery_notes text, updated_at timestamp with time zone DEFAULT now() NOT NULL, status text DEFAULT 'pending'::text NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, client_id uuid NOT NULL, merchant_id uuid NOT NULL, delivery_phone text, total_amount numeric DEFAULT 0 NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.platform_settings (updated_at timestamp with time zone DEFAULT now() NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, value jsonb, key text NOT NULL);

CREATE TABLE public.premium_bundles (name text NOT NULL, description text, badge_text text, id uuid DEFAULT gen_random_uuid() NOT NULL, discount_percentage numeric DEFAULT 0, price_monthly numeric NOT NULL, price_yearly numeric, is_active boolean DEFAULT true, trial_days integer DEFAULT 0, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

CREATE TABLE public.premium_features (is_enabled boolean DEFAULT false, configuration jsonb DEFAULT '{}'::jsonb, status text DEFAULT 'disabled'::text, category text NOT NULL, description text, name text NOT NULL, feature_key text NOT NULL, is_free boolean DEFAULT false, trial_days integer DEFAULT 0, expires_at timestamp with time zone, activated_at timestamp with time zone, updated_at timestamp with time zone DEFAULT now(), created_at timestamp with time zone DEFAULT now(), id uuid DEFAULT gen_random_uuid() NOT NULL, is_premium boolean DEFAULT false, price_monthly numeric DEFAULT 0);

CREATE TABLE public.premium_plans (description text, features jsonb DEFAULT '[]'::jsonb, name text NOT NULL, created_at timestamp with time zone DEFAULT now(), target_roles text[], slug text NOT NULL, display_order integer DEFAULT 0, is_active boolean DEFAULT true, id uuid DEFAULT gen_random_uuid() NOT NULL, price_monthly numeric DEFAULT 0, price_yearly numeric DEFAULT 0, badge_text text, badge_color text, updated_at timestamp with time zone DEFAULT now());

CREATE TABLE public.product_reviews (rating integer NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, product_id uuid NOT NULL, user_id uuid NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, comment text);

CREATE TABLE public.products (ai_description boolean DEFAULT false, compare_at_price double precision, cost_price double precision DEFAULT 0, id uuid DEFAULT gen_random_uuid() NOT NULL, sku text, weight numeric, min_stock integer DEFAULT 0, updated_at timestamp with time zone DEFAULT now(), bnpl_enabled boolean DEFAULT false, tags text[], created_at timestamp with time zone DEFAULT now(), category_id uuid, name text NOT NULL, currency text DEFAULT 'XOF'::text, gallery text[] DEFAULT '{}'::text[], video_url text, description text, image_url text, status text DEFAULT 'active'::text NOT NULL, stock integer DEFAULT 0 NOT NULL, price numeric NOT NULL, ai_pricing_strategy text, seo_title text, seo_description text, slug text, merchant_id uuid NOT NULL, brand text, barcode text, unit text DEFAULT 'pi?ce'::text, category text, is_active boolean DEFAULT true, specs jsonb DEFAULT '{}'::jsonb, download_url text, condition text DEFAULT 'new'::text, dimensions text, features text[], images text[], published_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP, min_order_quantity integer DEFAULT 1, wholesale_price double precision, is_digital boolean DEFAULT false);

CREATE TABLE public.profiles (last_name text, id uuid NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), birth_date timestamp with time zone, permissions jsonb DEFAULT '{}'::jsonb, credit_limit numeric DEFAULT 0, current_debt numeric DEFAULT 0, kyc_contract_signed_at timestamp with time zone, first_name text, phone text, role text DEFAULT 'client'::text, business_name text, business_type text, vehicle_type text, zone text, address text, email text, city text, postal_code text, business_address text, business_city text, business_postal_code text, business_tax_id text, kyc_status text DEFAULT 'none'::text, kyc_id_card_url text, kyc_selfie_url text, avatar_url text, status text DEFAULT 'active'::text);

CREATE TABLE public.referrals (created_at timestamp with time zone DEFAULT now(), rewarded_at timestamp with time zone, id uuid DEFAULT gen_random_uuid() NOT NULL, status text DEFAULT 'pending'::text, reward_type text, referred_id uuid NOT NULL, reward_value numeric, referrer_id uuid NOT NULL);

CREATE TABLE public.reviews (user_id uuid, comment text, updated_at timestamp with time zone DEFAULT now(), product_id uuid NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, rating integer NOT NULL, created_at timestamp with time zone DEFAULT now());

CREATE TABLE public.services (updated_at timestamp with time zone DEFAULT now() NOT NULL, is_active boolean DEFAULT true NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, name text NOT NULL, description text, created_at timestamp with time zone DEFAULT now() NOT NULL);

CREATE TABLE public.subscription_audit_log (old_plan_id uuid, user_agent text, transaction_id text, payment_method text, action text NOT NULL, created_at timestamp with time zone DEFAULT now(), ip_address inet, metadata jsonb DEFAULT '{}'::jsonb, amount numeric, new_plan_id uuid, subscription_id uuid, id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid);

CREATE TABLE public.user_ai_settings (updated_at timestamp with time zone DEFAULT now() NOT NULL, feature_key text NOT NULL, is_enabled boolean NOT NULL, user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL);

CREATE TABLE public.user_credits (balance numeric DEFAULT 0, user_id uuid NOT NULL, updated_at timestamp with time zone DEFAULT now(), created_at timestamp with time zone DEFAULT now(), currency text DEFAULT 'FCFA'::text, id uuid DEFAULT gen_random_uuid() NOT NULL);

CREATE TABLE public.user_premium_subscriptions (next_billing_date timestamp with time zone, metadata jsonb DEFAULT '{}'::jsonb, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), user_id uuid NOT NULL, feature_id uuid NOT NULL, status text DEFAULT 'pending_payment'::text NOT NULL, subscribed_at timestamp with time zone DEFAULT now(), activated_at timestamp with time zone, expires_at timestamp with time zone, billing_period text DEFAULT 'monthly'::text, payment_status text DEFAULT 'pending'::text, id uuid DEFAULT gen_random_uuid() NOT NULL, cancelled_at timestamp with time zone, trial_ends_at timestamp with time zone, is_trial boolean DEFAULT false, amount_paid numeric DEFAULT 0, auto_renew boolean DEFAULT true, payment_method text, transaction_id text);

CREATE TABLE public.user_roles (user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, id uuid DEFAULT gen_random_uuid() NOT NULL, role text NOT NULL);

CREATE TABLE public.user_subscriptions (payment_method text, transaction_id text, amount_paid numeric DEFAULT 0, updated_at timestamp with time zone DEFAULT now(), created_at timestamp with time zone DEFAULT now(), id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid NOT NULL, next_billing_date timestamp with time zone, auto_renew boolean DEFAULT true, plan_id uuid NOT NULL, status text DEFAULT 'active'::text NOT NULL, billing_period text DEFAULT 'monthly'::text NOT NULL, cancelled_at timestamp with time zone, expires_at timestamp with time zone, started_at timestamp with time zone DEFAULT now());

-- Primary Keys
ALTER TABLE public._migrations_log ADD CONSTRAINT _migrations_log_pkey PRIMARY KEY (filename);
ALTER TABLE public.ai_chat_logs ADD CONSTRAINT ai_chat_logs_pkey PRIMARY KEY (id);
ALTER TABLE public.ai_feature_profile_settings ADD CONSTRAINT ai_feature_profile_settings_pkey PRIMARY KEY (id);
ALTER TABLE public.ai_module_settings ADD CONSTRAINT ai_module_settings_pkey PRIMARY KEY (id);
ALTER TABLE public.application_messages ADD CONSTRAINT application_messages_pkey PRIMARY KEY (id);
ALTER TABLE public.bnpl_applications ADD CONSTRAINT bnpl_applications_pkey PRIMARY KEY (id);
ALTER TABLE public.bnpl_plans ADD CONSTRAINT bnpl_plans_pkey PRIMARY KEY (id);
ALTER TABLE public.bundle_features ADD CONSTRAINT bundle_features_pkey PRIMARY KEY (bundle_id, feature_id);
ALTER TABLE public.cart ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
ALTER TABLE public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE public.courses ADD CONSTRAINT courses_pkey PRIMARY KEY (id);
ALTER TABLE public.credit_transactions ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);
ALTER TABLE public.deliveries ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);
ALTER TABLE public.delivery_tracking ADD CONSTRAINT delivery_tracking_pkey PRIMARY KEY (id);
ALTER TABLE public.delivery_zones ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);
ALTER TABLE public.favorites ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
ALTER TABLE public.feature_usage_quotas ADD CONSTRAINT feature_usage_quotas_pkey PRIMARY KEY (id);
ALTER TABLE public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
ALTER TABLE public.orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE public.platform_settings ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (key);
ALTER TABLE public.premium_bundles ADD CONSTRAINT premium_bundles_pkey PRIMARY KEY (id);
ALTER TABLE public.premium_features ADD CONSTRAINT premium_features_pkey PRIMARY KEY (id);
ALTER TABLE public.premium_plans ADD CONSTRAINT premium_plans_pkey PRIMARY KEY (id);
ALTER TABLE public.product_reviews ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);
ALTER TABLE public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.referrals ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);
ALTER TABLE public.reviews ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
ALTER TABLE public.services ADD CONSTRAINT services_pkey PRIMARY KEY (id);
ALTER TABLE public.subscription_audit_log ADD CONSTRAINT subscription_audit_log_pkey PRIMARY KEY (id);
ALTER TABLE public.user_ai_settings ADD CONSTRAINT user_ai_settings_pkey PRIMARY KEY (id);
ALTER TABLE public.user_credits ADD CONSTRAINT user_credits_pkey PRIMARY KEY (id);
ALTER TABLE public.user_premium_subscriptions ADD CONSTRAINT user_premium_subscriptions_pkey PRIMARY KEY (id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE public.application_messages ADD CONSTRAINT application_messages_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.bnpl_applications(id) ON DELETE CASCADE;
ALTER TABLE public.bnpl_applications ADD CONSTRAINT bnpl_applications_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.bnpl_applications ADD CONSTRAINT bnpl_applications_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;
ALTER TABLE public.bnpl_plans ADD CONSTRAINT bnpl_plans_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE public.bnpl_plans ADD CONSTRAINT bnpl_plans_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
ALTER TABLE public.bundle_features ADD CONSTRAINT bundle_features_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.premium_features(id) ON DELETE CASCADE;
ALTER TABLE public.bundle_features ADD CONSTRAINT bundle_features_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES public.premium_bundles(id) ON DELETE CASCADE;
ALTER TABLE public.cart ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
ALTER TABLE public.courses ADD CONSTRAINT courses_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.profiles(id);
ALTER TABLE public.courses ADD CONSTRAINT courses_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);
ALTER TABLE public.credit_transactions ADD CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.delivery_tracking ADD CONSTRAINT delivery_tracking_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id);
ALTER TABLE public.favorites ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.feature_usage_quotas ADD CONSTRAINT feature_usage_quotas_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.user_premium_subscriptions(id) ON DELETE CASCADE;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
ALTER TABLE public.products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);
ALTER TABLE public.products ADD CONSTRAINT products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.referrals ADD CONSTRAINT referrals_referred_id_fkey FOREIGN KEY (referred_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.referrals ADD CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.subscription_audit_log ADD CONSTRAINT subscription_audit_log_new_plan_id_fkey FOREIGN KEY (new_plan_id) REFERENCES public.premium_plans(id) ON DELETE SET NULL;
ALTER TABLE public.subscription_audit_log ADD CONSTRAINT subscription_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.subscription_audit_log ADD CONSTRAINT subscription_audit_log_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.user_subscriptions(id) ON DELETE SET NULL;
ALTER TABLE public.subscription_audit_log ADD CONSTRAINT subscription_audit_log_old_plan_id_fkey FOREIGN KEY (old_plan_id) REFERENCES public.premium_plans(id) ON DELETE SET NULL;
ALTER TABLE public.user_ai_settings ADD CONSTRAINT user_ai_feature_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_credits ADD CONSTRAINT user_credits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_premium_subscriptions ADD CONSTRAINT user_premium_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_premium_subscriptions ADD CONSTRAINT user_premium_subscriptions_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.premium_features(id) ON DELETE CASCADE;
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.premium_plans(id) ON DELETE RESTRICT;

-- Indexes
CREATE UNIQUE INDEX ai_feature_profile_settings_profile_type_feature_key_key ON public.ai_feature_profile_settings USING btree (profile_type, feature_key);
CREATE UNIQUE INDEX ai_module_settings_key_key ON public.ai_module_settings USING btree (key);
CREATE INDEX idx_bnpl_applications_merchant_id ON public.bnpl_applications USING btree (merchant_id);
CREATE INDEX idx_bnpl_applications_product_id ON public.bnpl_applications USING btree (product_id);
CREATE INDEX idx_bnpl_applications_status ON public.bnpl_applications USING btree (application_status);
CREATE INDEX idx_bnpl_applications_user_id ON public.bnpl_applications USING btree (user_id);
CREATE UNIQUE INDEX bnpl_plans_user_id_order_id_key ON public.bnpl_plans USING btree (user_id, order_id);
CREATE UNIQUE INDEX cart_user_id_product_id_key ON public.cart USING btree (user_id, product_id);
CREATE INDEX idx_cart_user_id ON public.cart USING btree (user_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions USING btree (type);
CREATE INDEX idx_credit_transactions_user ON public.credit_transactions USING btree (user_id);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions USING btree (user_id);
CREATE UNIQUE INDEX favorites_user_id_product_id_key ON public.favorites USING btree (user_id, product_id);
CREATE INDEX idx_usage_quotas_subscription ON public.feature_usage_quotas USING btree (subscription_id);
CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);
CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);
CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);
CREATE INDEX idx_orders_client_id ON public.orders USING btree (client_id);
CREATE INDEX idx_orders_merchant_id ON public.orders USING btree (merchant_id);
CREATE INDEX idx_orders_status ON public.orders USING btree (status);
CREATE UNIQUE INDEX premium_features_feature_key_key ON public.premium_features USING btree (feature_key);
CREATE UNIQUE INDEX premium_plans_slug_key ON public.premium_plans USING btree (slug);
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews USING btree (product_id);
CREATE UNIQUE INDEX product_reviews_product_id_user_id_idx ON public.product_reviews USING btree (product_id, user_id);
CREATE INDEX idx_products_barcode ON public.products USING btree (barcode);
CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);
CREATE INDEX idx_products_created_at ON public.products USING btree (created_at DESC);
CREATE INDEX idx_products_description_trgm ON public.products USING gin (description gin_trgm_ops);
CREATE INDEX idx_products_is_active ON public.products USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_products_merchant_id ON public.products USING btree (merchant_id);
CREATE INDEX idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_sku ON public.products USING btree (sku);
CREATE INDEX idx_products_slug ON public.products USING btree (slug);
CREATE INDEX idx_products_status ON public.products USING btree (status);
CREATE INDEX idx_products_tags ON public.products USING gin (tags);
CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);
CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);
CREATE INDEX idx_profiles_status ON public.profiles USING btree (status);
CREATE INDEX idx_referrals_referred ON public.referrals USING btree (referred_id);
CREATE INDEX idx_referrals_referrer ON public.referrals USING btree (referrer_id);
CREATE UNIQUE INDEX referrals_referrer_id_referred_id_key ON public.referrals USING btree (referrer_id, referred_id);
CREATE INDEX idx_reviews_product_id ON public.reviews USING btree (product_id);
CREATE INDEX idx_audit_action ON public.subscription_audit_log USING btree (action);
CREATE INDEX idx_audit_created_at ON public.subscription_audit_log USING btree (created_at DESC);
CREATE INDEX idx_audit_user_id ON public.subscription_audit_log USING btree (user_id);
CREATE UNIQUE INDEX user_ai_settings_user_id_feature_key_key ON public.user_ai_settings USING btree (user_id, feature_key);
CREATE INDEX idx_user_credits_user_id ON public.user_credits USING btree (user_id);
CREATE UNIQUE INDEX user_credits_user_id_key ON public.user_credits USING btree (user_id);
CREATE INDEX idx_user_premium_subscriptions_feature_id ON public.user_premium_subscriptions USING btree (feature_id);
CREATE INDEX idx_user_premium_subscriptions_user_id ON public.user_premium_subscriptions USING btree (user_id);
CREATE INDEX idx_user_subscriptions_expires ON public.user_premium_subscriptions USING btree (expires_at);
CREATE INDEX idx_user_subscriptions_status ON public.user_premium_subscriptions USING btree (status);
CREATE INDEX idx_user_subscriptions_user ON public.user_premium_subscriptions USING btree (user_id);
CREATE UNIQUE INDEX user_premium_subscriptions_user_id_feature_id_key ON public.user_premium_subscriptions USING btree (user_id, feature_id);
CREATE UNIQUE INDEX user_roles_user_id_role_idx ON public.user_roles USING btree (user_id, role);
CREATE UNIQUE INDEX idx_one_active_sub_per_user ON public.user_subscriptions USING btree (user_id) WHERE (status = 'active'::text);
CREATE INDEX idx_user_sub_expires ON public.user_subscriptions USING btree (expires_at) WHERE (status = 'active'::text);
CREATE INDEX idx_user_sub_status ON public.user_subscriptions USING btree (status);
CREATE INDEX idx_user_sub_user_id ON public.user_subscriptions USING btree (user_id);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions USING btree (user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.add_user_credits(p_user_id uuid, p_amount numeric, p_type text, p_description text, p_reference_id uuid DEFAULT NULL::uuid) RETURNS boolean AS $$

BEGIN
    -- Ensure user_credits record exists
    INSERT INTO public.user_credits (user_id, balance)
    VALUES (p_user_id, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update balance
    UPDATE public.user_credits
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id);
    
    RETURN TRUE;
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_subscription_expiration() RETURNS trigger AS $$

BEGIN
    IF NEW.expires_at IS NOT NULL AND NOW() > NEW.expires_at THEN
        NEW.status = 'expired';
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_user_id uuid, p_amount numeric, p_description text, p_reference_id uuid DEFAULT NULL::uuid) RETURNS boolean AS $$

DECLARE
    v_balance NUMERIC;
BEGIN
    -- Check balance
    SELECT balance INTO v_balance FROM public.user_credits WHERE user_id = p_user_id;
    
    IF v_balance IS NULL OR v_balance < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct
    UPDATE public.user_credits
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record
    INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (p_user_id, -p_amount, 'debit', p_description, p_reference_id);
    
    RETURN TRUE;
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text) RETURNS void AS $$

BEGIN
    EXECUTE sql_query;
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_latest_delivery_locations(p_delivery_ids uuid[]) RETURNS TABLE(delivery_id uuid, latitude numeric, longitude numeric, created_at timestamp with time zone) AS $$

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

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_user_credit_balance(p_user_id uuid) RETURNS numeric AS $$

DECLARE
    v_balance NUMERIC;
BEGIN
    SELECT COALESCE(balance, 0) INTO v_balance
    FROM public.user_credits
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_balance, 0);
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$

BEGIN
  -- Vérifie si l'utilisateur a le rôle 'admin' dans son profil
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_subscription_action(p_user_id uuid, p_subscription_id uuid, p_action text, p_old_plan_id uuid DEFAULT NULL::uuid, p_new_plan_id uuid DEFAULT NULL::uuid, p_amount numeric DEFAULT NULL::numeric, p_payment_method text DEFAULT NULL::text, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS uuid AS $$

BEGIN
    INSERT INTO public.subscription_audit_log (user_id, subscription_id, action, old_plan_id, new_plan_id, amount, payment_method, metadata)
    VALUES (p_user_id, p_subscription_id, p_action, p_old_plan_id, p_new_plan_id, p_amount, p_payment_method, COALESCE(p_metadata, '{}'::jsonb));
    RETURN gen_random_uuid();
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_feature_status() RETURNS trigger AS $$

BEGIN
    -- If feature is being enabled
    IF NEW.is_enabled = true AND OLD.is_enabled = false THEN
        NEW.activated_at = NOW();
        
        -- If trial_days is set, this is a trial
        IF NEW.trial_days > 0 THEN
            NEW.expires_at = NOW() + (NEW.trial_days || ' days')::interval;
            NEW.status = 'trial';
        ELSE
            NEW.status = 'active';
        END IF;
    END IF;
    
    -- If feature is being disabled
    IF NEW.is_enabled = false AND OLD.is_enabled = true THEN
        NEW.status = 'disabled';
    END IF;
    
    -- Check expiration
    IF NEW.expires_at IS NOT NULL AND NOW() > NEW.expires_at THEN
        NEW.status = 'expired';
        NEW.is_enabled = false;
    END IF;
    
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger AS $$

BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.user_has_feature_access(p_user_id uuid, p_feature_key text) RETURNS boolean AS $$

BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_subscriptions us
        JOIN public.premium_plans pp ON us.plan_id = pp.id
        WHERE us.user_id = p_user_id AND us.status = 'active' AND pp.features ? p_feature_key
    );
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_premium_access(p_user_id uuid, p_feature_key text) RETURNS boolean AS $$

BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_premium_subscriptions ups
        JOIN public.premium_features pf ON ups.feature_id = pf.id
        WHERE ups.user_id = p_user_id
            AND pf.feature_key = p_feature_key
            AND ups.status IN ('active', 'trial')
            AND ups.payment_status = 'paid'
            AND (ups.expires_at IS NULL OR ups.expires_at > NOW())
    );
END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delivery_zones_updated_at BEFORE UPDATE ON public.delivery_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER handle_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON public.premium_bundles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_premium_feature_status BEFORE UPDATE ON public.premium_features FOR EACH ROW EXECUTE FUNCTION public.update_feature_status();
CREATE TRIGGER update_premium_features_updated_at BEFORE UPDATE ON public.premium_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_premium_plans_updated_at BEFORE UPDATE ON public.premium_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER handle_user_ai_settings_updated_at BEFORE UPDATE ON public.user_ai_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER enforce_subscription_expiration BEFORE UPDATE ON public.user_premium_subscriptions FOR EACH ROW EXECUTE FUNCTION public.check_subscription_expiration();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_premium_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for service role" ON public.ai_chat_logs FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own AI logs" ON public.ai_chat_logs FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.ai_feature_profile_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage access for ai_settings" ON public.ai_feature_profile_settings FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Public read access for ai_settings" ON public.ai_feature_profile_settings FOR SELECT TO authenticated USING (true);
ALTER TABLE public.ai_module_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can update AI module settings" ON public.ai_module_settings FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));
CREATE POLICY "Allow authenticated read access to AI module settings" ON public.ai_module_settings FOR SELECT TO authenticated USING (true);
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can insert messages" ON public.application_messages FOR INSERT TO public WITH CHECK ((auth.uid() IN ( SELECT bnpl_applications.user_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id)
UNION
 SELECT bnpl_applications.merchant_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id))));
CREATE POLICY "Participants can update messages" ON public.application_messages FOR UPDATE TO public USING ((auth.uid() IN ( SELECT bnpl_applications.user_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id)
UNION
 SELECT bnpl_applications.merchant_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id))));
CREATE POLICY "Participants can view messages" ON public.application_messages FOR SELECT TO public USING (((auth.uid() IN ( SELECT bnpl_applications.user_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id)
UNION
 SELECT bnpl_applications.merchant_id
   FROM bnpl_applications
  WHERE (bnpl_applications.id = application_messages.application_id))) OR (auth.uid() = sender_id)));
ALTER TABLE public.bnpl_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants can update applications for their products" ON public.bnpl_applications FOR UPDATE TO public USING ((auth.uid() = merchant_id));
CREATE POLICY "Merchants can view applications for their products" ON public.bnpl_applications FOR SELECT TO public USING ((auth.uid() = merchant_id));
CREATE POLICY "Users can create their own BNPL applications" ON public.bnpl_applications FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view their own BNPL applications" ON public.bnpl_applications FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.bnpl_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create their own BNPL plans" ON public.bnpl_plans FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own BNPL plans" ON public.bnpl_plans FOR UPDATE TO public USING ((auth.uid() = user_id));
CREATE POLICY "Users can view their own BNPL plans" ON public.bnpl_plans FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.bundle_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage access for bundle_features" ON public.bundle_features FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Public read access for bundle_features" ON public.bundle_features FOR SELECT TO authenticated USING (true);
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart" ON public.cart FOR ALL TO public USING ((auth.uid() = user_id));
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO public USING (true);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full manage" ON public.courses FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));
CREATE POLICY "Client can read own courses" ON public.courses FOR SELECT TO public USING (((EXISTS ( SELECT 1
   FROM deliveries d
  WHERE ((d.id = courses.delivery_id) AND (d.customer_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))) OR (driver_id = auth.uid())));
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_view_all_transactions ON public.credit_transactions FOR ALL TO public USING (is_admin());
CREATE POLICY user_view_own_transactions ON public.credit_transactions FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all deliveries" ON public.deliveries FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can view all deliveries" ON public.deliveries FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Merchants and drivers can update deliveries" ON public.deliveries FOR UPDATE TO public USING (((auth.uid() = merchant_id) OR (auth.uid() = driver_id)));
CREATE POLICY "Merchants can create deliveries" ON public.deliveries FOR INSERT TO public WITH CHECK ((auth.uid() = merchant_id));
CREATE POLICY "Users can view their own deliveries as customer" ON public.deliveries FOR SELECT TO public USING ((auth.uid() = customer_id));
CREATE POLICY "Users can view their own deliveries as driver" ON public.deliveries FOR SELECT TO public USING ((auth.uid() = driver_id));
CREATE POLICY "Users can view their own deliveries as merchant" ON public.deliveries FOR SELECT TO public USING ((auth.uid() = merchant_id));
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all delivery tracking" ON public.delivery_tracking FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can view all delivery tracking" ON public.delivery_tracking FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Drivers can insert tracking updates" ON public.delivery_tracking FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM deliveries d
  WHERE ((d.id = delivery_tracking.delivery_id) AND (d.driver_id = auth.uid())))));
CREATE POLICY "Users can view tracking for their deliveries" ON public.delivery_tracking FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM deliveries d
  WHERE ((d.id = delivery_tracking.delivery_id) AND ((d.customer_id = auth.uid()) OR (d.merchant_id = auth.uid()) OR (d.driver_id = auth.uid()))))));
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active delivery zones" ON public.delivery_zones FOR SELECT TO public USING ((is_active = true));
CREATE POLICY "Les administrateurs peuvent gérer les zones de livraison" ON public.delivery_zones FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les zones de livrai" ON public.delivery_zones FOR SELECT TO authenticated USING (true);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE TO public USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.feature_usage_quotas ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_view_own_quotas ON public.feature_usage_quotas FOR SELECT TO public USING ((subscription_id IN ( SELECT user_premium_subscriptions.id
   FROM user_premium_subscriptions
  WHERE (user_premium_subscriptions.user_id = auth.uid()))));
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System/Merchant can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING ((auth.uid() = user_id));
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can delete any order items" ON public.order_items FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));
CREATE POLICY "Users can create items for their orders" ON public.order_items FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.client_id = auth.uid())))));
CREATE POLICY "Users can delete their own order items" ON public.order_items FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.client_id = auth.uid())))));
CREATE POLICY "Users can view items of their orders" ON public.order_items FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.client_id = auth.uid())))));
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can delete any order" ON public.orders FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT TO public WITH CHECK ((auth.uid() = client_id));
CREATE POLICY "Users can delete their own orders" ON public.orders FOR DELETE TO authenticated USING ((auth.uid() = client_id));
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE TO public USING ((auth.uid() = client_id));
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO public USING ((auth.uid() = client_id));
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les administrateurs peuvent gérer les paramètres de la platef" ON public.platform_settings FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
ALTER TABLE public.premium_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_manage_bundles ON public.premium_bundles FOR ALL TO public USING (is_admin());
CREATE POLICY bundles_public_read ON public.premium_bundles FOR SELECT TO public USING ((is_active = true));
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage premium features" ON public.premium_features FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Features public reading" ON public.premium_features FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lecture publique des fonctionnalités premium" ON public.premium_features FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view premium features" ON public.premium_features FOR SELECT TO authenticated USING (true);
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des plans" ON public.premium_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Plans public reading" ON public.premium_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY admin_manage_plans ON public.premium_plans FOR ALL TO public USING (is_admin());
CREATE POLICY plans_public_read ON public.premium_plans FOR SELECT TO public USING ((is_active = true));
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all-can-select" ON public.product_reviews FOR SELECT TO public USING (true);
CREATE POLICY "user-can-delete-own-review" ON public.product_reviews FOR DELETE TO public USING ((auth.uid() = user_id));
CREATE POLICY "user-can-insert-own-review" ON public.product_reviews FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "user-can-update-own-review" ON public.product_reviews FOR UPDATE TO public USING ((auth.uid() = user_id));
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO public USING (((status = 'active'::text) OR (merchant_id = auth.uid())));
CREATE POLICY "Enable all for service role" ON public.products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Les administrateurs peuvent gérer les produits" ON public.products FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Les produits sont visibles publiquement" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Merchants can delete own products" ON public.products FOR DELETE TO authenticated USING ((auth.uid() = merchant_id));
CREATE POLICY "Merchants can delete their own products" ON public.products FOR DELETE TO public USING ((merchant_id = auth.uid()));
CREATE POLICY "Merchants can insert own products" ON public.products FOR INSERT TO authenticated WITH CHECK ((auth.uid() = merchant_id));
CREATE POLICY "Merchants can insert their own products" ON public.products FOR INSERT TO public WITH CHECK ((merchant_id = auth.uid()));
CREATE POLICY "Merchants can update own products" ON public.products FOR UPDATE TO authenticated USING ((auth.uid() = merchant_id)) WITH CHECK ((auth.uid() = merchant_id));
CREATE POLICY "Merchants can update their own products" ON public.products FOR UPDATE TO public USING ((merchant_id = auth.uid()));
CREATE POLICY "Merchants can view own products" ON public.products FOR SELECT TO authenticated USING ((auth.uid() = merchant_id));
CREATE POLICY "Merchants manage own products" ON public.products FOR ALL TO public USING ((auth.uid() = merchant_id)) WITH CHECK ((auth.uid() = merchant_id));
CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO public USING (((is_active = true) OR (is_active IS NULL)));
CREATE POLICY "Public products read" ON public.products FOR SELECT TO public USING (true);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can update user status" ON public.profiles FOR UPDATE TO public USING ((( SELECT user_roles.role
   FROM user_roles
  WHERE (user_roles.user_id = auth.uid())
 LIMIT 1) = 'admin'::text)) WITH CHECK ((( SELECT user_roles.role
   FROM user_roles
  WHERE (user_roles.user_id = auth.uid())
 LIMIT 1) = 'admin'::text));
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT TO public USING (true);
CREATE POLICY "Allow users to insert their own profile" ON public.profiles FOR INSERT TO public WITH CHECK ((auth.uid() = id));
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE TO public USING ((auth.uid() = id));
CREATE POLICY "Enable all for service role" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));
CREATE POLICY "Les administrateurs peuvent gérer tous les profils" ON public.profiles FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles FOR UPDATE TO public USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles FOR SELECT TO public USING ((auth.uid() = id));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO public WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));
CREATE POLICY admin_all ON public.profiles FOR ALL TO authenticated USING (is_admin());
CREATE POLICY user_update_self ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));
CREATE POLICY user_view_self ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_view_referrals ON public.referrals FOR SELECT TO public USING (((auth.uid() = referrer_id) OR (auth.uid() = referred_id)));
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE TO public USING ((auth.uid() = user_id));
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin manage" ON public.services FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));
CREATE POLICY "Allow read to all" ON public.services FOR SELECT TO public USING (true);
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_view_all_audit_logs ON public.subscription_audit_log FOR SELECT TO public USING (is_admin());
CREATE POLICY user_view_own_audit_log ON public.subscription_audit_log FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.user_ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all user AI feature settings" ON public.user_ai_settings FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can read their own AI feature settings" ON public.user_ai_settings FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_view_all_credits ON public.user_credits FOR ALL TO public USING (is_admin());
CREATE POLICY user_view_own_credits ON public.user_credits FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.user_premium_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les utilisateurs peuvent insérer leurs propres modules" ON public.user_premium_subscriptions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Les utilisateurs voient leurs propres modules" ON public.user_premium_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users view own modules" ON public.user_premium_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY admin_view_all_subscriptions ON public.user_premium_subscriptions FOR ALL TO public USING (is_admin());
CREATE POLICY user_manage_own_subscriptions ON public.user_premium_subscriptions FOR ALL TO public USING ((auth.uid() = user_id));
CREATE POLICY user_view_own_subscriptions ON public.user_premium_subscriptions FOR SELECT TO public USING ((auth.uid() = user_id));
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can delete user roles" ON public.user_roles FOR DELETE TO public USING (is_admin());
CREATE POLICY "Admins can insert user roles" ON public.user_roles FOR INSERT TO public WITH CHECK (is_admin());
CREATE POLICY "Admins can read all user roles" ON public.user_roles FOR SELECT TO public USING (is_admin());
CREATE POLICY "Admins can update user roles" ON public.user_roles FOR UPDATE TO public USING (is_admin());
CREATE POLICY "Allow authenticated users to manage their roles" ON public.user_roles FOR ALL TO public USING ((auth.uid() = user_id));
CREATE POLICY "Allow public read access to roles" ON public.user_roles FOR SELECT TO public USING (true);
CREATE POLICY "Les administrateurs peuvent lire tous les roles" ON public.user_roles FOR SELECT TO public USING (is_admin());
CREATE POLICY "Un utilisateur peut insérer ses rôles" ON public.user_roles FOR INSERT TO public WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Un utilisateur peut lire ses rôles" ON public.user_roles FOR SELECT TO public USING ((user_id = auth.uid()));
CREATE POLICY "Un utilisateur peut mettre à jour ses rôles" ON public.user_roles FOR UPDATE TO public USING ((user_id = auth.uid()));
CREATE POLICY "Un utilisateur peut supprimer ses rôles" ON public.user_roles FOR DELETE TO public USING ((user_id = auth.uid()));
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les utilisateurs voient leur propre abonnement" ON public.user_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update own subscription" ON public.user_subscriptions FOR UPDATE TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY "Users view own subscription" ON public.user_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));
CREATE POLICY admin_manage_subscriptions ON public.user_subscriptions FOR ALL TO authenticated USING (is_admin());
CREATE POLICY admin_view_all_subscriptions ON public.user_subscriptions FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY user_view_own_subscription ON public.user_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));

COMMIT;
