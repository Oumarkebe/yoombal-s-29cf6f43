
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function fixExistingUsers() {
    console.log('\n🔍 RECHERCHE ET RÉPARATION DES UTILISATEURS EXISTANTS\n')

    // 1. Lister TOUS les utilisateurs
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
        console.log('❌ Erreur listing:', listError.message)
        return
    }

    console.log(`📊 ${users.length} utilisateurs trouvés dans auth.users\n`)

    // 2. Pour chaque utilisateur, vérifier et créer le profil/rôle si manquant
    for (const user of users) {
        console.log(`${'='.repeat(60)}`)
        console.log(`👤 ${user.email}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Confirmé: ${user.email_confirmed_at ? '✅' : '❌'}`)

        // Confirmer l'email si pas fait
        if (!user.email_confirmed_at) {
            await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true })
            console.log(`   📧 Email confirmé`)
        }

        // Vérifier si le profil existe
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

        if (!profile) {
            // Déterminer le rôle et les infos selon l'email
            let roleInfo = { role: 'client', firstName: 'Client', lastName: 'Test' }

            if (user.email.includes('marchand')) {
                roleInfo = { role: 'merchant', firstName: 'Marchand', lastName: 'Yoombal', businessName: 'Boutique Yoombal Test' }
            } else if (user.email.includes('livreur')) {
                roleInfo = { role: 'delivery', firstName: 'Livreur', lastName: 'Express', vehicleType: 'scooter' }
            } else if (user.email.includes('yoombal') || user.email.includes('yombal')) {
                roleInfo = { role: 'admin', firstName: 'Admin', lastName: 'Yoombal', businessName: 'Yoombal HQ' }
            }

            // Créer le profil
            const profileData = {
                id: user.id,
                email: user.email,
                first_name: roleInfo.firstName,
                last_name: roleInfo.lastName,
                phone: '+221 77 000 00 00',
                role: roleInfo.role,
                kyc_status: 'verified'
            }

            if (roleInfo.businessName) profileData.business_name = roleInfo.businessName
            if (roleInfo.vehicleType) profileData.vehicle_type = roleInfo.vehicleType

            const { error: insertError } = await supabaseAdmin
                .from('profiles')
                .insert(profileData)

            if (insertError) {
                console.log(`   ⚠️  Profil: ${insertError.message}`)
            } else {
                console.log(`   ✅ Profil créé (${roleInfo.role})`)
            }

            // Assigner le rôle
            const { error: roleError } = await supabaseAdmin
                .from('user_roles')
                .insert({ user_id: user.id, role: roleInfo.role })

            if (roleError) {
                console.log(`   ⚠️  Rôle: ${roleError.message}`)
            } else {
                console.log(`   ✅ Rôle assigné`)
            }
        } else {
            console.log(`   ℹ️  Profil existe déjà`)
        }
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log('✅ RÉPARATION TERMINÉE')
    console.log('='.repeat(60))
    console.log('\n🎯 Tous les utilisateurs devraient maintenant pouvoir se connecter!\n')
}

fixExistingUsers()
