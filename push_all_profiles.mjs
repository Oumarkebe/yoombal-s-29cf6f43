// Script pour vérifier et pousser TOUS les profils utilisateurs
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Client } = pg;

const localClient = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

const supabaseUrl = 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function pushAllProfiles() {
    try {
        await localClient.connect();
        console.log('✅ Connected to LOCAL database\n');

        // Vérifier combien de profils par rôle
        const statsResult = await localClient.query(`
      SELECT role, COUNT(*) as count 
      FROM profiles 
      GROUP BY role 
      ORDER BY role;
    `);

        console.log('📊 Profils dans la base locale:');
        statsResult.rows.forEach(row => {
            console.log(`   ${row.role || 'NULL'}: ${row.count}`);
        });

        // Récupérer TOUS les profils
        const result = await localClient.query(`
      SELECT * FROM public.profiles ORDER BY created_at;
    `);

        console.log(`\n📦 Pushing ${result.rows.length} profiles to remote...`);

        let successCount = 0;
        let errorCount = 0;

        for (const profile of result.rows) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert(profile, { onConflict: 'id' });

                if (error) throw error;
                successCount++;
                console.log(`✅ [${successCount}/${result.rows.length}] ${profile.role}: ${profile.first_name} ${profile.last_name || ''}`);
            } catch (err) {
                errorCount++;
                console.error(`❌ Error pushing ${profile.role}:`, err.message);
            }
        }

        console.log(`\n🎉 PUSH COMPLETED!`);
        console.log(`✅ Success: ${successCount} profiles`);
        if (errorCount > 0) {
            console.log(`❌ Errors: ${errorCount} profiles`);
        }

    } catch (err) {
        console.error('❌ Fatal Error:', err.message);
    } finally {
        await localClient.end();
    }
}

pushAllProfiles();
