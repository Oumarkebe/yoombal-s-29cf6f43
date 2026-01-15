
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg2NjAsImV4cCI6MjA4MzM5NDY2MH0.3CZHDPBR_LajO8XAJRddjWNO-Qv_SSIIrHXsvZS4AMA'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabase = createClient(url, anonKey)
const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const users = [
    {
        email: 'marchand@gmail.com',
        password: 'Touba28',
        firstName: 'Marchand',
        lastName: 'Yoombal',
        role: 'merchant',
        businessName: 'Boutique Yoombal Test',
        phone: '+221 77 111 11 11'
    },
    {
        email: 'livreur@gmail.com',
        password: 'Touba28',
        firstName: 'Livreur',
        lastName: 'Express',
        role: 'delivery',
        vehicleType: 'scooter',
        phone: '+221 77 222 22 22'
    },
    {
        email: 'client@gmail.com',
        password: 'Touba28',
        firstName: 'Client',
        lastName: 'Test',
        role: 'client',
        phone: '+221 77 333 33 33'
    }
]

async function setupUser(userData) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`📧 Configuration de: ${userData.email}`)
    console.log('='.repeat(60))

    // 1. Créer ou récupérer l'utilisateur
    let userId
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

    if (signUpError) {
        if (signUpError.message.includes('already registered')) {
            console.log('  ℹ️  Utilisateur existe déjà, récupération de l\'ID...')
            // Essayer de se connecter pour récupérer l'ID
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: userData.email,
                password: userData.password
            })
            if (signInError && signInError.message.includes('Email not confirmed')) {
                // L'utilisateur existe mais email non confirmé, on doit chercher son ID différemment
                console.log('  ⚠️  Email non confirmé, recherche de l\'ID...')
                // On va utiliser l'admin API pour lister les utilisateurs
                const { data: { users: allUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
                const existingUser = allUsers?.find(u => u.email === userData.email)
                if (existingUser) {
                    userId = existingUser.id
                    console.log(`  ✅ ID trouvé: ${userId}`)
                }
            } else if (signInData?.user) {
                userId = signInData.user.id
                console.log(`  ✅ Connexion réussie, ID: ${userId}`)
            }
        } else {
            console.log(`  ❌ Erreur création: ${signUpError.message}`)
            return
        }
    } else if (signUpData?.user) {
        userId = signUpData.user.id
        console.log(`  ✅ Utilisateur créé avec succès, ID: ${userId}`)
    }

    if (!userId) {
        console.log('  ❌ Impossible de récupérer l\'ID utilisateur')
        return
    }

    // 2. Confirmer l'email
    console.log('  📧 Confirmation de l\'email...')
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
    )
    if (confirmError) {
        console.log(`  ⚠️  Erreur confirmation: ${confirmError.message}`)
    } else {
        console.log('  ✅ Email confirmé')
    }

    // 3. Créer/Mettre à jour le profil
    console.log('  👤 Création du profil...')
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
        console.log(`  ⚠️  Erreur profil: ${profileError.message}`)
    } else {
        console.log('  ✅ Profil créé/mis à jour')
    }

    // 4. Assigner le rôle
    console.log('  🔐 Attribution du rôle...')
    const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
            user_id: userId,
            role: userData.role
        }, { onConflict: 'user_id,role' })

    if (roleError) {
        console.log(`  ⚠️  Erreur rôle: ${roleError.message}`)
    } else {
        console.log(`  ✅ Rôle ${userData.role} assigné`)
    }

    console.log(`  🎉 Configuration terminée pour ${userData.email}`)
}

async function setupAllUsers() {
    console.log('\n🚀 CONFIGURATION AUTOMATIQUE DE TOUS LES UTILISATEURS\n')

    for (const userData of users) {
        await setupUser(userData)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ CONFIGURATION GLOBALE TERMINÉE !')
    console.log('='.repeat(60))
    console.log('\n📋 RÉCAPITULATIF DES IDENTIFIANTS:\n')
    users.forEach(u => {
        console.log(`  ${u.role.toUpperCase().padEnd(10)} - ${u.email.padEnd(25)} / ${u.password}`)
    })
    console.log('\n✅ Tous les utilisateurs peuvent maintenant se connecter!\n')
}

setupAllUsers()
