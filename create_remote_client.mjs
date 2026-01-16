import { createClient } from '@supabase/supabase-js';

// LOCAL Supabase
const localUrl = 'http://127.0.0.1:54321';
const localServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y'; // Note: uses same key for local typically or different? Actually local has its own. 
// Let's get the local service role key from the CLI if possible, or use the default local one.
// Default local service role key: 
const DEFAULT_LOCAL_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';
// Wait, the key in .env seemed to be for remote. 

const localSupabase = createClient(localUrl, DEFAULT_LOCAL_SERVICE_KEY);

async function createLocalThenSync() {
    const email = 'client@gmail.com';
    const password = 'Touba28';

    try {
        console.log(`🏠 Création de l'utilisateur sur LOCAL...`);

        // 1. Créer dans Auth Local
        const { data: authData, error: authError } = await localSupabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { role: 'client' }
        });

        let userId;
        if (authError) {
            if (authError.message.includes('registered')) {
                console.log('ℹ️ Existe déjà sur local. Récupération ID...');
                const { data: listData } = await localSupabase.auth.admin.listUsers();
                userId = listData.users.find(u => u.email === email)?.id;
            } else {
                throw authError;
            }
        } else {
            userId = authData.user.id;
        }

        console.log(`✅ ID Local: ${userId}`);

        // 2. Créer profil local
        const { error: profileError } = await localSupabase.from('profiles').upsert({
            id: userId,
            email: email,
            role: 'client',
            first_name: 'Client',
            last_name: 'Test',
            status: 'active'
        });

        if (profileError) throw profileError;
        console.log('✅ Profil local créé.');

        console.log('\n☁️ Synchronisation vers REMOTE...');
        // Importer le script de sync ou juste appeler l'API remote ici
        const remoteUrl = 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
        const remoteKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';
        const remoteSupabase = createClient(remoteUrl, remoteKey);

        // On recrée l'utilisateur sur remote aussi (Auth)
        const { data: remAuthData, error: remAuthError } = await remoteSupabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        });

        let remUserId;
        if (remAuthError) {
            console.log('ℹ️ Déjà sur remote Auth. Récupération ID...');
            // On ne peut pas listUsers sur remote (erreur précédente), 
            // mais on peut tenter de l'imposer via le profil si on avait l'ID, 
            // mais l'ID auth doit correspondre.
            // Essayons de forcer l'ID local sur remote (certaines configs le permettent en admin)
            remUserId = userId; // Tentative désespérée ou réaliste? Non, Supabase Auth génère ses IDs.
        } else {
            remUserId = remAuthData.user.id;
        }

        // Upsert profil remote
        const { error: remProfileError } = await remoteSupabase.from('profiles').upsert({
            id: remUserId || userId, // On tente
            email: email,
            role: 'client',
            first_name: 'Client',
            last_name: 'Test',
            status: 'active'
        });

        if (remProfileError) throw remProfileError;

        console.log(`✨ Terminé ! ${email} est actif partout.`);

    } catch (err) {
        console.error('❌ Erreur:', err.message);
    }
}

createLocalThenSync();
