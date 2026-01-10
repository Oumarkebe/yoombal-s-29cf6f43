
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("--- Triggers on auth.users ---");
        const triggers = await client.query(`
          SELECT 
            tgname, 
            pg_get_triggerdef(oid) as definition
          FROM pg_trigger 
          WHERE tgrelid = 'auth.users'::regclass
      `);
        console.log(JSON.stringify(triggers.rows, null, 2));

        console.log("\n--- RLS Policies on platform_settings ---");
        const policies = await client.query(`
          SELECT * FROM pg_policies WHERE tablename = 'platform_settings'
      `);
        console.log(JSON.stringify(policies.rows, null, 2));

        console.log("\n--- Checking search_path ---");
        const searchPath = await client.query(`SHOW search_path`);
        console.log(JSON.stringify(searchPath.rows, null, 2));

        console.log("\n--- Checking for extensions ---");
        const extensions = await client.query(`SELECT extname FROM pg_extension`);
        console.log(JSON.stringify(extensions.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
