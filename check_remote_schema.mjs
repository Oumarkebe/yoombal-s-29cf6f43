import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

async function diagnostic() {
    console.log('\n🔍 Diagnostic de la Base de Données Distante...\n')

    try {
        // 1. Check premium_plans
        const { data: plans, error: plansError } = await supabase.from('premium_plans').select('*').limit(1)
        if (plansError) {
            console.log('❌ premium_plans:', plansError.message)
        } else {
            console.log('✅ premium_plans: Existe')
        }

        // 2. Check user_subscriptions
        const { error: subsError } = await supabase.from('user_subscriptions').select('*').limit(1)
        if (subsError) {
            console.log('❌ user_subscriptions:', subsError.message)
        } else {
            console.log('✅ user_subscriptions: Existe')
        }

        // 3. Check user_premium_subscriptions
        const { error: pSubsError } = await supabase.from('user_premium_subscriptions').select('*').limit(1)
        if (pSubsError) {
            console.log('❌ user_premium_subscriptions:', pSubsError.message)
        } else {
            console.log('✅ user_premium_subscriptions: Existe')
        }

        // 4. Check premium_features columns
        const { data: features, error: featuresError } = await supabase.from('premium_features').select('*').limit(1)
        if (featuresError) {
            console.log('❌ premium_features:', featuresError.message)
        } else {
            const first = features[0]
            console.log('✅ premium_features: Existe')
            console.log('   - is_free:', 'is_free' in first ? 'OUI' : 'NON')
            console.log('   - trial_days:', 'trial_days' in first ? 'OUI' : 'NON')
        }

    } catch (error) {
        console.error('❌ Erreur critique:', error.message)
    }
}

diagnostic()
