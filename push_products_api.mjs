// Script robuste utilisant l'API REST Supabase
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Client } = pg;

// Client pour la base LOCAL (PostgreSQL)
const localClient = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

// Client pour Supabase DISTANT (API REST)
const supabaseUrl = 'https://lqchbfhlldvhqqyvzxkg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODY2MCwiZXhwIjoyMDgzMzk0NjYwfQ.J1lQRiwOUIx-w1DTZuCF-59XaMsXzpBrUh_8mqo_w4Y';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function pushProductsViaAPI() {
    try {
        console.log('🔌 Connecting to LOCAL database...');
        await localClient.connect();
        console.log('✅ Connected to LOCAL');

        // Get all products from local
        const result = await localClient.query(`
      SELECT * FROM public.products ORDER BY created_at;
    `);

        console.log(`📦 Found ${result.rows.length} products to push via API`);

        if (result.rows.length === 0) {
            console.log('⚠️ No products to push');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const product of result.rows) {
            try {
                // Use Supabase upsert (insert or update)
                const { data, error } = await supabase
                    .from('products')
                    .upsert(product, {
                        onConflict: 'id'
                    });

                if (error) throw error;

                successCount++;
                console.log(`✅ [${successCount}/${result.rows.length}] ${product.name}`);
            } catch (err) {
                errorCount++;
                console.error(`❌ Error pushing "${product.name}":`, err.message);
            }
        }

        console.log('\n🎉 PUSH COMPLETED!');
        console.log(`✅ Success: ${successCount} products`);
        if (errorCount > 0) {
            console.log(`❌ Errors: ${errorCount} products`);
        }

    } catch (err) {
        console.error('❌ Fatal Error:', err.message);
    } finally {
        await localClient.end();
    }
}

pushProductsViaAPI();
