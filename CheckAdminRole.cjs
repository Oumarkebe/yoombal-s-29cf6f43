
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        const res = await client.query(`
          SELECT p.email, r.role 
          FROM public.profiles p
          LEFT JOIN public.user_roles r ON p.id = r.user_id
          WHERE p.email = 'yoombal28@gmail.com'
      `);
        console.log("Current Roles for yoombal28@gmail.com:");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
