const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function checkCounts() {
    try {
        await client.connect();
        const query = `
      SELECT table_name, 
             (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I', table_name), false, true, '')))[1]::text::int as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE' 
      ORDER BY table_name
    `;
        const res = await client.query(query);
        console.log('Row counts:');
        res.rows.forEach(row => {
            if (row.count > 0) console.log(`  ${row.table_name}: ${row.count}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkCounts();
