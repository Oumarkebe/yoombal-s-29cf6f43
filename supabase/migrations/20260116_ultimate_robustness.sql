-- ============================================================================
-- MIGRATION: ULTIMATE ROBUSTNESS & ECOSYSTEM SYNC
-- Objects: Correcting BNPL naming, extending Products, fixing Notifications
-- ============================================================================

-- 1. BNPL Plans cleanup
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bnpl_plans' AND column_name = 'user_id') THEN
        ALTER TABLE bnpl_plans RENAME COLUMN user_id TO client_id;
    END IF;
END $$;

-- 2. Products Table Extension (The "Ultimate" Product)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'piece',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XOF',
ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS dimensions JSONB,
ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS ai_description BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_pricing_strategy TEXT,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC,
ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Unique constraints for slug and sku
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products(sku) WHERE sku IS NOT NULL;

-- 3. AI Chat Logs (Analytics IA) - Ensure it exists
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message_content TEXT,
  intention TEXT,
  tone_used TEXT,
  action_detected TEXT,
  commercial_success BOOLEAN DEFAULT false,
  tone_consistency TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- Policy for Admin view
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_chat_logs' AND policyname = 'Admins can view all logs') THEN
        CREATE POLICY "Admins can view all logs"
        ON ai_chat_logs FOR SELECT USING (true); -- Simplified for local, would check roles in prod
    END IF;
END $$;

-- 4. Realtime for Notifications (Make sure it's enabled)
DO $$ 
BEGIN
    -- This depends on the publication existing. Standard Supabase image has 'supabase_realtime'.
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Check if it's already in the publication to avoid error
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
        END IF;
    END IF;
END $$;

-- 5. Notification Trigger for BNPL Messages
CREATE OR REPLACE FUNCTION notify_bnpl_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Identifier le destinataire
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT 
    CASE WHEN NEW.sender_id = bp.client_id THEN p.merchant_id ELSE bp.client_id END,
    'chat',
    'Nouveau message BNPL 💬',
    LEFT(NEW.content, 100),
    jsonb_build_object('application_id', NEW.application_id, 'message_id', NEW.id)
  FROM bnpl_plans bp
  JOIN products p ON bp.product_id = p.id
  WHERE bp.id = NEW.application_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_bnpl_message_notification ON application_messages;
CREATE TRIGGER trigger_bnpl_message_notification
AFTER INSERT ON application_messages
FOR EACH ROW EXECUTE FUNCTION notify_bnpl_message();
