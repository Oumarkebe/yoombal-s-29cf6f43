
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (_req) => {
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer le nombre de marchands
    const { count: merchantCount, error: merchantError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'merchant');

    if (merchantError) throw merchantError;

    // Récupérer le volume total des transactions
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .in('status', ['completed', 'delivered']);

    if (ordersError) throw ordersError;

    const totalVolume = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    const stats = {
      merchantCount: merchantCount ?? 0,
      totalVolume: totalVolume,
    };

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
