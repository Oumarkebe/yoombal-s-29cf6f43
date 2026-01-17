// @ts-ignore
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL');
// @ts-ignore
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// @ts-ignore
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { imageUrl, documentType } = await req.json();

        if (!imageUrl) {
            return new Response(JSON.stringify({ error: 'Missing imageUrl' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Call OpenAI Vision
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Tu es un expert en analyse de documents d'identité sénégalais (CNI CEDEAO, Passeport). 
            Extrais les informations suivantes au format JSON :
            - first_name
            - last_name
            - id_number
            - expiry_date (YYYY-MM-DD)
            - is_valid (boolean)
            - confidence_score (0.0 to 1.0)
            
            Si le document n'est pas lisible ou n'est pas une pièce d'identité, mets is_valid: false et explique pourquoi dans "reason".`
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: `Analyse ce document (${documentType || 'ID'}) :` },
                            { type: 'image_url', image_url: { url: imageUrl } }
                        ]
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Document analysis error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
