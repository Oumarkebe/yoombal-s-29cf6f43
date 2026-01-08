
-- Add a 'configuration' column to store provider choice for AI modules
ALTER TABLE public.ai_module_settings
ADD COLUMN configuration JSONB DEFAULT '{}'::jsonb;

-- Set the default provider for the existing chatbot module to 'openai'
UPDATE public.ai_module_settings
SET configuration = '{"provider": "openai"}'
WHERE key = 'chatbot';
