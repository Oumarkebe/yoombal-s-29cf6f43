
const { Client } = require('pg');

async function debugDb() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
    });

    try {
        await client.connect();
        console.log('--- DB DIAGNOSTIC ---');

        // 1. Check ai_chat_sessions
        console.log('\nChecking ai_chat_sessions:');
        const aiTable = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'ai_chat_sessions'
            );
        `);
        console.log('Exists?', aiTable.rows[0].exists);

        if (aiTable.rows[0].exists) {
            const perms = await client.query(`
                SELECT grantee, privilege_type 
                FROM information_schema.role_table_grants 
                WHERE table_name = 'ai_chat_sessions';
            `);
            console.log('Permissions:', perms.rows.map(r => `${r.grantee}:${r.privilege_type}`).join(', '));
        }

        // 2. Check bnpl_plans columns
        console.log('\nChecking bnpl_plans columns:');
        const bnplCols = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'bnpl_plans';
        `);
        console.log('Columns:', bnplCols.rows.map(r => r.column_name).join(', '));

    } catch (err) {
        console.error('Diagnostic error:', err);
    } finally {
        await client.end();
    }
}

debugDb();
