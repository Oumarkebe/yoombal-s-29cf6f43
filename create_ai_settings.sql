
-- Create user_ai_feature_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_ai_feature_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL REFERENCES public.premium_features(feature_key) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT TRUE,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, feature_key)
);

-- Enable RLS
ALTER TABLE public.user_ai_feature_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings" ON public.user_ai_feature_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_ai_feature_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own settings" ON public.user_ai_feature_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_ai_feature_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can view/edit all
CREATE POLICY "Admins can do everything on ai settings" ON public.user_ai_feature_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Grant permissions
GRANT ALL ON public.user_ai_feature_settings TO anon, authenticated, service_role;
