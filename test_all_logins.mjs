
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg2NjAsImV4cCI6MjA4MzM5NDY2MH0.3CZHDPBR_LajO8XAJRddjWNO-Qv_SSIIrHXsvZS4AMA'

const supabase = createClient(url, key)

const testUsers = [
    { email: 'marchand@gmail.com', password: 'Touba28', role: 'Marchand' },
    { email: 'livreur@gmail.com', password: 'Touba28', role: 'Livreur' },
    { email: 'client@gmail.com', password: 'Touba28', role: 'Client' }
]

async function testLogin(email, password, role) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`🔐 Test de connexion: ${role} (${email})`)
    console.log('='.repeat(50))

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.log(`❌ ÉCHEC: ${error.message}`)
        console.log(`   Code: ${error.status}`)
        return false
    } else {
        console.log(`✅ SUCCÈS !`)
        console.log(`   User ID: ${data.user.id}`)
        console.log(`   Email: ${data.user.email}`)

        // Se déconnecter immédiatement pour le prochain test
        await supabase.auth.signOut()
        return true
    }
}

async function testAllLogins() {
    console.log('\n🚀 TEST DE CONNEXION POUR TOUS LES UTILISATEURS\n')

    let successCount = 0
    let failCount = 0

    for (const user of testUsers) {
        const success = await testLogin(user.email, user.password, user.role)
        if (success) successCount++
        else failCount++
    }

    console.log(`\n${'='.repeat(50)}`)
    console.log('📊 RÉSUMÉ')
    console.log('='.repeat(50))
    console.log(`✅ Réussis: ${successCount}/${testUsers.length}`)
    console.log(`❌ Échoués: ${failCount}/${testUsers.length}`)
}

testAllLogins()
