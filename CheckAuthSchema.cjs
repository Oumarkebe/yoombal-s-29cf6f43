
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Checking auth schema tables...");
        const res = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'auth'
      `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking users in auth.users...");
        const users = await client.query("SELECT id, email, encrypted_password FROM auth.users");
        console.log(JSON.stringify(users.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
