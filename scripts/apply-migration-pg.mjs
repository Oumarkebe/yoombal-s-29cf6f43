
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const password = process.env.SUPABASE_DB_PASSWORD;
const projectId = process.env.VITE_SUPABASE_PROJECT_ID || 'lqchbfhlldvhqqyvzxkg';
const host = `db.${projectId}.supabase.co`;

if (!password) {
    console.error('Error: SUPABASE_DB_PASSWORD must be defined in .env');
    process.exit(1);
}

const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres`;

async function applyMigration(filePath) {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const fullPath = path.resolve(filePath);
        console.log(`Reading migration file: ${fullPath}`);
        const sql = fs.readFileSync(fullPath, 'utf8');

        console.log(`Connecting to database at ${host}...`);
        await client.connect();
        console.log('Connected! Applying migration...');

        await client.query(sql);

        console.log('Migration applied successfully!');
    } catch (err) {
        console.error('Failed to execute migration:', err.message);
    } finally {
        await client.end();
    }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
    console.error('Error: Please provide a migration file path.');
    process.exit(1);
}

applyMigration(migrationFile);
