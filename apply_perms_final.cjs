
const { Client } = require('pg');
const fs = require('fs');

async function applyPerms() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        const sql = fs.readFileSync('fix_perms_final.sql', 'utf8');
        await client.query(sql);
        console.log('Permissions updated and schema reloaded.');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
applyPerms();
