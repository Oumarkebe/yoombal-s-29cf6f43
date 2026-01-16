import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalizeRemoteClient() {
    const email = 'client@gmail.com';
    const password = 'Touba28';

    try {
        console.log(`🚀 Finalisation du compte ${email}...`);

        // 1. Créer une fonction pour récupérer l'ID (car listUsers est bloqué)
        // On utilise exec_sql qu'on a créé au début
        console.log('🛠️ Création de la fonction de recherche...');
        await supabase.rpc('exec_sql', {
            sql_query: `
        CREATE OR REPLACE FUNCTION public.get_id_by_email(p_email text) 
        RETURNS uuid AS $$
          SELECT id FROM auth.users WHERE email = p_email LIMIT 1;
        $$ LANGUAGE sql SECURITY DEFINER;
      `
        });

        // 2. Appeler la fonction pour avoir l'ID
        console.log('🔍 Récupération de l\'ID...');
        const { data: userId, error: rpcError } = await supabase.rpc('get_id_by_email', { p_email: email });

        if (rpcError) throw rpcError;
        if (!userId) {
            console.log('ℹ️ Utilisateur non trouvé. Création de l\'utilisateur...');
            const { data: newData, error: createError } = await supabase.auth.admin.createUser({
                email, password, email_confirm: true
            });
            if (createError) throw createError;
            userId = newData.user.id;
        }

        console.log(`✅ ID: ${userId}`);

        // 3. Créer le profil et le rôle
        console.log('📝 Configuration du profil...');
        await supabase.from('profiles').upsert({
            id: userId,
            email: email,
            role: 'client',
            first_name: 'Client',
            last_name: 'Test',
            status: 'active'
        });

        await supabase.from('user_roles').upsert({
            user_id: userId,
            role: 'client'
        }, { onConflict: 'user_id,role' });

        console.log(`\n✨ TOUT EST PRÊT ! ✨`);
        console.log(`Email: ${email}\nPass: ${password}\nRôle: Client`);

    } catch (err) {
        console.error('❌ Erreur:', err.message);
    }
}

finalizeRemoteClient();
