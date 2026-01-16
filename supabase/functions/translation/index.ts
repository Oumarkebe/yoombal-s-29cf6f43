import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase URL or Service Role Key');
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('ai_module_settings')
      .select('is_enabled, configuration')
      .eq('key', 'translation')
      .maybeSingle();

    if (settingsError) {
      console.error('Error fetching translation settings:', settingsError.message);
      return new Response(JSON.stringify({ error: 'Database error when fetching settings.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!settings || !settings.is_enabled) {
      return new Response(JSON.stringify({ error: 'Le module de traduction est actuellement désactivé.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, source_language = 'auto', target_language } = await req.json();

    if (!text || !target_language) {
      return new Response(JSON.stringify({ error: 'Missing `text` or `target_language` in request body' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: apiKeysSettings } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'ai_keys')
      .maybeSingle();

    const dbApiKeys = (apiKeysSettings?.value as { openaiApiKey?: string; groqApiKey?: string; perplexityApiKey?: string; mistralApiKey?: string; togetherApiKey?: string; }) || {};

    const providerConfigs = [
      { name: 'openai', model: 'gpt-4o-mini', url: 'https://api.openai.com/v1/chat/completions', apiKey: dbApiKeys.openaiApiKey || Deno.env.get('OPENAI_API_KEY') },
      { name: 'groq', model: 'llama3-8b-8192', url: 'https://api.groq.com/openai/v1/chat/completions', apiKey: dbApiKeys.groqApiKey || Deno.env.get('GROQ_API_KEY') },
      { name: 'perplexity', model: 'llama-3.1-sonar-small-128k-online', url: 'https://api.perplexity.ai/chat/completions', apiKey: dbApiKeys.perplexityApiKey || Deno.env.get('PERPLEXITY_API_KEY') },
      { name: 'mistral', model: 'open-mistral-7b', url: 'https://api.mistral.ai/v1/chat/completions', apiKey: dbApiKeys.mistralApiKey || Deno.env.get('MISTRAL_API_KEY') },
      { name: 'together', model: 'meta-llama/Llama-3-8B-chat-hf', url: 'https://api.together.xyz/v1/chat/completions', apiKey: dbApiKeys.togetherApiKey || Deno.env.get('TOGETHER_API_KEY') },
    ];

    const preferredProvider = settings.configuration?.provider || 'openai';

    const availableProviders = providerConfigs.filter(p => p.apiKey);

    if (availableProviders.length === 0) {
      console.error('No AI provider API key is configured.');
      const userMessage = "Aucun fournisseur d'IA n'est configuré. Veuillez ajouter au moins une clé API dans les paramètres d'administration.";
      return new Response(JSON.stringify({ error: userMessage }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sort to try preferred provider first
    availableProviders.sort((a, b) => {
      if (a.name === preferredProvider) return -1;
      if (b.name === preferredProvider) return 1;
      return 0;
    });

    const systemPrompt = `Translate the following text from ${source_language} to ${target_language}. Respond ONLY with the translated text, without any introductory phrases, explanations, or quotation marks.`;
    let lastError = null;

    for (const provider of availableProviders) {
      console.log(`Attempting translation with ${provider.name}...`);
      try {
        const response = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            max_tokens: 1024,
            temperature: 0.1,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`API error from ${provider.name}: ${response.status} ${response.statusText}. Details: ${errorBody}`);
        }

        const completion = await response.json();

        const translatedText = completion?.choices?.[0]?.message?.content?.trim();

        if (translatedText) {
          console.log(`Translation successful with ${provider.name}!`);
          return new Response(JSON.stringify({ translated_text: translatedText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error(`Invalid completion response structure from ${provider.name}.`);
        }
      } catch (error) {
        console.error(`Translation with ${provider.name} failed:`, error.message);
        lastError = `Échec avec ${provider.name}.`;
        // Continue to the next provider
      }
    }

    // If all providers failed
    console.error('All translation providers failed.', lastError);
    return new Response(JSON.stringify({ error: `Tous les fournisseurs de traduction ont échoué. ${lastError || ''}` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Critical error in translation function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
