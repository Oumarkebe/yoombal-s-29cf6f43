// Correction pour platform_settings (PK = key)
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

async function syncPlatformSettings() {
    try {
        await localClient.connect();

        // Platform Settings
        const result = await localClient.query(`SELECT * FROM public.platform_settings`);
        console.log(`📦 Pushing platform_settings (${result.rows.length} rows)...`);

        for (const row of result.rows) {
            const { error } = await supabase
                .from('platform_settings')
                .upsert(row, { onConflict: 'key' }); // Use correct PK

            if (error) console.error(`❌ Error:`, error.message);
            else console.log(`✅ Synced setting: ${row.key}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await localClient.end();
    }
}

syncPlatformSettings();
