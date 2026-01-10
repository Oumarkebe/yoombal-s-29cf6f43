
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      throw new Error('Missing environment variables: SUPABASE_URL, ANON_KEY, or SERVICE_ROLE_KEY')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Auth Error:', userError)
      throw new Error('Unauthorized: User validation failed')
    }

    const { plan, paymentMethod } = await req.json()

    console.log(`[Process Subscription] User: ${user.id} | Plan: ${plan}`)

    let newPermissions = {}
    if (plan === 'premium_bundle' || plan === 'premium_monthly') {
      newPermissions = {
        ai_assistant: { active: true },
        ai_smart_search: { active: true },
        content_generation: { active: true },
        predictions: { active: true },
        ai_vision: { active: true },
        pricing: { active: true },
        advanced_stats: { active: true },
        fraud_detection: { active: true },
        stock_prediction: { active: true },
        product_recommendations: { active: true },
        marketing_automation: { active: true },
        referral_system: { active: true },
        vip_program: { active: true },
        gamification: { active: true }
      }
    }

    // Admin Client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('permissions')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Fetch Profile Error:', fetchError)
      throw new Error(`Profile fetch error: ${fetchError.message}`)
    }

    const currentPermissions = profile?.permissions || {}
    const updatedPermissions = { ...currentPermissions, ...newPermissions }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        permissions: updatedPermissions
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update Profile Error:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription activated', permissions: updatedPermissions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message, details: String(error) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
