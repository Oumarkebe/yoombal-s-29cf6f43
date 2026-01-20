import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

// 1. Configuration des environnements
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const localClient = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    connectionTimeoutMillis: 5000,
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables de données à synchroniser (dans l'ordre des dépendances)
const DATA_TABLES = [
    { name: 'categories', pk: 'id' },
    { name: 'profiles', pk: 'id' },
    { name: 'platform_settings', pk: 'key' },
    { name: 'delivery_zones', pk: 'id' },
    { name: 'premium_features', pk: 'id' },
    { name: 'premium_plans', pk: 'id' },
    { name: 'products', pk: 'id' },
    { name: 'user_roles', pk: 'user_id,role' },
    { name: 'ai_module_settings', pk: 'id' },
    { name: 'user_ai_settings', pk: 'id' },
    { name: 'notifications', pk: 'id' }
];

async function runSync() {
    console.log('🚀 Démarrage de la Synchronisation Remote Yoombal...');

    const isGithubAction = process.env.GITHUB_ACTIONS === 'true';

    try {
        if (!isGithubAction) {
            await localClient.connect();
            console.log('✅ Connecté à la base locale');
        } else {
            console.log('🤖 Exécution via GitHub Actions - Mode SCHÉMA uniquement');
        }

        // phase 1: Schéma (Migrations)
        console.log('\n📂 Phase 1: Vérification du Schéma (Migrations)...');

        await supabase.rpc('exec_sql', {
            sql_query: `CREATE TABLE IF NOT EXISTS public._migrations_log (filename TEXT PRIMARY KEY, applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`
        });

        const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
        if (fs.existsSync(migrationsDir)) {
            const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

            for (const file of files) {
                const { data: existing } = await supabase
                    .from('_migrations_log')
                    .select('filename')
                    .eq('filename', file)
                    .single();

                if (!existing) {
                    console.log(`📝 Application de la migration: ${file}...`);
                    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

                    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

                    if (error) {
                        const msg = error.message.toLowerCase();
                        if (msg.includes('already exists') || msg.includes('duplicate')) {
                            console.log(`⚠️  ${file}: Déjà appliqué manuellement ou conflit mineur. Ignoré.`);
                        } else {
                            console.error(`❌ Erreur dans ${file}:`, error.message);
                        }
                    } else {
                        console.log(`✅ Appliqué ${file}`);
                    }

                    // Log quoi qu'il arrive pour ne plus retenter
                    await supabase.from('_migrations_log').upsert({ filename: file });
                }
            }
        }

        // Phase 2: Données
        if (!isGithubAction) {
            console.log('\n📦 Phase 2: Synchronisation des Données...');
            for (const table of DATA_TABLES) {
                console.log(`🔄 Table: ${table.name}...`);
                try {
                    const localResult = await localClient.query(`SELECT * FROM public.${table.name}`);

                    if (localResult.rows.length === 0) {
                        console.log(`   ℹ️ Vide localement.`);
                        continue;
                    }

                    let success = 0;
                    for (const row of localResult.rows) {
                        const { error } = await supabase
                            .from(table.name)
                            .upsert(row, { onConflict: table.pk });

                        if (!error) success++;
                    }
                    console.log(`   ✅ ${success}/${localResult.rows.length} lignes synchronisées.`);
                } catch (tableErr) {
                    console.error(`   ❌ Erreur sur la table ${table.name}:`, tableErr.message);
                }
            }
        } else {
            console.log('\n📦 Phase 2: Synchronisation des Données SKIP (GitHub Actions)');
        }

        console.log('\n✨ Synchronisation Remote terminée avec succès !');

    } catch (err) {
        console.error('\n💥 Erreur Fatale:', err.message);
    } finally {
        if (!isGithubAction) {
            await localClient.end().catch(() => { });
        }
    }
}


runSync();
