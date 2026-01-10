
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Comparing users...");
        const res = await client.query(`
          SELECT 
            id, email, raw_app_meta_data, raw_user_meta_data, 
            is_super_admin, confirmed_at, instance_id, aud
          FROM auth.users 
          WHERE email IN ('yoombal28@gmail.com', 'testuser@example.com')
      `);
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("Checking identities...");
        const idRes = await client.query(`
          SELECT * FROM auth.identities 
          WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('yoombal28@gmail.com', 'testuser@example.com'))
      `);
        console.log(JSON.stringify(idRes.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
