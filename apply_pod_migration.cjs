
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
    });

    try {
        await client.connect();

        const sql = fs.readFileSync(path.join(__dirname, 'add_delivery_proofs.sql'), 'utf8');
        console.log('Applying POD migration...');

        await client.query(sql);
        console.log('Migration applied successfully!');

    } catch (err) {
        console.error('Error applying migration:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
