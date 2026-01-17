
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyAiSettings() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('Applying AI Settings SQL...');

        const sql = fs.readFileSync('create_ai_settings.sql', 'utf8');
        await client.query(sql);
        console.log('AI Settings table created.');

        await client.query("NOTIFY pgrst, 'reload schema'");
        console.log('Schema reloaded.');

    } catch (err) {
        console.error('Error applying SQL:', err);
    } finally {
        await client.end();
    }
}

applyAiSettings();
