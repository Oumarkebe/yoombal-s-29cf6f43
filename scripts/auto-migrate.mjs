
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load local environment variables
dotenv.config({ path: '.env' }); // Assuming .env exists for local

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.log('⚠️ SUPABASE_SERVICE_ROLE_KEY missing. Skip auto-migration.');
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
    console.log('🚀 Checking for new SQL migrations...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service Key length:', supabaseServiceKey?.length);

    // 1. Ensure tracking table exists
    await supabase.rpc('exec_sql', {
        sql_query: `
      CREATE TABLE IF NOT EXISTS public._migrations_log (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    }).catch(() => {
        // If RPC doesn't exist yet, we might need a different approach 
        // but for local Supabase, we can often use this if we setup the 'exec_sql' helper first.
    });

    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) return;

    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const { data: alreadyApplied } = await supabase
            .from('_migrations_log')
            .select('filename')
            .eq('filename', file)
            .maybeSingle();

        if (!alreadyApplied) {
            console.log(`📝 Applying migration: ${file}...`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

            if (error) {
                console.error(`❌ Error in ${file}:`, error.message);
            } else {
                await supabase.from('_migrations_log').insert({ filename: file });
                console.log(`✅ ${file} applied.`);
            }
        }
    }
}

applyMigrations();
