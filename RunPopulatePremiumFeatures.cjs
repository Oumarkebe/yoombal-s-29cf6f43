
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    console.log("Connected to DB...");

    try {
        const sql = fs.readFileSync('PopulatePremiumFeaturesFull.sql', 'utf8');
        console.log("Populating Premium Features...");
        await client.query(sql);
        console.log("Premium features populated successfully.");

    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        await client.end();
    }
}

main();
