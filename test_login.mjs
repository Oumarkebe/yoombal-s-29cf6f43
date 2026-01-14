
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg2NjAsImV4cCI6MjA4MzM5NDY2MH0.3CZHDPBR_LajO8XAJRddjWNO-Qv_SSIIrHXsvZS4AMA'

const supabase = createClient(url, key)

async function testLogin() {
    console.log('🔐 Tentative de connexion avec : marchand@gmail.com / Touba28')

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'marchand@gmail.com',
        password: 'Touba28'
    })

    if (error) {
        console.error('❌ ECHEC :', error.message)
        console.log('Conclusion : Le mot de passe dans la base de données ne correspond pas.')
    } else {
        console.log('✅ SUCCÈS ! Connexion réussie.')
        console.log('User ID:', data.user.id)
    }
}

testLogin()
