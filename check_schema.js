
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking schema...");

    // Check if products table exists and get its columns (indirectly by selecting one row)
    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (productsError) {
        console.error('Error fetching products:', productsError);
    } else {
        console.log('Products columns:', productsData && productsData.length > 0 ? Object.keys(productsData[0]) : 'Table empty or no data');
    }

    // Check relationship
    const { data: relData, error: relError } = await supabase
        .from('products')
        .select(`
            *,
            profiles!merchant_id (business_name)
        `)
        .limit(1);

    if (relError) {
        console.error('Relationship Error (profiles!merchant_id):', relError);
        // Try default relationship
        const { error: relError2 } = await supabase
            .from('products')
            .select(`
                *,
                profiles (business_name)
            `)
            .limit(1);
        if (relError2) {
            console.error('Relationship Error (profiles default):', relError2);
        } else {
            console.log('Relationship (profiles default) works!');
        }
    } else {
        console.log('Relationship (profiles!merchant_id) works!');
    }
}

checkSchema();
