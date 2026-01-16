const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function exportFullSchema() {
  let sqlDump = `-- Supabase Full Schema Export
-- Generated: ${new Date().toISOString()}
-- Database: postgres (local)

BEGIN;

`;

  try {
    await client.connect();
    console.log('🔌 Connected to local database...');

    // 1. Export Tables
    console.log('📋 Exporting tables...');
    const tablesQuery = `
      SELECT 
        'CREATE TABLE ' || quote_ident(table_schema) || '.' || quote_ident(table_name) || ' (' ||
        string_agg(
          quote_ident(column_name) || ' ' || 
          CASE 
            WHEN data_type = 'ARRAY' THEN 
              CASE 
                WHEN udt_name LIKE '_%' THEN substring(udt_name from 2) || '[]'
                ELSE udt_name || '[]'
              END
            WHEN data_type = 'USER-DEFINED' THEN udt_name
            ELSE data_type 
          END ||
          CASE WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')' ELSE '' END ||
          CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END ||
          CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
          ', '
        ) || ');' as create_stmt
      FROM information_schema.columns
      WHERE table_schema = 'public'
      GROUP BY table_schema, table_name
      ORDER BY table_name;
    `;

    const tables = await client.query(tablesQuery);
    tables.rows.forEach(row => {
      sqlDump += row.create_stmt + '\n\n';
    });

    // 2. Export Primary Keys
    console.log('🔑 Exporting primary keys...');
    const pksQuery = `
      SELECT 
        'ALTER TABLE ' || quote_ident(tc.table_schema) || '.' || quote_ident(tc.table_name) ||
        ' ADD CONSTRAINT ' || quote_ident(tc.constraint_name) ||
        ' PRIMARY KEY (' || string_agg(quote_ident(kcu.column_name), ', ') || ');' as stmt
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
      GROUP BY tc.table_schema, tc.table_name, tc.constraint_name
      ORDER BY tc.table_name;
    `;

    const pks = await client.query(pksQuery);
    if (pks.rows.length > 0) {
      sqlDump += '-- Primary Keys\n';
      pks.rows.forEach(row => {
        sqlDump += row.stmt + '\n';
      });
      sqlDump += '\n';
    }

    // 3. Export Foreign Keys
    console.log('🔗 Exporting foreign keys...');
    const fksQuery = `
      SELECT 
        'ALTER TABLE ' || quote_ident(tc.table_schema) || '.' || quote_ident(tc.table_name) ||
        ' ADD CONSTRAINT ' || quote_ident(tc.constraint_name) ||
        ' FOREIGN KEY (' || kcu.column_name || ')' ||
        ' REFERENCES ' || quote_ident(ccu.table_schema) || '.' || quote_ident(ccu.table_name) ||
        '(' || ccu.column_name || ')' ||
        CASE WHEN rc.delete_rule != 'NO ACTION' THEN ' ON DELETE ' || rc.delete_rule ELSE '' END ||
        CASE WHEN rc.update_rule != 'NO ACTION' THEN ' ON UPDATE ' || rc.update_rule ELSE '' END ||
        ';' as stmt
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      JOIN information_schema.referential_constraints rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;

    const fks = await client.query(fksQuery);
    if (fks.rows.length > 0) {
      sqlDump += '-- Foreign Keys\n';
      fks.rows.forEach(row => {
        sqlDump += row.stmt + '\n';
      });
      sqlDump += '\n';
    }

    // 4. Export Indexes
    console.log('📇 Exporting indexes...');
    const indexesQuery = `
      SELECT indexdef || ';' as stmt
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname NOT LIKE '%_pkey'
      ORDER BY tablename, indexname;
    `;

    const indexes = await client.query(indexesQuery);
    if (indexes.rows.length > 0) {
      sqlDump += '-- Indexes\n';
      indexes.rows.forEach(row => {
        sqlDump += row.stmt + '\n';
      });
      sqlDump += '\n';
    }

    // 5. Export Functions (exclude C language functions from extensions)
    console.log('⚙️ Exporting functions...');
    const functionsQuery = `
      SELECT 
        'CREATE OR REPLACE FUNCTION ' || quote_ident(n.nspname) || '.' || quote_ident(p.proname) ||
        '(' || pg_get_function_arguments(p.oid) || ') ' ||
        'RETURNS ' || pg_get_function_result(p.oid) || ' AS $' || '$' ||
        E'\n' || p.prosrc || E'\n' ||
        '$' || '$ LANGUAGE ' || l.lanname ||
        CASE WHEN p.provolatile = 'i' THEN ' IMMUTABLE' 
             WHEN p.provolatile = 's' THEN ' STABLE' ELSE '' END ||
        CASE WHEN p.proisstrict THEN ' STRICT' ELSE '' END ||
        CASE WHEN p.prosecdef THEN ' SECURITY DEFINER' ELSE '' END ||
        ';' as stmt
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      JOIN pg_language l ON l.oid = p.prolang
      WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        AND l.lanname NOT IN ('c', 'internal')  -- Exclude C and internal functions
      ORDER BY p.proname;
    `;

    const functions = await client.query(functionsQuery);
    if (functions.rows.length > 0) {
      sqlDump += '-- Functions\n';
      functions.rows.forEach(row => {
        sqlDump += row.stmt + '\n\n';
      });
    }

    // 6. Export Triggers
    console.log('🎯 Exporting triggers...');
    const triggersQuery = `
      SELECT 
        'CREATE TRIGGER ' || quote_ident(t.tgname) ||
        ' ' || CASE WHEN t.tgtype & 2 = 2 THEN 'BEFORE' ELSE 'AFTER' END ||
        ' ' || CASE 
          WHEN t.tgtype & 4 = 4 THEN 'INSERT'
          WHEN t.tgtype & 8 = 8 THEN 'DELETE'
          WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
        END ||
        ' ON ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) ||
        ' FOR EACH ROW EXECUTE FUNCTION ' || 
        quote_ident(pn.nspname) || '.' || quote_ident(p.proname) || '();' as stmt
      FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_proc p ON p.oid = t.tgfoid
      JOIN pg_namespace pn ON pn.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND NOT t.tgisinternal
      ORDER BY c.relname, t.tgname;
    `;

    const triggers = await client.query(triggersQuery);
    if (triggers.rows.length > 0) {
      sqlDump += '-- Triggers\n';
      triggers.rows.forEach(row => {
        sqlDump += row.stmt + '\n';
      });
      sqlDump += '\n';
    }

    // 7. Export RLS Policies
    console.log('🔒 Exporting RLS policies...');
    const rlsQuery = `
      SELECT 
        'ALTER TABLE ' || quote_ident(schemaname) || '.' || quote_ident(tablename) ||
        ' ENABLE ROW LEVEL SECURITY;' as enable_stmt,
        'CREATE POLICY ' || quote_ident(policyname) ||
        ' ON ' || quote_ident(schemaname) || '.' || quote_ident(tablename) ||
        ' FOR ' || cmd ||
        CASE WHEN roles IS NOT NULL THEN ' TO ' || array_to_string(roles, ', ') ELSE '' END ||
        CASE WHEN qual IS NOT NULL THEN ' USING (' || qual || ')' ELSE '' END ||
        CASE WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')' ELSE '' END ||
        ';' as policy_stmt,
        tablename
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;

    const rls = await client.query(rlsQuery);
    if (rls.rows.length > 0) {
      sqlDump += '-- Row Level Security\n';
      let lastTable = '';
      rls.rows.forEach(row => {
        if (row.tablename !== lastTable) {
          sqlDump += row.enable_stmt + '\n';
          lastTable = row.tablename;
        }
        sqlDump += row.policy_stmt + '\n';
      });
      sqlDump += '\n';
    }

    sqlDump += 'COMMIT;\n';

    fs.writeFileSync('full_schema_export.sql', sqlDump);
    console.log('✅ Full schema exported to full_schema_export.sql');
    console.log(`📊 Exported: ${tables.rows.length} tables, ${pks.rows.length} PKs, ${fks.rows.length} FKs, ${indexes.rows.length} indexes, ${functions.rows.length} functions, ${triggers.rows.length} triggers, ${rls.rows.length} RLS policies`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

exportFullSchema();
