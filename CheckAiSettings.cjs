const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPremiumFeatures() {
    const { data, error } = await supabase
        .from('premium_features')
        .select('*');

    if (error) {
        console.error('Error fetching premium features:', error);
        return;
    }

    console.log('Premium Features:');
    data.forEach(feature => {
        console.log(`- ${feature.feature_key}: ${feature.name} (Enabled: ${feature.is_enabled})`);
        console.log(`  Description: ${feature.description}`);
        console.log(`  Configuration: ${JSON.stringify(feature.configuration)}`);
    });
}

checkPremiumFeatures();
