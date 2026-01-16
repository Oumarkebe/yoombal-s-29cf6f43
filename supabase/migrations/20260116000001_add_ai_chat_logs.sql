-- Create table for AI Assistant Analytic Logs
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id),
    message_content TEXT NOT NULL,
    intention TEXT,
    tone_used TEXT,
    action_detected TEXT,
    commercial_success BOOLEAN DEFAULT false,
    tone_consistency TEXT,
    raw_response JSONB
);

-- Enable RLS
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- Allow service_role to do everything
CREATE POLICY "Enable all for service role" ON public.ai_chat_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow users to see their own logs (optional, for transparency or debug)
CREATE POLICY "Users can view own AI logs" ON public.ai_chat_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Help for the dashboard
COMMENT ON TABLE public.ai_chat_logs IS 'Logs les interactions de l''Assistant IA pour l''analyse commerciale.';
