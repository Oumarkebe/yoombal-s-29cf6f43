import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

async function fetchChatbotStatus() {
  const { data, error } = await supabase
    .from('ai_module_settings')
    .select('is_enabled')
    .eq('key', 'chatbot')
    .single();

  if (error) {
    console.error('Error fetching chatbot status:', error);
    // Defaults to disabled if there's an error, so we don't show it by mistake.
    return false;
  }

  return data?.is_enabled ?? false;
}

export function useChatbotStatus() {
  return useQuery({
    queryKey: ['chatbotStatus'],
    queryFn: fetchChatbotStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
