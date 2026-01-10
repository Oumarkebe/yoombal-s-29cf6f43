const { Client } = require('pg');

async function checkModules() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        const res = await client.query("SELECT key, is_enabled FROM ai_module_settings");
        console.log('AI Modules:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkModules();
