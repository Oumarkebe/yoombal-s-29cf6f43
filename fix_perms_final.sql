
-- Grant permissions for ai_chat_sessions
GRANT ALL ON public.ai_chat_sessions TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.ai_chat_logs TO postgres, anon, authenticated, service_role;

-- Grant permissions for other tables if needed
GRANT ALL ON public.user_ai_feature_settings TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.bnpl_plans TO postgres, anon, authenticated, service_role;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
