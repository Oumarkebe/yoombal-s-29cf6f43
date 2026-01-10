const { Client } = require('pg');

async function listAllFeatures() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        const res = await client.query("SELECT feature_key, name, category, is_enabled FROM premium_features");
        console.log('Total entries in premium_features:', res.rowCount);
        console.log('Features:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listAllFeatures();
