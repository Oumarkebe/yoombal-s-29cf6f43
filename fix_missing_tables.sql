
-- 1. Create PUBLIC.CART table
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- REMOVED
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, 
    -- Let's assume user_id links to auth.users usually, but here we likely map to profiles/users
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart" ON public.cart
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" ON public.cart
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.cart
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" ON public.cart
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);


-- 2. Create AI_MODULE_SETTINGS table (Global Config for Admin)
CREATE TABLE IF NOT EXISTS public.ai_module_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_module_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled AI settings" ON public.ai_module_settings
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Admins can manage AI settings" ON public.ai_module_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (ELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
    
-- Insert Defaults if empty
INSERT INTO public.ai_module_settings (key, is_enabled, configuration)
VALUES 
    ('chatbot', true, '{"provider": "openai", "model": "gpt-4o-mini"}'),
    ('visual_search', true, '{"provider": "openai"}'),
    ('dynamic_pricing', true, '{"algorithm": "v1"}')
ON CONFLICT (key) DO NOTHING;


-- 3. Create USER_AI_FEATURE_SETTINGS table (User Preferences)
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

ALTER TABLE public.user_ai_feature_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI settings" ON public.user_ai_feature_settings
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

-- 4. Fix Process Subscription Permissions (ensure function can run)
-- Grant usage on schemas/tables to service_role (usually done by default but good to ensure)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

