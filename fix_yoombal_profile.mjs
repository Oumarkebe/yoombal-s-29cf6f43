
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

async function fixProfile() {
    const userId = '67d2b061-8fa3-41f2-b26f-284ed6436908'

    console.log('🔧 Création/Mise à jour du profil pour yoombal28@gmail.com...')

    // Créer le profil
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: 'yoombal28@gmail.com',
            first_name: 'Yoombal',
            last_name: 'Admin',
            phone: '+221 77 123 45 67',
            role: 'admin',
            business_name: 'Yoombal Administration',
            kyc_status: 'verified'
        }, { onConflict: 'id' })
        .select()
        .single()

    if (profileError) {
        console.log('❌ Erreur création profil:', profileError.message)
    } else {
        console.log('✅ Profil créé/mis à jour avec succès!')
    }

    // Assigner le rôle admin
    const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
            user_id: userId,
            role: 'admin'
        }, { onConflict: 'user_id,role' })

    if (roleError) {
        console.log('❌ Erreur assignation rôle:', roleError.message)
    } else {
        console.log('✅ Rôle admin assigné avec succès!')
    }

    console.log('\n🎉 Configuration terminée! Vous pouvez maintenant vous reconnecter.')
}

fixProfile()
