-- Add test images to Savon de Marseille product using existing images column
UPDATE products 
SET 
  images = ARRAY[
    'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800',
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800',
    'https://images.unsplash.com/photo-1585155770107-1ba50fb3742e?w=800',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'
  ],
  video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE id = '73329c1e-4eb5-4ea1-bc1e-fa9b64488841';
