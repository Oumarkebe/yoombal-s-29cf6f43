const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        // Check RLS policies on notifications
        const res = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'notifications';
    `);

        console.log("Policies on notifications table:");
        res.rows.forEach(row => {
            console.log(`- Policy: ${row.policyname}`);
            console.log(`  - Role: ${row.roles}`);
            console.log(`  - Command: ${row.cmd}`);
            console.log(`  - Using: ${row.qual}`);
            console.log(`  - With Check: ${row.with_check}`);
            console.log('---');
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
