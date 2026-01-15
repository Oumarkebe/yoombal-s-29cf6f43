
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function confirmEmail() {
    console.log('📧 Confirmation manuelle de l\'email pour yoombal28@gmail.com')

    // Utiliser l'API Admin pour mettre à jour l'utilisateur
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        '67d2b061-8fa3-41f2-b26f-284ed6436908', // L'ID récupéré lors de la création
        { email_confirm: true }
    )

    if (error) {
        console.error('❌ ERREUR:', error.message)
    } else {
        console.log('✅ Email confirmé avec succès!')
        console.log('User:', data.user.email, '- Confirmé:', data.user.email_confirmed_at)
    }
}

confirmEmail()
