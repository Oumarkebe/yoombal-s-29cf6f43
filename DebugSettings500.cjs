
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Checking platform_settings schema...");
        const res = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'platform_settings'
      `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking RLS policies...");
        const policies = await client.query(`
          SELECT * FROM pg_policies WHERE tablename = 'platform_settings'
      `);
        console.log(JSON.stringify(policies.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
