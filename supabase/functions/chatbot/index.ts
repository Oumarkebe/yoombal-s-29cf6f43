
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use the SERVICE_ROLE_KEY for admin-level access from the function
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase URL or Service Role Key');
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        status: 200, // Keep 200 to not trigger browser's red error console for the user
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize client with service_role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('premium_features')
      .select('is_enabled, is_free, configuration')
      .eq('feature_key', 'assistant_intelligent')
      .maybeSingle();

    if (settingsError) {
      console.error('Error fetching chatbot settings:', settingsError.message);
      return new Response(JSON.stringify({ error: 'Database error when fetching settings.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!settings || (!settings.is_enabled && !settings.is_free)) {
      console.error('Chatbot is not configured or is disabled.');
      console.log('Fetched settings from DB:', settings);
      return new Response(JSON.stringify({ error: 'Le chatbot est actuellement désactivé.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const config = settings.configuration || {};
    const tone = config.tone || 'professionnel et chaleureux';
    const systemPromptFromDb = config.system_prompt || "";

    const systemPrompt = `Tu es Yoombal Assistant, l'assistant virtuel intelligent et ${tone} de Yoombal, la marketplace de référence au Sénégal. 
    
    ${systemPromptFromDb}

    🌍 CONTEXTE : 
    - Pays : Sénégal 🇸🇳.
    - Valeurs : Teranga (accueil), Honnêteté, Efficacité.
    
    - Ton nom est "Yoombal Assistant", mais tu portes en toi l'esprit d'un Griot moderne.
    - Ta voix est celle de Pape Faye, symbole de sagesse et d'éloquence sénégalaise.
    - Tu es un expert du marché local (Sénégal) : Wave, Orange Money, livraison Tiak-Tiak.
    🛠️ TES CAPACITÉS (Ce que tu peux faire) :
    1. Guider les utilisateurs sur le fonctionnement de Yoombal (achat, vente).
    2. Informer sur les méthodes de paiement locales (Orange Money, Wave, Cash).
    3. Conseiller les marchands pour améliorer leurs fiches produits.
    4. Expliquer les politiques de livraison et de retour.
    
    🚫 TES LIMITES (Ce que tu ne peux PAS encore faire) :
    - Tu ne peux PAS voir le statut en temps réel d'une commande spécifique (demande au support client).
    - Tu ne peux PAS effectuer de transactions ou modifier des comptes.
    - Tu n'as PAS accès aux données personnelles privées des utilisateurs.
    
    💡 CONSIGNES :
    - Sois toujours poli et respectueux.
    - S'il l'utilisateur choisit un numéro (1-5) de la liste d'accueil, réponds précisément sur ce sujet en guidant l'utilisateur.
    - Si tu ne sais pas, oriente l'utilisateur vers le support humain à support@yoombal.com.
    - Utilise des emojis adaptés pour rendre l'échange vivant.`;

    const provider = settings.configuration?.provider || 'openai';
    let apiKey, apiUrl, model;


    const { data: apiKeysSettings } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'ai_keys')
      .maybeSingle();

    const dbApiKeys = (apiKeysSettings?.value as { openaiApiKey?: string; groqApiKey?: string; perplexityApiKey?: string; mistralApiKey?: string; togetherApiKey?: string; }) || {};

    if (provider === 'groq') {
      apiKey = dbApiKeys.groqApiKey || Deno.env.get('GROQ_API_KEY');
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama3-8b-8192';
    } else if (provider === 'perplexity') {
      apiKey = dbApiKeys.perplexityApiKey || Deno.env.get('PERPLEXITY_API_KEY');
      apiUrl = 'https://api.perplexity.ai/chat/completions';
      model = 'llama-3.1-sonar-small-128k-online';
    } else if (provider === 'mistral') {
      apiKey = dbApiKeys.mistralApiKey || Deno.env.get('MISTRAL_API_KEY');
      apiUrl = 'https://api.mistral.ai/v1/chat/completions';
      model = 'open-mistral-7b';
    } else if (provider === 'together') {
      apiKey = dbApiKeys.togetherApiKey || Deno.env.get('TOGETHER_API_KEY');
      apiUrl = 'https://api.together.xyz/v1/chat/completions';
      model = 'meta-llama/Llama-3-8B-chat-hf';
    } else { // Default to OpenAI
      apiKey = dbApiKeys.openaiApiKey || Deno.env.get('OPENAI_API_KEY');
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      model = 'gpt-4o-mini';
    }

    if (!apiKey) {
      const errorMessage = `Missing API key for selected provider: ${provider.toUpperCase()}`;
      console.error(errorMessage);
      const userMessage = `Le fournisseur IA (${provider.toUpperCase()}) n'est pas configuré. Veuillez ajouter la clé API dans les paramètres d'administration.`;
      return new Response(JSON.stringify({ error: userMessage }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Missing messages in request body' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API error for ${provider}: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Erreur du fournisseur IA (${provider}): ${response.statusText}. Veuillez vérifier votre clé API ou réessayer plus tard.`);
    }

    const completion = await response.json();
    const responseContent = completion.choices[0].message.content;

    return new Response(JSON.stringify({ response: responseContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in chatbot function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
