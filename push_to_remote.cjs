const { Client } = require('pg');
const fs = require('fs');

// Connexion à la base DISTANTE Supabase
const client = new Client({
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.lqchbfhlldvhqqyvzxkg',
    password: process.env.SUPABASE_DB_PASSWORD || 'Darousalam2828Touba',
    ssl: { rejectUnauthorized: false }
});

async function pushSchema() {
    try {
        console.log('🔌 Connecting to remote Supabase database...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('📖 Reading schema file...');
        const sql = fs.readFileSync('full_schema_export.sql', 'utf8');

        console.log('🚀 Executing schema (this may take a while)...');
        await client.query(sql);

        console.log('✅ Schema successfully applied to remote database!');
        console.log('🎉 Your remote database is now in sync with local!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code) console.error('Error code:', err.code);
    } finally {
        await client.end();
    }
}

pushSchema();
