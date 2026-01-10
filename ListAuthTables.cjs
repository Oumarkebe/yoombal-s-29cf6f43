
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        const res = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'auth'
          ORDER BY table_name
      `);
        console.log("Auth Tables:");
        res.rows.forEach(r => console.log("- " + r.table_name));

        const res2 = await client.query(`
          SELECT count(*) FROM auth.users
      `);
        console.log("User count in auth.users:", res2.rows[0].count);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
