const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function exportSchema() {
    try {
        await client.connect();
        console.log('Connected to local database...');

        // Query to get the full schema dump
        const result = await client.query(`
      SELECT 
        'CREATE TABLE ' || quote_ident(table_name) || E' (\n' ||
        string_agg(
          '  ' || quote_ident(column_name) || ' ' || data_type ||
          CASE WHEN character_maximum_length IS NOT NULL 
               THEN '(' || character_maximum_length || ')' 
               ELSE '' END ||
          CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
          E',\n'
        ) || E'\n);'
      FROM information_schema.columns
      WHERE table_schema = 'public'
      GROUP BY table_name
      ORDER BY table_name;
    `);

        let sqlDump = `-- Supabase Schema Export - Generated ${new Date().toISOString()}\n\n`;

        result.rows.forEach(row => {
            sqlDump += row['?column?'] + '\n\n';
        });

        fs.writeFileSync('schema_export.sql', sqlDump);
        console.log('✅ Schema exported to schema_export.sql');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

exportSchema();
