-- Migration: Create stock_alerts table
-- Created: 2026-01-19

-- Table for users who want to be notified when product is back in stock
DROP TABLE IF EXISTS public.stock_alerts CASCADE;
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  notified_at timestamptz
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_notified ON stock_alerts(notified) WHERE notified = false;

-- RLS Policies
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create stock alerts
DROP POLICY IF EXISTS "Anyone can create stock alerts" ON stock_alerts;
CREATE POLICY "Anyone can create stock alerts"
  ON stock_alerts FOR INSERT
  WITH CHECK (true);

-- Users can view their own alerts
DROP POLICY IF EXISTS "Users can view own stock alerts" ON stock_alerts;
CREATE POLICY "Users can view own stock alerts"
  ON stock_alerts FOR SELECT
  USING (user_email = auth.jwt() ->> 'email');

-- Admin can view all alerts
DROP POLICY IF EXISTS "Admin can view all stock alerts" ON stock_alerts;
CREATE POLICY "Admin can view all stock alerts"
  ON stock_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comment
COMMENT ON TABLE stock_alerts IS 'Stores user requests to be notified when out-of-stock products become available';
