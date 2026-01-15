
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function createUserViaAdmin(userData) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🔨 Création ADMIN de: ${userData.email}`)
    console.log('='.repeat(60))

    // Créer directement via l'API Admin (bypass tous les triggers)
    console.log('  1️⃣  Création via Admin API...')
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Confirmer automatiquement
        user_metadata: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role
        }
    })

    if (error) {
        console.log(`  ❌ Erreur: ${error.message}`)
        return null
    }

    const userId = data.user.id
    console.log(`  ✅ Utilisateur créé, ID: ${userId}`)

    // Créer le profil
    console.log('  2️⃣  Création du profil...')
    const profileData = {
        id: userId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        kyc_status: 'verified'
    }

    if (userData.businessName) profileData.business_name = userData.businessName
    if (userData.vehicleType) profileData.vehicle_type = userData.vehicleType

    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert(profileData)

    if (profileError) {
        console.log(`  ⚠️  Erreur profil: ${profileError.message}`)
    } else {
        console.log(`  ✅ Profil créé`)
    }

    // Assigner le rôle
    console.log('  3️⃣  Attribution du rôle...')
    const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
            user_id: userId,
            role: userData.role
        })

    if (roleError) {
        console.log(`  ⚠️  Erreur rôle: ${roleError.message}`)
    } else {
        console.log(`  ✅ Rôle assigné`)
    }

    console.log(`  🎉 ${userData.email} prêt!`)
    return userId
}

async function createBothUsers() {
    console.log('\n🚀 CRÉATION VIA ADMIN API (Méthode de dernier recours)\n')

    const merchant = await createUserViaAdmin({
        email: 'marchand@gmail.com',
        password: 'Touba28',
        firstName: 'Marchand',
        lastName: 'Yoombal',
        role: 'merchant',
        businessName: 'Boutique Yoombal Test',
        phone: '+221 77 111 11 11'
    })

    const delivery = await createUserViaAdmin({
        email: 'livreur@gmail.com',
        password: 'Touba28',
        firstName: 'Livreur',
        lastName: 'Express',
        role: 'delivery',
        vehicleType: 'scooter',
        phone: '+221 77 222 22 22'
    })

    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSULTAT')
    console.log('='.repeat(60))
    if (merchant) console.log(`✅ Marchand créé (ID: ${merchant})`)
    if (delivery) console.log(`✅ Livreur créé (ID: ${delivery})`)
    console.log('\n🎯 Test de connexion maintenant...\n')
}

createBothUsers()
