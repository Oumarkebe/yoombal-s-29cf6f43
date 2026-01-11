
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
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // Get API Keys
        const { data: apiKeysSettings } = await supabaseAdmin
            .from('platform_settings')
            .select('value')
            .eq('key', 'ai_keys')
            .maybeSingle();

        const { data: visionConfig } = await supabaseAdmin
            .from('premium_features')
            .select('configuration')
            .eq('feature_key', 'ai_vision')
            .maybeSingle();

        const dbApiKeys = (apiKeysSettings?.value as any) || {};
        const apiKey = dbApiKeys.openaiApiKey || Deno.env.get('OPENAI_API_KEY');
        const config = (visionConfig?.configuration as any) || { qc_enabled: true, visual_search_enabled: true };

        if (!apiKey) {
            throw new Error("Clé API OpenAI manquante pour la Vision IA.");
        }

        const { image, mode } = await req.json(); // image is base64

        if (!image) {
            throw new Error("Aucune image fournie.");
        }

        let systemPrompt = "";
        if (mode === 'visual-search') {
            systemPrompt = "Tu es un expert en e-commerce. Analyse cette image et retourne une liste de mots-clés (séparés par des virgules) décrivant le produit, sa catégorie et ses attributs principaux. Sois précis.";
        } else if (mode === 'image-qc') {
            systemPrompt = "Tu es un contrôleur qualité e-commerce. Analyse cette image et détermine si elle est de bonne qualité pour une marketplace (fond net, bon éclairage, produit centré). Réponds en JSON avec les clés 'passed' (boolean), 'score' (0-100) et 'feedback' (string en français).";
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: systemPrompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${image}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erreur OpenAI Vision: ${error}`);
        }

        const result = await response.json();
        const content = result.choices[0].message.content;

        return new Response(JSON.stringify({ result: content }), {
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
