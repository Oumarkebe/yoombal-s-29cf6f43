// Script final pour synchroniser TOUTES les tables restantes
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

// Liste des tables à synchroniser (ordre de dépendance)
const TABLES_TO_SYNC = [
    'user_roles',          // Pas de dépendance FK
    'platform_settings',   // Pas de dépendance FK
    'ai_module_settings',  // Pas de dépendance FK
    'delivery_zones',      // Pas de dépendance FK
    'premium_features',    // Pas de dépendance FK
    'premium_plans',       // Pas de dépendance FK
    'services',            // Pas de dépendance FK (si non vide)
    'user_ai_settings',    // Dépend de profiles (déjà sync)
    'reviews',             // Dépend de products/profiles (déjà sync)
    'cart',                // Dépend de products/profiles (déjà sync)
    'bnpl_applications',   // Dépend de profiles/products/orders
    'user_subscriptions',  // Dépend de profiles/plans
    'notifications',       // Dépend de profiles
    'ai_chat_logs'         // Dépend de profiles
];

async function syncRemainingTables() {
    try {
        await localClient.connect();
        console.log('✅ Connected to LOCAL database\n');

        let totalSuccess = 0;
        let totalErrors = 0;

        for (const tableName of TABLES_TO_SYNC) {
            console.log(`📦 Syncing table: ${tableName}`);

            const result = await localClient.query(`
        SELECT * FROM public.${tableName} ORDER BY created_at ASC;
      `);

            if (result.rows.length === 0) {
                console.log(`   ⚠️ Table empty (skipping)`);
                continue;
            }

            console.log(`   Found ${result.rows.length} rows`);

            let tableSuccess = 0;
            let tableErrors = 0;

            for (const row of result.rows) {
                try {
                    // On évite d'envoyer id si c'est généré, mais ici on veut cloner exactement donc on envoie tout
                    const { error } = await supabase
                        .from(tableName)
                        .upsert(row, { onConflict: 'id' });

                    if (error) {
                        // Ignorer les erreurs de FK si la donnée parent manque (cas rares ici car on a tout sync)
                        if (error.code === '23503') { // foreign_key_violation
                            console.warn(`   ⚠️ Skipped row due to missing dependency: ${error.details}`);
                        } else {
                            throw error;
                        }
                    } else {
                        tableSuccess++;
                    }
                } catch (err) {
                    tableErrors++;
                    console.error(`   ❌ Error:`, err.message);
                }
            }

            console.log(`   ✅ Synced: ${tableSuccess} | ❌ Failed: ${tableErrors}`);
            totalSuccess += tableSuccess;
            totalErrors += tableErrors;
        }

        console.log(`\n🎉 FINAL SYNC COMPLETED!`);
        console.log(`✅ Total Rows Synced: ${totalSuccess}`);
        console.log(`❌ Total Errors: ${totalErrors}`);

    } catch (err) {
        console.error('❌ Fatal Error:', err.message);
    } finally {
        await localClient.end();
    }
}

syncRemainingTables();
