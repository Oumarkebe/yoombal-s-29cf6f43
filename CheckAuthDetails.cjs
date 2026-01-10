
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("--- Rows in auth.instances ---");
        const instances = await client.query(`SELECT * FROM auth.instances`);
        console.log(JSON.stringify(instances.rows, null, 2));

        console.log("\n--- Profile for yoombal28@gmail.com ---");
        const profile = await client.query(`SELECT * FROM public.profiles WHERE email = 'yoombal28@gmail.com'`);
        console.log(JSON.stringify(profile.rows, null, 2));

        console.log("\n--- Checking if authenticated role exists ---");
        const roles = await client.query(`SELECT rolname FROM pg_roles WHERE rolname IN ('authenticated', 'anon', 'service_role')`);
        console.log(JSON.stringify(roles.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
