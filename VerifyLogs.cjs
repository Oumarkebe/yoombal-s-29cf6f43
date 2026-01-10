
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    try {
        console.log("Testing Admin Logs...");
        await client.query(`
          INSERT INTO public.admin_logs (action, target_id, details)
          VALUES ('VERIFICATION_TEST', 'system', '{"status": "ok"}')
      `);
        const res = await client.query("SELECT * FROM public.admin_logs WHERE action = 'VERIFICATION_TEST'");
        console.log("Log verified:", res.rows[0]);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
