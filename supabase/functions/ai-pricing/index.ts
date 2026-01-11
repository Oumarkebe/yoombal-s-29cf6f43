
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

        // Parallel fetch for speed
        const [apiKeysRes, pricingConfigRes] = await Promise.all([
            supabaseAdmin.from('platform_settings').select('value').eq('key', 'ai_keys').maybeSingle(),
            supabaseAdmin.from('premium_features').select('configuration').eq('feature_key', 'pricing').maybeSingle()
        ]);

        const apiKey = (apiKeysRes.data?.value as any)?.openaiApiKey || Deno.env.get('OPENAI_API_KEY');
        const config = (pricingConfigRes.data?.configuration as any) || { algorithm: 'market_based', min_margin: 0.1 };

        const { productData } = await req.json();

        const systemPrompt = `Tu es un expert en pricing pour une marketplace africaine (Sénégal). 
    Analyse les données du produit et suggère un prix optimal en FCFA. 
    Algorithme cible : ${config.algorithm} (market_based=basé sur le marché, cost_plus=marge fixe, demand_based=basé sur la demande).
    Marge minimale à respecter : ${config.min_margin * 100}%.
    Réponds en JSON avec : 'suggested_price' (number), 'logic' (string court), 'margin_impact' (string).`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: JSON.stringify(productData) }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const result = await response.json();
        return new Response(JSON.stringify(JSON.parse(result.choices[0].message.content)), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
