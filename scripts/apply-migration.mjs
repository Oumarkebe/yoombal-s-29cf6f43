
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration(filePath) {
    try {
        const fullPath = path.resolve(filePath);
        console.log(`Reading migration file: ${fullPath}`);
        const sql = fs.readFileSync(fullPath, 'utf8');

        console.log('Applying migration to Supabase...');

        // Note: This requires a 'exec_sql' or 'execute_sql' RPC in Supabase 
        // or we can try to split the queries if the RPC is not available.
        // However, in this project, we've seen references to execute_sql.
        // Alternatively, we can use the raw postgres connection if available, 
        // but here we use the REST API as typical for this setup.

        const { error } = await supabase.rpc('execute_sql', { sql: sql });

        if (error) {
            // If execute_sql RPC doesn't exist, we might get an error.
            // Let's try to see if we can use a more direct approach if needed.
            console.error('Error applying migration via RPC:', error);

            if (error.message.includes('permission denied') || error.message.includes('not found')) {
                console.warn('Fallback: The "execute_sql" RPC might be missing or restricted.');
                console.warn('Please execute the SQL manually in the Supabase Dashboard SQL Editor:');
                console.log('--------------------------------------------------');
                console.log(sql);
                console.log('--------------------------------------------------');
            }
            return;
        }

        console.log('Migration applied successfully!');
    } catch (err) {
        console.error('Failed to execute migration:', err.message);
    }
}

const migrationFile = process.argv[2] || 'supabase/migrations/20260118000000_seed_categories.sql';
applyMigration(migrationFile);
