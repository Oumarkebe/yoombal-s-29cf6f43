import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

async function verifyMigration() {
    console.log('\n🔍 VÉRIFICATION DE LA MIGRATION\n')

    try {
        // Vérifier premium_plans
        const { data: plans, error: plansError } = await supabase
            .from('premium_plans')
            .select('slug, name, price_monthly, features')
            .order('display_order')

        if (plansError) {
            console.log('❌ Table premium_plans:', plansError.message)
            return false
        }

        console.log('✅ Table premium_plans:')
        plans?.forEach(p => {
            const featuresCount = Array.isArray(p.features) ? p.features.length : 0
            console.log(`  - ${p.slug.padEnd(12)} | ${p.name.padEnd(20)} | ${p.price_monthly} FCFA | ${featuresCount} features`)
        })

        // Vérifier user_subscriptions
        const { data: subs, error: subsError } = await supabase
            .from('user_subscriptions')
            .select('count')
            .limit(1)

        if (subsError) {
            console.log('\n❌ Table user_subscriptions:', subsError.message)
            return false
        }
        console.log('\n✅ Table user_subscriptions: OK')

        // Vérifier subscription_audit_log
        const { data: audit, error: auditError } = await supabase
            .from('subscription_audit_log')
            .select('count')
            .limit(1)

        if (auditError) {
            console.log('❌ Table subscription_audit_log:', auditError.message)
            return false
        }
        console.log('✅ Table subscription_audit_log: OK')

        console.log('\n🎉 Migration vérifiée avec succès!')
        console.log('\n📊 Résumé:')
        console.log(`   - ${plans?.length || 0} plans disponibles (Starter, Pro, Enterprise)`)
        console.log('   - Tables créées et accessibles')
        console.log('   - Prêt pour Phase 2: Hooks & Composants\n')

        return true

    } catch (error) {
        console.log('❌ Erreur:', error.message)
        return false
    }
}

verifyMigration()
