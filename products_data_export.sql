-- Products Data Export
-- Generated: 2026-01-16T18:55:02.869Z
-- Total products: 11

BEGIN;


-- Product 1: Tomates Concentrées (Boîte 1kg)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  'ed5a8037-117c-4d91-aaca-d7f5f8a1527a', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Tomates Concentrées (Boîte 1kg)', 'Double concentré de tomates.',
  '2200.00', 80, 'https://tse1.mm.bing.net/th/id/OIP.75YP3rOJoxwcKbDD765myAHaHa?w=626&h=626&rs=1&pid=ImgDetMain&o=7&rm=3', 'Alimentation',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:27:21.042Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-ed5a80', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'tomates-concentr-es-bo-te-1kg-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 2: Café Touba (Sachet 250g)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '45f7b75a-0fa2-4235-a6a4-4f0ed46d0607', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Café Touba (Sachet 250g)', 'Authentique café Touba aux épices.',
  '1500.00', 300, 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&q=80', 'Boissons',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:27:53.417Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-45f7b7', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'caf-touba-sachet-250g-', true,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 3: Sucre En Poudre (1kg)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  'a9d4a907-8f8a-471a-acca-1f1efc97885b', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Sucre En Poudre (1kg)', 'Sucre blanc raffiné de haute qualité.',
  '800.00', 200, 'https://th.bing.com/th/id/OIP.euaFGo7sSKnqfqrjJmIDsQHaEK?w=307&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'Alimentation',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:28:45.206Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-a9d4a9', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'sucre-en-poudre-1kg-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 4: Oignons (Sac 5kg)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  'cbcfc295-39f2-46a2-8de0-3c88e22c4b2f', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Oignons (Sac 5kg)', 'Oignons frais locaux.',
  '3000.00', 40, 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500&q=80', 'Légumes',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:12:17.113Z"'::jsonb, NULL,
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-cbcfc2', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'oignons-sac-5kg-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, NULL,
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 5: Savon de Marseille (Lot de 4)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '73329c1e-4eb5-4ea1-bc1e-fa9b64488841', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Savon de Marseille (Lot de 4)', 'Savon traditionnel.',
  '1200.00', 100, 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80', 'Hygiène',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:12:17.113Z"'::jsonb, NULL,
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-73329c', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'savon-de-marseille-lot-de-4-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, NULL,
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 6: Riz Parfumé Royal (50kg)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '4b4c1f21-a1d2-4b00-a761-09aaacce732e', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Riz Parfumé Royal (50kg)', 'Sac de riz parfumé de qualité supérieure.',
  '22500.00', 100, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', 'Alimentation',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:25:06.024Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-4b4c1f', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'riz-parfum-royal-50kg-', true,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 7: Jus de Bouye (1L)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '9c164645-4b9c-4f17-ab26-3fd5efce1baf', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Jus de Bouye (1L)', 'Jus naturel de fruit de baobab.',
  '1000.00', 60, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80', 'Boissons',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:25:45.488Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-9c1646', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'jus-de-bouye-1l-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 8: Pommes de Terre (Sac 5kg)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '08609643-770c-4748-81dd-59786d3876b8', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Pommes de Terre (Sac 5kg)', 'Pommes de terre à chair ferme.',
  '3500.00', 40, 'https://tse1.mm.bing.net/th/id/OIP.-wugHRFUBU1GvMCx72UM0wHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', 'Légumes',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:29:50.364Z"'::jsonb, NULL,
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-086096', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'pommes-de-terre-sac-5kg-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 9: Huile d'Arachide (5L)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '3cf98d35-cfbe-498f-b552-f55ffac5d43e', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Huile d''Arachide (5L)', 'Bidon d''huile d''arachide pure.',
  '6500.00', 50, 'https://group-alliancegulf.com/wp-content/uploads/2022/01/huile-d_arachide-_-group-alliancegulf.com_.jpg', 'Alimentation',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T05:31:21.973Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'pi?ce', 'PROD-3cf98d', NULL, NULL,
  NULL, 0, false, NULL,
  NULL, NULL, 'huile-d-arachide-5l-', false,
  true, '{}'::jsonb, NULL, 0,
  NULL, 'new', NULL, ARRAY[],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 10: Lait En Poudre (500g)
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  '967b82f2-c13f-419f-a9ad-c2f3d2106cda', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'Lait En Poudre (500g)', 'Découvrez notre Lait En Poudre de 500g, une source de nutrition pure et essentielle pour toute la famille. Élaboré à partir de lait de qualité supérieure, notre produit offre une richesse en protéines, vitamines et minéraux pour soutenir une alimentation équilibrée. Facile à utiliser, il se dissout rapidement dans l''eau chaude ou froide, vous permettant de préparer un délicieux verre de lait en quelques instants.

Idéal pour les petits-déjeuners, les smoothies, ou même en cuisine pour rehausser vos recettes, ce lait en poudre est un incontournable pour tous ceux qui recherchent praticité et goût. Sa longue durée de conservation en fait un choix parfait pour une utilisation quotidienne ou pour les voyages. Optez pour notre Lait En Poudre et offrez à votre famille la nutrition qu''elle mérite, tout en vous simplifiant la vie. Ne manquez pas cette opportunité d''améliorer vos repas, ajoutez-le dès maintenant à votre panier !',
  '28000.00', 156, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', 'Alimentation',
  'active', '"2026-01-16T04:37:02.401Z"'::jsonb, '"2026-01-16T06:03:28.281Z"'::jsonb, 'c70cba2f-8179-45db-baa9-906d19785358',
  'XOF', NULL, ARRAY[], NULL,
  'kg', 'PROD-967b82', '', '0',
  ARRAY['lait', 'entier'], 0, true, NULL,
  'Lait En Poudre 500g - Crémeux & Nutritif', 'Découvrez notre lait en poudre 500g, parfait pour des recettes savoureuses et une nutrition équilibrée. Commandez maintenant!', 'lait-en-poudre-500g', true,
  true, '{}'::jsonb, 0, 20000,
  NULL, 'new', '{"length":0,"width":0,"height":0}', ARRAY['Livraison gratuite'],
  NULL, '"2026-01-16T05:12:17.022Z"'::jsonb, 1, NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


-- Product 11: khassida
INSERT INTO public.products (
  id, merchant_id, name, description, price, stock, image_url, category,
  status, created_at, updated_at, category_id, currency, video_url,
  gallery, brand, unit, sku, barcode, weight, tags, min_stock,
  ai_description, ai_pricing_strategy, seo_title, seo_description, slug,
  bnpl_enabled, is_active, specs, compare_at_price, cost_price,
  download_url, condition, dimensions, features, images, published_at,
  min_order_quantity, wholesale_price, is_digital
) VALUES (
  'a4266720-ce59-43e6-92de-868256f2846a', '289c9a6c-0cf4-493b-a0c7-907366f96ead', 'khassida', 'Découvrez le khassida, un chef-d''œuvre de la culture musicale africaine qui transcende les générations. Cet instrument traditionnel, souvent réalisé en bois sculpté à la main, procure une sonorité riche et chaleureuse, idéale pour les mélodies envoûtantes et les rythmes entraînants. Chaque khassida est unique, alliant artisanat exceptionnel et matériaux de haute qualité pour une durabilité optimale. 

Que vous soyez musicien professionnel ou amateur passionné, cet instrument saura enrichir vos performances et ravir votre audience. Son design élégant et ses finitions soignées en font également un objet décoratif remarquable, apportant une touche d''authenticité à votre intérieur. 

Ne manquez pas l''opportunité de posséder ce trésor musical. Commandez dès aujourd''hui votre khassida et laissez-vous transporter par ses sonorités captivantes, tout en soutenant l''artisanat local. Faites vibrer votre passion pour la musique avec cet instrument incontournable !',
  '1000.00', 199, NULL, NULL,
  'active', '"2026-01-16T09:23:15.638Z"'::jsonb, '"2026-01-16T12:11:58.131Z"'::jsonb, '77e79d00-a91c-431a-95f1-7060950199f5',
  'XOF', 'https://youtu.be/RsGRrd5sWrs', ARRAY['http://127.0.0.1:54321/storage/v1/object/public/products/1768555511989-espf1yb8m8h.png'], NULL,
  'pièce', '', '', '0',
  ARRAY[], 0, true, NULL,
  NULL, NULL, 'savon-2-updated', true,
  true, '{"couleur":"Rouge"}'::jsonb, 0, 500,
  'https://daaraykhassida.com/wp-content/uploads/2016/07/09-Rabbi.mp3', 'new', '{"length":0,"width":0,"height":0}', NULL,
  NULL, '"2026-01-16T09:19:35.150Z"'::jsonb, 3, NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  updated_at = EXCLUDED.updated_at;


COMMIT;

SELECT 'Products data export completed: 11 products' as status;
