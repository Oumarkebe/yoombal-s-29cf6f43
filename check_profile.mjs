
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

async function checkProfile() {
    const userId = '67d2b061-8fa3-41f2-b26f-284ed6436908'

    console.log('🔍 Vérification du profil pour:', userId)

    // Vérifier le profil
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (profileError) {
        console.log('❌ Erreur profil:', profileError.message)
    } else {
        console.log('\n📋 PROFIL ACTUEL:')
        console.log('  Email:', profile.email)
        console.log('  Prénom:', profile.first_name)
        console.log('  Nom:', profile.last_name)
        console.log('  Téléphone:', profile.phone)
        console.log('  Rôle principal:', profile.role)
        console.log('  Entreprise:', profile.business_name)
    }

    // Vérifier les rôles
    const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)

    if (rolesError) {
        console.log('❌ Erreur rôles:', rolesError.message)
    } else {
        console.log('\n👤 RÔLES ASSIGNÉS:', roles?.map(r => r.role).join(', ') || 'Aucun')
    }
}

checkProfile()
