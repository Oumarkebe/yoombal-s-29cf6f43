
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg2NjAsImV4cCI6MjA4MzM5NDY2MH0.3CZHDPBR_LajO8XAJRddjWNO-Qv_SSIIrHXsvZS4AMA'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, anonKey)
const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function createCompleteUser(userData) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🔨 Création complète de: ${userData.email}`)
    console.log('='.repeat(60))

    // 1. Créer avec l'API publique
    console.log('  1️⃣  Création du compte...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
                role: userData.role
            }
        }
    })

    if (signUpError && !signUpError.message.includes('already registered')) {
        console.log(`  ❌ Erreur création: ${signUpError.message}`)
        return null
    }

    const userId = signUpData?.user?.id
    if (!userId) {
        console.log(`  ❌ Impossible de récupérer l'ID utilisateur`)
        return null
    }

    console.log(`  ✅ Compte créé, ID: ${userId}`)

    // 2. Confirmer l'email
    console.log('  2️⃣  Confirmation de l\'email...')
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
    )
    if (confirmError) {
        console.log(`  ⚠️  Problème confirmation: ${confirmError.message}`)
    } else {
        console.log(`  ✅ Email confirmé`)
    }

    // 3. Créer le profil
    console.log('  3️⃣  Création du profil...')
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
        .upsert(profileData, { onConflict: 'id' })

    if (profileError) {
        console.log(`  ❌ Erreur profil: ${profileError.message}`)
    } else {
        console.log(`  ✅ Profil créé`)
    }

    // 4. Assigner le rôle
    console.log('  4️⃣  Attribution du rôle...')
    const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
            user_id: userId,
            role: userData.role
        }, { onConflict: 'user_id,role' })

    if (roleError) {
        console.log(`  ❌ Erreur rôle: ${roleError.message}`)
    } else {
        console.log(`  ✅ Rôle assigné`)
    }

    console.log(`  🎉 Utilisateur ${userData.email} prêt!`)
    return userId
}

async function createMissingUsers() {
    console.log('\n🚀 CRÉATION DES UTILISATEURS MANQUANTS\n')

    const merchant = await createCompleteUser({
        email: 'marchand@gmail.com',
        password: 'Touba28',
        firstName: 'Marchand',
        lastName: 'Yoombal',
        role: 'merchant',
        businessName: 'Boutique Yoombal Test',
        phone: '+221 77 111 11 11'
    })

    const delivery = await createCompleteUser({
        email: 'livreur@gmail.com',
        password: 'Touba28',
        firstName: 'Livreur',
        lastName: 'Express',
        role: 'delivery',
        vehicleType: 'scooter',
        phone: '+221 77 222 22 22'
    })

    console.log('\n' + '='.repeat(60))
    console.log('✅ CRÉATION TERMINÉE')
    console.log('='.repeat(60))
    if (merchant) console.log(`✓ Marchand créé (ID: ${merchant})`)
    if (delivery) console.log(`✓ Livreur créé (ID: ${delivery})`)
}

createMissingUsers()
