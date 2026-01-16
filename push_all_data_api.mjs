// Script robuste pour pusher TOUTES les données (categories + products + profiles)
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

async function pushTable(tableName, orderBy = 'created_at') {
    console.log(`\n📦 Pushing table: ${tableName}`);

    const result = await localClient.query(`
    SELECT * FROM public.${tableName} ORDER BY ${orderBy};
  `);

    console.log(`   Found ${result.rows.length} rows`);

    if (result.rows.length === 0) {
        console.log('   ⚠️ No data to push');
        return { success: 0, errors: 0 };
    }

    let successCount = 0;
    let errorCount = 0;

    for (const row of result.rows) {
        try {
            const { error } = await supabase
                .from(tableName)
                .upsert(row, { onConflict: 'id' });

            if (error) throw error;
            successCount++;
        } catch (err) {
            errorCount++;
            console.error(`   ❌ Error:`, err.message);
        }
    }

    console.log(`   ✅ Success: ${successCount} | ❌ Errors: ${errorCount}`);
    return { success: successCount, errors: errorCount };
}

async function pushAllData() {
    try {
        await localClient.connect();
        console.log('✅ Connected to LOCAL database');

        const stats = {
            totalSuccess: 0,
            totalErrors: 0
        };

        // Ordre important: d'abord les tables sans dépendances, puis celles avec FK

        // 1. Categories (pas de dépendance)
        const catStats = await pushTable('categories');
        stats.totalSuccess += catStats.success;
        stats.totalErrors += catStats.errors;

        // 2. Profiles (produits ont FK vers merchant_id qui est dans profiles)
        // Note: On push seulement les marchands qui ont des produits
        console.log(`\n📦 Pushing table: profiles (merchants only)`);
        const merchantsResult = await localClient.query(`
      SELECT DISTINCT p.* 
      FROM public.profiles p
      INNER JOIN public.products pr ON pr.merchant_id = p.id
      ORDER BY p.created_at;
    `);

        console.log(`   Found ${merchantsResult.rows.length} merchant profiles`);
        let profileSuccess = 0;
        let profileErrors = 0;

        for (const row of merchantsResult.rows) {
            try {
                const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
                if (error) throw error;
                profileSuccess++;
            } catch (err) {
                profileErrors++;
                console.error(`   ❌ Error:`, err.message);
            }
        }

        console.log(`   ✅ Success: ${profileSuccess} | ❌ Errors: ${profileErrors}`);
        stats.totalSuccess += profileSuccess;
        stats.totalErrors += profileErrors;

        // 3. Products (dépend de categories et profiles)
        const prodStats = await pushTable('products');
        stats.totalSuccess += prodStats.success;
        stats.totalErrors += prodStats.errors;

        console.log(`\n\n🎉 PUSH COMPLETED!`);
        console.log(`✅ Total Success: ${stats.totalSuccess}`);
        console.log(`❌ Total Errors: ${stats.totalErrors}`);

    } catch (err) {
        console.error('❌ Fatal Error:', err.message);
    } finally {
        await localClient.end();
    }
}

pushAllData();
