const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSql() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sql = fs.readFileSync('ActivateAiFeatures.sql', 'utf8');

        // Execute SQL block
        await client.query(sql);
        console.log('SQL executed successfully.');

        // Verification
        const res1 = await client.query("SELECT feature_key, is_enabled FROM premium_features WHERE feature_key IN ('ai_pricing', 'ai_analytics', 'ai_vision')");
        console.log('Premium Features Status:');
        res1.rows.forEach(row => console.log(`- ${row.feature_key}: ${row.is_enabled}`));

        const res2 = await client.query("SELECT key, is_enabled FROM ai_module_settings WHERE key IN ('pricing', 'predictions')");
        console.log('AI Module Settings Status:');
        res2.rows.forEach(row => console.log(`- ${row.key}: ${row.is_enabled}`));

    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

runSql();
