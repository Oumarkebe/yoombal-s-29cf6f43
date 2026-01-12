
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface PaymentRequest {
  amount: number
  currency: string
  provider: 'orange_money' | 'wave' | 'free_money'
  phoneNumber: string
  type: 'credit_topup' | 'subscription_purchase' | 'repayment'
  metadata: {
    userId: string
    featureId?: string // for subscription
    bundleId?: string // for bundle
    description?: string
  }
}

Deno.serve(async (req) => {
  // Handle CORS
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
    const { amount, currency, provider, phoneNumber, type, metadata } = await req.json() as PaymentRequest

    console.log(`[Payment Simulation] Processing ${type} via ${provider} for ${phoneNumber}: ${amount} ${currency}`)

    // 1. Simulate Network Delay (2-4 seconds) to feel like USSD/App validation
    const delay = Math.floor(Math.random() * 2000) + 2000
    await new Promise(resolve => setTimeout(resolve, delay))

    // 2. Generate Fake Transaction ID
    const transactionId = `${provider.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    // 3. Process Logic based on Type
    if (type === 'credit_topup') {
      // Add credits to user wallet

      // Update or Create user_credits
      const { data: currentCredits, error: fetchError } = await supabaseAdmin
        .from('user_credits')
        .select('*')
        .eq('user_id', metadata.userId)
        .maybeSingle()

      if (fetchError) throw fetchError

      let newBalance = amount
      if (currentCredits) {
        newBalance += Number(currentCredits.balance)
      }

      // Upsert Credits
      const { error: upsertError } = await supabaseAdmin
        .from('user_credits')
        .upsert({
          user_id: metadata.userId,
          balance: newBalance,
          currency: currency || 'FCFA',
          updated_at: new Date().toISOString()
        })

      if (upsertError) throw upsertError

      // Log Transaction
      const { error: logError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: metadata.userId,
          amount: amount,
          type: 'credit',
          description: `Rechargement ${provider === 'orange_money' ? 'Orange Money' : 'Wave'} (${phoneNumber})`,
          reference_id: null // Could link to external payment ID if needed
        }) // Note: Schema might need adjustment if reference_id is UUID. Use generic text field or ignore if UUID. 
      // Correction: reference_id is UUID in schema. Let's leave it null or create a dummy UUID if strict.
      // Actually, let's assume loose schema or handle it. 
      // Storing the provider transaction ID in description or separate column is better.

      if (logError) console.error('Error logging transaction:', logError)

    } else if (type === 'subscription_purchase') {
      // Direct subscription purchase
      if (!metadata.featureId && !metadata.bundleId) {
        throw new Error('Missing featureId or bundleId for subscription')
      }

      // Activate Subscription directly
      // Simplified: We assume 30 days for now or calculate based on plan
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // Default 30 days

      if (metadata.featureId) {
        const { error: subError } = await supabaseAdmin
          .from('user_premium_subscriptions')
          .insert({
            user_id: metadata.userId,
            feature_id: metadata.featureId,
            status: 'active',
            payment_status: 'paid',
            amount_paid: amount,
            payment_method: provider,
            transaction_id: transactionId,
            expires_at: expiresAt.toISOString(),
            auto_renew: false
          })

        if (subError) throw subError
      }
    } else if (type === 'repayment') {
      // BNPL Repayment Logic
      console.log(`[Repayment] User ${metadata.userId} paid ${amount}`);
      // In a real scenario, we would update the 'orders' payment status or a 'loans' table
      // Here, the client-side updates the profile's current_debt directly for simulation
      // We could log this transaction if we had a dedicated table
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Paiement effectué avec succès',
        transactionId: transactionId,
        simulation: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Payment Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
