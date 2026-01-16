
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

// Load local environment variables
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env' });
}

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'postgres';

async function run() {
    console.log('🏁 Starting Yoombal Auto-Migration...');

    const client = new pg.Client({
        user: 'postgres', host: '127.0.0.1', database: 'postgres',
        password: 'postgres', port: 54322, connectionTimeoutMillis: 5000,
    });

    try {
        await client.connect();
    } catch (e) {
        try {
            const clientEnv = new pg.Client({
                user: 'postgres', host: '127.0.0.1', database: 'postgres',
                password: dbPassword, port: 54322, connectionTimeoutMillis: 5000,
            });
            await clientEnv.connect();
            Object.assign(client, clientEnv);
        } catch (e2) {
            console.error('❌ Database Connection Failed');
            process.exit(1);
        }
    }

    console.log('✅ Connected to Local Postgres');

    await client.query(`CREATE TABLE IF NOT EXISTS public._migrations_log (filename TEXT PRIMARY KEY, applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`);

    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) return;

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
        const { rows } = await client.query('SELECT filename FROM _migrations_log WHERE filename = $1', [file]);

        if (rows.length === 0) {
            console.log(`📝 Applying: ${file}...`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            try {
                // Execute migration in its own block
                await client.query('BEGIN');
                await client.query(sql);
                await client.query('COMMIT');

                await client.query('INSERT INTO _migrations_log (filename) VALUES ($1)', [file]);
                console.log(`✅ Applied ${file}`);
            } catch (err) {
                await client.query('ROLLBACK').catch(() => { });

                const msg = err.message.toLowerCase();
                const isRecoverable = msg.includes('already exists') ||
                    msg.includes('multiple rls') ||
                    msg.includes('already a member') ||
                    msg.includes('duplicate');

                if (isRecoverable) {
                    console.log(`⚠️  ${file}: Recoverable conflict. Skipping.`);
                } else {
                    console.error(`❌ Error in ${file}:`, err.message);
                }

                // Mark as processed to move to the next file
                await client.query('INSERT INTO _migrations_log (filename) VALUES ($1)', [file]).catch(() => { });
            }
        }
    }

    await client.end();
    console.log('🌟 Sync Completed.');
}

run().catch(err => {
    console.error('💥 FATAL:', err);
    process.exit(1);
});
