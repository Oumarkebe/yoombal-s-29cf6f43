
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, serviceRoleKey)

// IDs exacts récupérés de la base de données
const users = [
    {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        email: 'marchand@gmail.com',
        firstName: 'Marchand',
        lastName: 'Yoombal',
        role: 'merchant',
        businessName: 'Boutique Yoombal Test',
        phone: '+221 77 111 11 11'
    },
    {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
        email: 'livreur@gmail.com',
        firstName: 'Livreur',
        lastName: 'Express',
        role: 'delivery',
        vehicleType: 'scooter',
        phone: '+221 77 222 22 22'
    }
]

async function createProfilesForExistingUsers() {
    console.log('\n🔧 CRÉATION DES PROFILS POUR LES UTILISATEURS EXISTANTS\n')

    for (const userData of users) {
        console.log(`${'='.repeat(60)}`)
        console.log(`👤 ${userData.email} (${userData.id})`)

        // 1. Créer le profil
        const profileData = {
            id: userData.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role,
            kyc_status: 'verified'
        }

        if (userData.businessName) profileData.business_name = userData.businessName
        if (userData.vehicleType) profileData.vehicle_type = userData.vehicleType

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' })

        if (profileError) {
            console.log(`  ❌ Profil: ${profileError.message}`)
        } else {
            console.log(`  ✅ Profil créé/mis à jour`)
        }

        // 2. Assigner le rôle
        const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({ user_id: userData.id, role: userData.role }, { onConflict: 'user_id,role' })

        if (roleError) {
            console.log(`  ❌ Rôle: ${roleError.message}`)
        } else {
            console.log(`  ✅ Rôle ${userData.role} assigné`)
        }
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log('✅ PROFILS CRÉÉS')
    console.log('='.repeat(60))
    console.log('\n🎯 Test de connexion...\n')
}

createProfilesForExistingUsers()
