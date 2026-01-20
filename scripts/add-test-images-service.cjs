require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function addTestImages() {
    console.log('🚀 Updating product with test images...');

    const testImages = [
        'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800',
        'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800',
        'https://images.unsplash.com/photo-1585155770107-1ba50fb3742e?w=800',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    ];

    const { data, error } = await supabase
        .from('products')
        .update({
            images: testImages,
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        })
        .eq('id', '73329c1e-4eb5-4ea1-bc1e-fa9b64488841')
        .select();

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log('✅ Success! Product updated:');
    console.log(JSON.stringify(data, null, 2));
}

addTestImages();
