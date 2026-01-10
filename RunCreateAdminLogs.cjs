
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    console.log("Connected to DB...");

    try {
        const sql = fs.readFileSync('CreateAdminLogs.sql', 'utf8');
        console.log("Creating Admin Logs Table...");
        await client.query(sql);
        console.log("Admin logs table created successfully.");

    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        await client.end();
    }
}

main();
