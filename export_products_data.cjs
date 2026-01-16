const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function exportProductData() {
    try {
        await client.connect();
        console.log('🔌 Connected to local database...');

        // Get all products with their related data
        const result = await client.query(`
      SELECT 
        id, merchant_id, name, description, price, stock, image_url, category,
        status, created_at, updated_at, category_id, currency, video_url,
        gallery, brand, unit, sku, barcode, weight, tags, min_stock,
        ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
        bnpl_enabled, is_active, specs, compare_at_price, cost_price,
        download_url, condition, dimensions, features, images, published_at,
        min_order_quantity, wholesale_price, is_digital
      FROM public.products
      ORDER BY created_at;
    `);

        console.log(`📦 Found ${result.rows.length} products to export`);

        if (result.rows.length === 0) {
            console.log('⚠️ No products found in local database');
            return;
        }

        let sqlInserts = `-- Products Data Export
-- Generated: ${new Date().toISOString()}
-- Total products: ${result.rows.length}

BEGIN;

`;

        result.rows.forEach((row, index) => {
            // Escape single quotes in text fields
            const escape = (val) => {
                if (val === null || val === undefined) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                if (typeof val === 'boolean') return val ? 'true' : 'false';
                if (Array.isArray(val)) return `ARRAY[${val.map(v => `'${v.replace(/'/g, "''")}'`).join(', ')}]`;
                if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
                return val;
            };

            sqlInserts += `
-- Product ${index + 1}: ${row.name}
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  ${escape(row.id)}, ${escape(row.merchant_id)}, ${escape(row.name)}, ${escape(row.description)},
  ${escape(row.price)}, ${escape(row.stock)}, ${escape(row.image_url)}, ${escape(row.category)},
  ${escape(row.status)}, ${escape(row.created_at)}, ${escape(row.updated_at)}, ${escape(row.category_id)},
  ${escape(row.currency)}, ${escape(row.video_url)}, ${escape(row.gallery)}, ${escape(row.brand)},
  ${escape(row.unit)}, ${escape(row.sku)}, ${escape(row.barcode)}, ${escape(row.weight)},
  ${escape(row.tags)}, ${escape(row.min_stock)}, ${escape(row.ai_description)}, ${escape(row.ai_pricing_strategy)},
  ${escape(row.seo_title)}, ${escape(row.seo_description)}, ${escape(row.slug)}, ${escape(row.bnpl_enabled)},
  ${escape(row.is_active)}, ${escape(row.specs)}, ${escape(row.compare_at_price)}, ${escape(row.cost_price)},
  ${escape(row.download_url)}, ${escape(row.condition)}, ${escape(row.dimensions)}, ${escape(row.features)},
  ${escape(row.images)}, ${escape(row.published_at)}, ${escape(row.min_order_quantity)}, ${escape(row.wholesale_price)},
  ${escape(row.is_digital)}
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;

`;
        });

        sqlInserts += `
COMMIT;

SELECT 'Products data export completed: ${result.rows.length} products' as status;
`;

        fs.writeFileSync('products_data_export.sql', sqlInserts);
        console.log('✅ Products data exported to products_data_export.sql');
        console.log(`📊 Total: ${result.rows.length} products`);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

exportProductData();
