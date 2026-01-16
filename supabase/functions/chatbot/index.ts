// @ts-ignore
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';


// Use the SERVICE_ROLE_KEY for admin-level access from the function
// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL');
// @ts-ignore
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req: Request) => {
  const { method } = req;
  console.log(`${method} request received`);

  if (method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
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
      .or('feature_key.eq.ai_assistant,feature_key.eq.assistant_intelligent')
      .order('is_enabled', { ascending: false })
      .limit(1)
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

    // --- CONTEXT INJECTION (Dynamic v2.5) ---
    const { messages } = await req.json();

    // Aggregate keywords from ALL messages to maintain context
    const allContent = messages?.map((m: any) => m.content).join(" ") || "";

    // Extract significant keywords (length >= 3)
    const keywords: string[] = Array.from(new Set(
      allContent
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((word: string) => word.length >= 3 && !['votre', 'cette', 'celui', 'ceux', 'avec', 'pour', 'dans', 'voul', 'voulu'].includes(word))
    ));

    console.log(`Searching for aggregated keywords: ${keywords.join(', ')}`);

    let productQuery = supabaseAdmin
      .from('products')
      .select('id, name, price, stock, description, tags, status')
      .or('is_active.eq.true,is_active.is.null');

    if (keywords.length > 0) {
      // Build a robust filter searching in name and description
      const nameFilters = keywords.map(k => `name.ilike.%${k}%`);
      const descFilters = keywords.map(k => `description.ilike.%${k}%`);

      // Also search for the first two keywords combined to catch "viande mouton"
      let combinedFilter = '';
      if (keywords.length >= 2) {
        combinedFilter = `,name.ilike.%${keywords[0]}%${keywords[1]}%`;
      }

      productQuery = productQuery.or(`${nameFilters.join(',')},${descFilters.join(',')}${combinedFilter}`);
    }

    const { data: foundProducts, error: searchError } = await productQuery
      .order('created_at', { ascending: false })
      .limit(10);

    if (searchError) {
      console.error('Dynamic search error:', searchError.message);
    }

    // Fallback to top products if search yielded nothing
    let productsToUse = foundProducts;
    if (!productsToUse || productsToUse.length === 0) {
      console.log("No dynamic products found. Falling back to recent products.");
      const { data: recentProducts, error: fallbackError } = await supabaseAdmin
        .from('products')
        .select('id, name, price, stock, description, tags, status')
        .or('is_active.eq.true,is_active.is.null')
        .order('created_at', { ascending: false })
        .limit(5);

      if (fallbackError) {
        console.error('Fallback search error:', fallbackError.message);
      }
      productsToUse = recentProducts;
    }

    console.log(`Context catalogue will contain ${productsToUse?.length || 0} products.`);

    // Fetch categories for context
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('name')
      .limit(10);

    if (catError) console.error('Categories fetch error:', catError.message);

    const businessContext = `
=== 🛍️ CATALOGUE DE PRODUITS DISPONIBLES (TEMPS RÉEL) ===
${productsToUse?.map((p: any) => `- [ID:${p.id}] ${p.name}: ${p.price} FCFA (Stock: ${p.stock || 0})`).join('\n') || 'Aucun produit trouvé pour cette recherche.'}

📁 CATÉGORIES : ${categories?.map((c: any) => c.name).join(', ') || 'Général'}
=========================================================
`;

    const config = settings.configuration || {};
    const tone = config.tone || 'professionnel et chaleureux';
    const systemPromptFromDb = config.system_prompt || "";

    const systemPrompt = `${businessContext}

Tu es Yoombal Assistant, un griot moderne sénégalais 🇸🇳. Tu as ACCÈS au catalogue de produits ci-dessus.
Ta mission : aider l'utilisateur à choisir parmi les produits listés. Ne dis JAMAIS que tu n'as pas accès au catalogue.

### 🎭 RÈGLES DE TONALITÉ
ACCUEIL → Ton Teranga.
QUESTION PRODUIT → Ton Conseiller simple.
BUDGET → Ton Commercial honnête.
⚠️ Utilise occasionnellement "waay", "dé", "hum ?" en fin de phrase.

### 🧠 MOTEUR DE DÉCISION
1. Vérifie si le produit demandé est dans le CATALOGUE ci-dessus.
2. Si oui, présente-le et **PROPOSE** de l'ajouter au panier (ne dis pas que c'est déjà fait, car l'utilisateur doit cliquer sur le bouton).
3. Si non, propose le produit le plus proche du catalogue.
4. TOUTE recommandation doit se terminer par : "On l'ajoute au panier, hum ?" OU une alternative.

### 📊 TAGS ANALYTIQUES (OBLIGATOIRE EN FIN DE RÉPONSE)
action_detected : add_cart|ID_PRODUIT | compare | support_contact
commercial_success : true / false
tone_consistency : valid / invalid

⚠️ IMPORTANT : Pour add_cart, utilise l'ID exact. Exemple : action_detected : add_cart|uuid-du-produit

---
Instructions additionnelles : ${systemPromptFromDb}`;

    const provider = settings.configuration?.provider || 'openai';
    let apiKey, apiUrl, model;


    const { data: apiKeysSettings, error: apiKeysError } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'ai_keys')
      .maybeSingle();

    if (apiKeysError) {
      console.error('Error fetching ai_keys from platform_settings:', apiKeysError.message);
    }

    const dbApiKeys = (apiKeysSettings?.value as { openaiApiKey?: string; groqApiKey?: string; perplexityApiKey?: string; mistralApiKey?: string; togetherApiKey?: string; }) || {};

    if (provider === 'groq') {
      // @ts-ignore
      apiKey = dbApiKeys.groqApiKey || Deno.env.get('GROQ_API_KEY');
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama3-8b-8192';
    } else if (provider === 'perplexity') {
      // @ts-ignore
      apiKey = dbApiKeys.perplexityApiKey || Deno.env.get('PERPLEXITY_API_KEY');
      apiUrl = 'https://api.perplexity.ai/chat/completions';
      model = 'llama-3.1-sonar-small-128k-online';
    } else if (provider === 'mistral') {
      // @ts-ignore
      apiKey = dbApiKeys.mistralApiKey || Deno.env.get('MISTRAL_API_KEY');
      apiUrl = 'https://api.mistral.ai/v1/chat/completions';
      model = 'open-mistral-7b';
    } else if (provider === 'together') {
      // @ts-ignore
      apiKey = dbApiKeys.togetherApiKey || Deno.env.get('TOGETHER_API_KEY');
      apiUrl = 'https://api.together.xyz/v1/chat/completions';
      model = 'meta-llama/Llama-3-8B-chat-hf';
    } else { // Default to OpenAI
      // @ts-ignore
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

    // --- ANALYTICS LOGGING (v2.2) ---
    try {
      const intention = responseContent.match(/action_detected\s*:\s*(\w+)/)?.[1];
      const toneUsed = responseContent.match(/tone_used\s*:\s*(\w+)/)?.[1]; // In case it outputs tone_used instead of mapped one
      const commercialSuccess = responseContent.includes('commercial_success : true');
      const toneConsistency = responseContent.match(/tone_consistency\s*:\s*(\w+)/)?.[1];

      await supabaseAdmin
        .from('ai_chat_logs')
        .insert({
          message_content: messages[messages.length - 1]?.content || 'N/A',
          intention: intention,
          tone_used: toneUsed,
          action_detected: intention,
          commercial_success: commercialSuccess,
          tone_consistency: toneConsistency,
          raw_response: completion
        });
    } catch (logError) {
      console.error('Failed to log AI interaction:', logError);
    }

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
