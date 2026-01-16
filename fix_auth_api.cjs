const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixUser() {
    console.log('🔧 Réparation du compte utilisateur via API Admin...');
    const userId = 'bdd6f70f-af16-4732-ab5e-8d7694e6d90f';
    const email = 'yoombal28@gmail.com';
    const password = 'Darousalam2828Touba';

    // 1. Mettre à jour l'utilisateur (email + password + confirm)
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                first_name: 'Yoombal',
                last_name: 'Admin',
                role: 'admin' // Important de replacer le role ici aussi au cas où
            }
        }
    );

    if (error) {
        console.error('❌ Erreur update:', error.message);
        console.error(error);
    } else {
        console.log('✅ Compte mis à jour avec succès !');
        console.log('   User ID:', data.user.id);
        console.log('   Email:', data.user.email);
        console.log('   Metadata:', data.user.user_metadata);

        // 2. Tester la connexion immédiatement pour valider
        console.log('\n🔒 Test de connexion...');
        const authClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);

        const { data: loginData, error: loginError } = await authClient.auth.signInWithPassword({
            email,
            password
        });

        if (loginError) {
            console.error('❌ Connexion échouée:', loginError.message);
        } else {
            console.log('✨ Connexion RÉUSSIE avec le nouveau mot de passe !');
            console.log('   Token:', loginData.session.access_token.substring(0, 15) + '...');
        }
    }
}

fixUser();
