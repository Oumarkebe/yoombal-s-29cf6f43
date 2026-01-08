-- Table categories
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Table deliveries
CREATE TABLE deliveries (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_fee NUMERIC,
  distance_km NUMERIC,
  status TEXT,
  date TIMESTAMPTZ,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  driver_id UUID,
  client TEXT,
  ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Table delivery_tracking
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY,
  delivery_id UUID NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  status_update TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);

-- Table delivery_zones
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  areas TEXT[],
  base_fee NUMERIC,
  price_per_km NUMERIC,
  max_delivery_time_minutes INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Table products
CREATE TABLE products (
  id UUID PRIMARY KEY,
  merchant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  status TEXT,
  image_url TEXT,
  category_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT,
  business_name TEXT,
  business_type TEXT,
  vehicle_type TEXT,
  zone TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Table users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Table favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

-- Table order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table bnpl_plans
CREATE TABLE bnpl_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  duration_months INTEGER NOT NULL,
  remaining_months INTEGER NOT NULL,
  next_payment_date TIMESTAMPTZ NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);