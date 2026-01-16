import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalSync() {
    const email = 'client@gmail.com';

    console.log(`🔗 Synchronisation finale pour ${email}...`);

    const sql = `
    DO $$
    DECLARE
        v_user_id uuid;
    BEGIN
        -- 1. Récupérer l'ID de l'utilisateur dans auth.users
        SELECT id INTO v_user_id FROM auth.users WHERE email = '${email}' LIMIT 1;
        
        IF v_user_id IS NOT NULL THEN
            -- 2. Créer/Mettre à jour le profil
            INSERT INTO public.profiles (id, email, first_name, last_name, role, status)
            VALUES (v_user_id, '${email}', 'Client', 'Test', 'client', 'active')
            ON CONFLICT (id) DO UPDATE SET 
                role = 'client',
                status = 'active';
            
            -- 3. S'assurer qu'il a le rôle dans user_roles
            INSERT INTO public.user_roles (user_id, role)
            VALUES (v_user_id, 'client')
            ON CONFLICT (user_id, role) DO NOTHING;
        END IF;
    END $$;
  `;

    try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        if (error) throw error;

        console.log('✅ Synchronisation réussie via SQL direct !');
        console.log(`✨ Le compte ${email} est maintenant pleinement opérationnel sur la prod.`);
    } catch (err) {
        console.error('❌ Erreur:', err.message);
    }
}

finalSync();
