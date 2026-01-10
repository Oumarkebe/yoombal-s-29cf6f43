
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Checking search_path for roles...");
        const res = await client.query(`
          SELECT rolname, rolconfig 
          FROM pg_roles 
          WHERE rolname IN ('authenticator', 'supabase_admin', 'postgres', 'anon', 'authenticated')
      `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking extensions...");
        const extRes = await client.query("SELECT extname, extnamespace::regnamespace FROM pg_extension");
        console.log(JSON.stringify(extRes.rows, null, 2));

        console.log("Checking search_path for current connection...");
        const spRes = await client.query("SHOW search_path");
        console.log(JSON.stringify(spRes.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
