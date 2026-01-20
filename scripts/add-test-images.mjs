import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

async function updateProductImages() {
    const client = new Client({
        host: 'db.lqchbfhlldvhqqyvzxkg.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: process.env.VITE_SUPABASE_DB_PASSWORD,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const images = [
            'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800',
            'https://images.unsplash.com/photo-1585155770107-1ba50fb3742e?w=800',
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
            'https://images.unsplash.com/photo-1600428853583-5d0c67bba5ea?w=800',
        ];

        const result = await client.query(
            `UPDATE products 
       SET image_urls = $1, 
           video_url = $2 
       WHERE id = $3 
       RETURNING id, name, image_urls, video_url`,
            [images, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '73329c1e-4eb5-4ea1-bc1e-fa9b64488841']
        );

        console.log('✅ Product updated successfully:');
        console.log(JSON.stringify(result.rows[0], null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

updateProductImages();
