import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Credentials - Prioritize Environment Variables for security
const url = process.env.SUPABASE_URL || 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
    console.error('❌ Erreur: SUPABASE_SERVICE_ROLE_KEY manquante dans l\'environnement.')
    process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
})

async function syncRemote() {
    const filePath = process.argv[2]
    if (!filePath) {
        console.error('❌ Erreur: Veuillez fournir le chemin du fichier SQL en argument.')
        process.exit(1)
    }

    const absolutePath = resolve(filePath)
    if (!existsSync(absolutePath)) {
        console.error(`❌ Erreur: Fichier introuvable à l'adresse ${absolutePath}`)
        process.exit(1)
    }

    console.log(`\n🔧 Synchronisation de la migration: ${filePath} ...\n`)

    try {
        const migrationSQL = readFileSync(absolutePath, 'utf-8')

        const { error } = await supabase.rpc('exec_sql', {
            sql_query: migrationSQL
        })

        if (error) {
            console.error('❌ Erreur Supabase:', error.message)
            console.log('\n💡 Conseil: Vérifiez la syntaxe SQL ou exécutez le script dans le SQL Editor de Supabase.')
            process.exit(1)
        }

        console.log('✅ Migration appliquée avec succès sur l\'instance distante!')
    } catch (error) {
        console.error('❌ Erreur d\'exécution:', error.message)
        process.exit(1)
    }
}

syncRemote()
