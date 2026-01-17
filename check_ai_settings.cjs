
const { Client } = require('pg');

async function checkAiSettings() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('--- AI SETTINGS DIAGNOSTIC ---');

        const resTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('user_ai_feature_settings', 'premium_features')
        `);
        console.log('Tables found:', resTables.rows.map(r => r.table_name));

    } catch (err) {
        console.error('Diagnostic error:', err);
    } finally {
        await client.end();
    }
}

checkAiSettings();
