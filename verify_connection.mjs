
import { createClient } from '@supabase/supabase-js'

const url = 'https://lqchbfhlldvhqqyvzxkg.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2hiZmhsbGR2aHFxeXZ6eGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg2NjAsImV4cCI6MjA4MzM5NDY2MH0.3CZHDPBR_LajO8XAJRddjWNO-Qv_SSIIrHXsvZS4AMA'

console.log('🔁 Test de connexion à Supabase...')
console.log('URL:', url)

const supabase = createClient(url, key)

async function testConnection() {
    try {
        // Essai de lecture simple (table products)
        const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('❌ ECHEC DE LA CONNEXION :')
            console.error(error.message)
            console.log('Astuce : Vérifiez si la clé est expirée ou si les URLS correspondent.')
        } else {
            console.log('✅ SUCCÈS ! La clé API est VALIDE.')
            console.log('La connexion au serveur Supabase fonctionne.')
            console.log(`Accès à la table 'products' OK.`)
        }
    } catch (err) {
        console.error('❌ Erreur inattendue :', err)
    }
}

testConnection()
