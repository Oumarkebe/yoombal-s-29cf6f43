
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%mouton%');

    if (error) {
        console.error("Error fetching products:", error);
    } else {
        console.log("Search results for 'mouton':", JSON.stringify(data, null, 2));
    }

    const { data: allProducts, error: allErr } = await supabase
        .from('products')
        .select('name, is_active')
        .limit(10);

    if (allErr) {
        console.error("Error fetching all products:", allErr);
    } else {
        console.log("Recent products in DB:", JSON.stringify(allProducts, null, 2));
    }
}

checkProducts();
