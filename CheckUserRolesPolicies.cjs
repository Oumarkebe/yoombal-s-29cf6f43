
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Checking user_roles RLS policies...");
        const res = await client.query(`
          SELECT * FROM pg_policies WHERE tablename = 'user_roles'
      `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking app_role enum...");
        const enumRes = await client.query(`
          SELECT n.nspname as schema, t.typname as type 
          FROM pg_type t 
          JOIN pg_namespace n ON n.oid = t.typnamespace 
          WHERE t.typname = 'app_role'
      `);
        console.log(JSON.stringify(enumRes.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
