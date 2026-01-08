
-- Table to store AI feature overrides for specific users/merchants
CREATE TABLE public.user_ai_feature_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL CHECK (feature_key IN ('content_generation', 'pricing', 'predictions')),
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, feature_key)
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.user_ai_feature_settings IS 'Stores user-specific overrides for AI feature enablement.';
COMMENT ON COLUMN public.user_ai_feature_settings.user_id IS 'References the user profile.';
COMMENT ON COLUMN public.user_ai_feature_settings.feature_key IS 'The key of the AI feature (e.g., content_generation).';
COMMENT ON COLUMN public.user_ai_feature_settings.is_enabled IS 'Whether the feature is enabled or disabled for this user.';

-- Enable Row-Level Security
ALTER TABLE public.user_ai_feature_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all settings
CREATE POLICY "Admins can manage all user AI feature settings"
ON public.user_ai_feature_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Users can read their own settings
CREATE POLICY "Users can read their own AI feature settings"
ON public.user_ai_feature_settings
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER handle_user_ai_settings_updated_at
BEFORE UPDATE ON public.user_ai_feature_settings
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();
