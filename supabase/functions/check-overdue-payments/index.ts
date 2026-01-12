
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing environment variables')
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

        // 1. Fetch BNPL orders that are active but older than 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // We assume 'pending' or 'processing' are the active states for BNPL before full repayment
        // In a real system, we'd check an 'installments' table. 
        // Here we check orders table directly.
        const { data: overdueOrders, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('*, profiles(email, first_name)')
            .eq('payment_method', 'bnpl')
            .neq('status', 'completed')
            .neq('status', 'cancelled')
            .neq('status', 'overdue') // Don't process already overdue
            .lt('created_at', thirtyDaysAgo.toISOString())

        if (fetchError) throw fetchError

        const updates = []

        // 2. Process Overdue Orders
        for (const order of overdueOrders || []) {
            console.log(`[Overdue] Marking order ${order.id} for user ${order.user_id} as overdue`)

            // Update Order Status
            const updatePromise = supabaseAdmin
                .from('orders')
                .update({ status: 'overdue' })
                .eq('id', order.id)

            updates.push(updatePromise)

            // Notification Simulation
            console.log(`[Notification] Sending email to ${order.profiles?.email}: "Votre paiement de ${order.total_amount} FCFA est en retard."`)
        }

        await Promise.all(updates)

        return new Response(
            JSON.stringify({
                success: true,
                processed: overdueOrders?.length || 0
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error processing overdue:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
