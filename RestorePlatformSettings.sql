
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage platform settings" ON public.platform_settings 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can read platform settings" ON public.platform_settings 
FOR SELECT USING (true);

-- Insert Default Settings
INSERT INTO public.platform_settings (key, value) VALUES 
('general', '{"siteName": "Yoombal", "contactEmail": "contact@yoombal.com"}'::jsonb),
('dashboard', '{"showUserCount": true, "showProductCount": true, "showOrderCount": true, "showTotalRevenue": true}'::jsonb),
('public_stats', '{"showPublicStats": true, "showUserCount": true, "showMerchantCount": true, "showDeliveryCount": true}'::jsonb),
('merchant_page', '{"showStats": true, "satisfactionRate": 98}'::jsonb)
ON CONFLICT (key) DO NOTHING;
