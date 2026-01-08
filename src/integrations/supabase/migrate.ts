import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies dans .env');
}

async function applySQLStructure() {
  const sqlFilePath = path.resolve(__dirname, '../../supabase/init.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ sql: sqlContent }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erreur lors de l’application de la structure SQL:', error);
  } else {
    console.log('Structure SQL appliquée avec succès.');
  }
}

applySQLStructure();
