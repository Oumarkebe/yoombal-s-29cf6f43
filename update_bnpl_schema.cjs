const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        const queries = [
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS applicant_phone TEXT;`,
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS applicant_id_number TEXT;`,
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS id_card_url TEXT;`,
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS photo_url TEXT;`,
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS contract_signed_at TIMESTAMP WITH TIME ZONE;`,
            `ALTER TABLE public.bnpl_applications ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;`,
        ];

        for (const q of queries) {
            await client.query(q);
            console.log(`Executed: ${q}`);
        }

        console.log("All columns added successfully.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
