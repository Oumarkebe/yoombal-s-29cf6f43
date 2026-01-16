const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        // Add product_id column if not exists
        console.log("Adding product_id column...");
        await client.query(`
      ALTER TABLE public.bnpl_plans 
      ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;
    `);
        console.log("Column product_id added (or already exists).");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
