const { Client } = require('pg');
const fs = require('fs');

// Connexion à la base LOCAL pour récupérer les produits
const localClient = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

// Connexion à la base DISTANTE pour insérer les produits
const remoteClient = new Client({
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.lqchbfhlldvhqqyvzxkg',
    password: process.env.SUPABASE_DB_PASSWORD || 'Darousalam2828Touba',
    ssl: { rejectUnauthorized: false }
});

async function pushProductsToRemote() {
    try {
        console.log('🔌 Connecting to LOCAL database...');
        await localClient.connect();
        console.log('✅ Connected to LOCAL');

        console.log('🔌 Connecting to REMOTE Supabase database...');
        await remoteClient.connect();
        console.log('✅ Connected to REMOTE');

        // Get all products from local
        const result = await localClient.query(`
      SELECT * FROM public.products ORDER BY created_at;
    `);

        console.log(`📦 Found ${result.rows.length} products to push`);

        if (result.rows.length === 0) {
            console.log('⚠️ No products to push');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const product of result.rows) {
            try {
                // Insert or update each product
                await remoteClient.query(`
          INSERT INTO public.products (
            id, merchant_id, name, description, price, stock, image_url, category,
            status, created_at, updated_at, category_id, currency, video_url,
            gallery, brand, unit, sku, barcode, weight, tags, min_stock,
            ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
            bnpl_enabled, is_active, specs, compare_at_price, cost_price,
            download_url, condition, dimensions, features, images, published_at,
            min_order_quantity, wholesale_price, is_digital
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
            $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            stock = EXCLUDED.stock,
            image_url = EXCLUDED.image_url,
            updated_at = EXCLUDED.updated_at,
            is_active = EXCLUDED.is_active
        `, [
                    product.id, product.merchant_id, product.name, product.description,
                    product.price, product.stock, product.image_url, product.category,
                    product.status, product.created_at, product.updated_at, product.category_id,
                    product.currency, product.video_url, product.gallery, product.brand,
                    product.unit, product.sku, product.barcode, product.weight,
                    product.tags, product.min_stock, product.ai_description, product.ai_pricing_strategy,
                    product.seo_title, product.seo_description, product.slug, product.bnpl_enabled,
                    product.is_active, product.specs, product.compare_at_price, product.cost_price,
                    product.download_url, product.condition, product.dimensions, product.features,
                    product.images, product.published_at, product.min_order_quantity, product.wholesale_price,
                    product.is_digital
                ]);

                successCount++;
                console.log(`✅ [${successCount}/${result.rows.length}] ${product.name}`);
            } catch (err) {
                errorCount++;
                console.error(`❌ Error pushing product "${product.name}":`, err.message);
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
        await remoteClient.end();
    }
}

pushProductsToRemote();
