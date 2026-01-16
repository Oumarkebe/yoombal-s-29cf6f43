-- Make AI features free for all users locally
UPDATE premium_features 
SET is_free = true, is_enabled = true 
WHERE feature_key IN ('ai_assistant', 'assistant_intelligent', 'generation_contenu');
