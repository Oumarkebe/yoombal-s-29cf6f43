
const { Client } = require('pg');

async function checkUserRoles() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('--- USER_ROLES DIAGNOSTIC ---');

        // Check table structure
        const resTable = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_roles'
        `);
        console.log('Columns:', resTable.rows);

        // Check unique constraints/indexes on user_id
        const resConstraints = await client.query(`
            SELECT conname, contype, pg_get_constraintdef(c.oid) as def
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE n.nspname = 'public' AND conrelid = 'public.user_roles'::regclass
        `);
        console.log('Constraints:', resConstraints.rows);

        const resIndexes = await client.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public' AND tablename = 'user_roles'
        `);
        console.log('Indexes:', resIndexes.rows);

    } catch (err) {
        console.error('Diagnostic error:', err);
    } finally {
        await client.end();
    }
}

checkUserRoles();
