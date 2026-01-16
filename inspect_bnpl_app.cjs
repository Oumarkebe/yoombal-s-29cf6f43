const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();

        // Check columns of bnpl_applications
        const res = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'bnpl_applications'
    `);

        console.log("Columns in bnpl_applications:");
        res.rows.forEach(row => {
            console.log(`- ${row.column_name} (${row.data_type}) [Nullable: ${row.is_nullable}]`);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
