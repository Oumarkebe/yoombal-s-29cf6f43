import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

async function applyFix() {
    console.log('🔧 Application du correctif RLS et Permissions...')

    try {
        const sql = readFileSync('./fix_subscription_rls.sql', 'utf-8')
        const { error } = await supabase.rpc('exec_sql', { sql })

        if (error) {
            console.error('❌ Erreur RPC:', error.message)
            // Fallback: try raw query if rpc fails (restricted) or manual advice
            console.log('💡 Note: Si exec_sql échoue, veuillez exécuter le contenu de fix_subscription_rls.sql dans le Dashboard Supabase > SQL Editor.')
        } else {
            console.log('✅ Correctif appliqué avec succès via RPC.')
        }

    } catch (e) {
        console.error('❌ Erreur script:', e.message)
    }
}

applyFix()
