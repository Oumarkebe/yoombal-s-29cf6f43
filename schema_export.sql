-- Supabase Schema Export - Generated 2026-01-16T16:59:55.879Z

CREATE TABLE _migrations_log (
  filename text NOT NULL,
  applied_at timestamp with time zone
);

CREATE TABLE admin_orders_view (
  created_at timestamp with time zone,
  merchant_id uuid,
  items_count bigint,
  id uuid,
  payment_method text,
  updated_at timestamp with time zone,
  merchant_business_name text,
  merchant_last_name text,
  merchant_first_name text,
  merchant_email text,
  client_phone text,
  client_last_name text,
  client_first_name text,
  client_email text,
  delivery_notes text,
  delivery_phone text,
  delivery_address text,
  status text,
  client_id uuid,
  total_amount numeric,
  payment_status text
);

CREATE TABLE ai_chat_logs (
  session_id text,
  message_content text NOT NULL,
  tone_consistency text,
  created_at timestamp with time zone NOT NULL,
  user_id uuid,
  commercial_success boolean,
  raw_response jsonb,
  id uuid NOT NULL,
  action_detected text,
  tone_used text,
  intention text
);

CREATE TABLE ai_feature_profile_settings (
  updated_at timestamp with time zone NOT NULL,
  profile_type text NOT NULL,
  id uuid NOT NULL,
  is_enabled boolean NOT NULL,
  feature_key text NOT NULL,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE ai_module_settings (
  key text NOT NULL,
  id uuid NOT NULL,
  is_enabled boolean NOT NULL,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  configuration jsonb
);

CREATE TABLE application_messages (
  attachment_url text,
  message_type text,
  content text NOT NULL,
  created_at timestamp with time zone,
  read_at timestamp with time zone,
  is_read boolean,
  is_system_message boolean,
  sender_id uuid,
  application_id uuid,
  id uuid NOT NULL
);

CREATE TABLE bnpl_applications (
  application_status text NOT NULL,
  applicant_id_number text,
  id_card_url text,
  photo_url text,
  applicant_phone text,
  first_payment_amount numeric NOT NULL,
  order_id uuid,
  contract_signed_at timestamp with time zone,
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  merchant_id uuid NOT NULL,
  requested_amount numeric NOT NULL,
  plan_duration integer NOT NULL,
  monthly_payment numeric NOT NULL,
  fees_amount numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  merchant_decision text,
  created_at timestamp with time zone NOT NULL,
  merchant_decision_date timestamp with time zone
);

CREATE TABLE bnpl_plans (
  status text NOT NULL,
  application_status text,
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  order_id uuid NOT NULL,
  total_amount numeric NOT NULL,
  monthly_payment numeric NOT NULL,
  remaining_months integer NOT NULL,
  next_payment_date date,
  created_at timestamp with time zone NOT NULL,
  plan_duration integer,
  fees_amount numeric,
  first_payment_amount numeric,
  installments jsonb,
  merchant_id uuid,
  product_id uuid
);

CREATE TABLE bundle_features (
  bundle_id uuid NOT NULL,
  feature_id uuid NOT NULL
);

CREATE TABLE cart (
  user_id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL,
  quantity integer NOT NULL,
  product_id uuid NOT NULL,
  id uuid NOT NULL
);

CREATE TABLE categories (
  id uuid NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  description text,
  name text NOT NULL
);

CREATE TABLE courses (
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  status text NOT NULL,
  id uuid NOT NULL,
  delivery_id uuid NOT NULL,
  service_id uuid,
  driver_id uuid,
  started_at timestamp with time zone,
  ended_at timestamp with time zone
);

CREATE TABLE credit_transactions (
  type text NOT NULL,
  metadata jsonb,
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  reference_id uuid,
  created_at timestamp with time zone,
  description text
);

CREATE TABLE deliveries (
  actual_delivery_time timestamp with time zone,
  estimated_delivery_time timestamp with time zone,
  driver_id uuid,
  merchant_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  order_id uuid NOT NULL,
  delivery_address text NOT NULL,
  customer_phone text NOT NULL,
  customer_name text NOT NULL,
  status text NOT NULL,
  pickup_address text NOT NULL,
  notes text,
  date date,
  ref text,
  updated_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL,
  distance_km numeric,
  delivery_fee numeric NOT NULL,
  id uuid NOT NULL,
  client text
);

CREATE TABLE delivery_tracking (
  latitude numeric,
  id uuid NOT NULL,
  delivery_id uuid NOT NULL,
  longitude numeric,
  created_at timestamp with time zone NOT NULL,
  status_update text,
  notes text
);

CREATE TABLE delivery_zones (
  created_at timestamp with time zone NOT NULL,
  name text NOT NULL,
  max_delivery_time_minutes integer NOT NULL,
  areas ARRAY NOT NULL,
  is_active boolean NOT NULL,
  base_fee numeric NOT NULL,
  price_per_km numeric NOT NULL,
  id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL
);

CREATE TABLE favorites (
  user_id uuid NOT NULL,
  id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE feature_usage_quotas (
  reset_period text,
  updated_at timestamp with time zone,
  quota_type text NOT NULL,
  quota_used integer,
  reset_at timestamp with time zone,
  created_at timestamp with time zone,
  subscription_id uuid NOT NULL,
  id uuid NOT NULL,
  quota_limit integer NOT NULL
);

CREATE TABLE notifications (
  id uuid NOT NULL,
  created_at timestamp with time zone,
  type text NOT NULL,
  title text NOT NULL,
  user_id uuid,
  message text NOT NULL,
  is_read boolean,
  data jsonb
);

CREATE TABLE order_items (
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE orders (
  payment_method text,
  total_amount numeric NOT NULL,
  created_at timestamp with time zone NOT NULL,
  merchant_id uuid NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  client_id uuid NOT NULL,
  id uuid NOT NULL,
  status text NOT NULL,
  payment_status text,
  delivery_notes text,
  delivery_address text,
  delivery_phone text
);

CREATE TABLE platform_settings (
  updated_at timestamp with time zone NOT NULL,
  key text NOT NULL,
  value jsonb,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE premium_bundles (
  name text NOT NULL,
  description text,
  badge_text text,
  id uuid NOT NULL,
  discount_percentage numeric,
  price_monthly numeric NOT NULL,
  price_yearly numeric,
  is_active boolean,
  trial_days integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE premium_features (
  price_monthly numeric,
  configuration jsonb,
  status text,
  category text NOT NULL,
  description text,
  name text NOT NULL,
  feature_key text NOT NULL,
  is_free boolean,
  trial_days integer,
  expires_at timestamp with time zone,
  activated_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_at timestamp with time zone,
  id uuid NOT NULL,
  is_premium boolean,
  is_enabled boolean
);

CREATE TABLE premium_plans (
  badge_text text,
  badge_color text,
  created_at timestamp with time zone,
  display_order integer,
  description text,
  slug text NOT NULL,
  is_active boolean,
  id uuid NOT NULL,
  price_monthly numeric,
  price_yearly numeric,
  name text NOT NULL,
  target_roles ARRAY,
  features jsonb,
  updated_at timestamp with time zone
);

CREATE TABLE product_reviews (
  rating integer NOT NULL,
  created_at timestamp with time zone NOT NULL,
  product_id uuid NOT NULL,
  user_id uuid NOT NULL,
  id uuid NOT NULL,
  comment text
);

CREATE TABLE products (
  bnpl_enabled boolean,
  is_active boolean,
  specs jsonb,
  id uuid NOT NULL,
  sku text,
  min_stock integer,
  weight numeric,
  tags ARRAY,
  barcode text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone,
  category_id uuid,
  name text NOT NULL,
  currency text,
  gallery ARRAY,
  video_url text,
  description text,
  image_url text,
  status text NOT NULL,
  stock integer NOT NULL,
  price numeric NOT NULL,
  ai_pricing_strategy text,
  seo_title text,
  seo_description text,
  slug text,
  merchant_id uuid NOT NULL,
  brand text,
  unit text,
  ai_description boolean,
  category text,
  compare_at_price double precision,
  cost_price double precision,
  download_url text,
  condition text,
  dimensions text,
  features ARRAY,
  images ARRAY,
  published_at timestamp with time zone,
  min_order_quantity integer,
  wholesale_price double precision,
  is_digital boolean
);

CREATE TABLE profiles (
  last_name text,
  id uuid NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  birth_date timestamp with time zone,
  permissions jsonb,
  credit_limit numeric,
  current_debt numeric,
  kyc_contract_signed_at timestamp with time zone,
  first_name text,
  phone text,
  role text,
  business_name text,
  business_type text,
  vehicle_type text,
  zone text,
  address text,
  email text,
  city text,
  postal_code text,
  business_address text,
  business_city text,
  business_postal_code text,
  business_tax_id text,
  kyc_status text,
  kyc_id_card_url text,
  kyc_selfie_url text,
  avatar_url text,
  status text
);

CREATE TABLE referrals (
  created_at timestamp with time zone,
  id uuid NOT NULL,
  status text,
  rewarded_at timestamp with time zone,
  reward_type text,
  referred_id uuid NOT NULL,
  reward_value numeric,
  referrer_id uuid NOT NULL
);

CREATE TABLE reviews (
  user_id uuid,
  comment text,
  updated_at timestamp with time zone,
  rating integer NOT NULL,
  created_at timestamp with time zone,
  product_id uuid NOT NULL,
  id uuid NOT NULL
);

CREATE TABLE services (
  updated_at timestamp with time zone NOT NULL,
  is_active boolean NOT NULL,
  id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE subscription_audit_log (
  old_plan_id uuid,
  user_agent text,
  transaction_id text,
  payment_method text,
  action text NOT NULL,
  created_at timestamp with time zone,
  ip_address inet,
  metadata jsonb,
  amount numeric,
  new_plan_id uuid,
  subscription_id uuid,
  id uuid NOT NULL,
  user_id uuid
);

CREATE TABLE user_ai_settings (
  updated_at timestamp with time zone NOT NULL,
  feature_key text NOT NULL,
  is_enabled boolean NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL,
  id uuid NOT NULL
);

CREATE TABLE user_credits (
  balance numeric,
  user_id uuid NOT NULL,
  updated_at timestamp with time zone,
  created_at timestamp with time zone,
  currency text,
  id uuid NOT NULL
);

CREATE TABLE user_premium_subscriptions (
  status text NOT NULL,
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  feature_id uuid NOT NULL,
  subscribed_at timestamp with time zone,
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  trial_ends_at timestamp with time zone,
  is_trial boolean,
  amount_paid numeric,
  auto_renew boolean,
  next_billing_date timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  transaction_id text,
  payment_method text,
  payment_status text,
  billing_period text
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL,
  id uuid NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone NOT NULL
);

CREATE TABLE user_subscriptions (
  transaction_id text,
  payment_method text,
  user_id uuid NOT NULL,
  auto_renew boolean,
  amount_paid numeric,
  cancelled_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_at timestamp with time zone,
  plan_id uuid NOT NULL,
  started_at timestamp with time zone,
  next_billing_date timestamp with time zone,
  status text NOT NULL,
  expires_at timestamp with time zone,
  id uuid NOT NULL,
  billing_period text NOT NULL
);

