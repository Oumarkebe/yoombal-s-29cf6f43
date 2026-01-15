
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'

const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function fixUserPassword(email, newPassword) {
    console.log(`\n🔧 Réinitialisation du mot de passe pour: ${email}`)

    // Récupérer l'utilisateur
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.find(u => u.email === email)

    if (!user) {
        console.log(`  ❌ Utilisateur non trouvé`)
        return false
    }

    console.log(`  ℹ️  ID utilisateur: ${user.id}`)

    // Réinitialiser le mot de passe
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    )

    if (error) {
        console.log(`  ❌ Erreur: ${error.message}`)
        return false
    }

    console.log(`  ✅ Mot de passe réinitialisé avec succès!`)
    return true
}

async function fixAllPasswords() {
    console.log('\n🚀 RÉINITIALISATION DES MOTS DE PASSE\n')

    await fixUserPassword('marchand@gmail.com', 'Touba28')
    await fixUserPassword('livreur@gmail.com', 'Touba28')

    console.log('\n✅ Réinitialisation terminée! Tentative de connexion...\n')
}

fixAllPasswords()
