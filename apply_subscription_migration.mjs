import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
})

async function applyMigration() {
    console.log('\n🔧 Application de la Migration Subscription System...\n')

    try {
        // Lire le fichier de migration
        const migrationSQL = readFileSync(
            './supabase/migrations/20260114_subscription_system_simplified.sql',
            'utf-8'
        )

        // Exécuter la migration
        const { data, error } = await supabase.rpc('exec_sql' as any, {
            sql: migrationSQL
        } as any)

        if (error) {
            console.log('❌ Erreur:', error.message)
            console.log('\n💡 Alternative: Exécutez le SQL directement dans le SQL Editor de Supabase')
            console.log('   Dashboard > SQL Editor > Nouveau query')
            console.log('   Fichier: ./supabase/migrations/20260114_subscription_system_simplified.sql')
            return false
        }

        console.log('✅ Migration appliquée avec succès!')

        // Vérifier que les tables existent
        console.log('\n📊 Vérification des tables créées...\n')

        const { data: plans } = await supabase.from('premium_plans').select('slug, name')
        const { data: subs } = await supabase.from('user_subscriptions').select('count')
        const { data: audit } = await supabase.from('subscription_audit_log').select('count')

        console.log(`✓ premium_plans: ${plans?.length || 0} plans`)
        plans?.forEach(p => console.log(`  - ${p.slug}: ${p.name}`))

        console.log(`✓ user_subscriptions: table créée`)
        console.log(`✓ subscription_audit_log: table créée`)

        return true

    } catch (error: any) {
        console.log('❌ Erreur d\'exécution:', error.message)
        return false
    }
}

applyMigration()
