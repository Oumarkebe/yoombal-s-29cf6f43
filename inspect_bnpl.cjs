const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        // Check columns
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bnpl_plans'
    `);

        console.log("Columns in bnpl_plans:");
        res.rows.forEach(row => {
            console.log(`- ${row.column_name} (${row.data_type})`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
