-- Seed categories
INSERT INTO "public"."categories" ("id", "name", "description", "created_at", "updated_at") VALUES
	('1e80015e-906d-49a2-8f20-fa67a9c55847', 'Test Category', 'Description test', '2026-01-08 04:11:50.405935+00', '2026-01-08 04:11:50.405935+00'),
	('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Électronique', 'Smartphones, ordinateurs, accessoires tech', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mode & Vêtements', 'Vêtements, chaussures, accessoires mode', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Maison & Jardin', 'Meubles, décoration, jardinage', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('d4e5f6a7-b8c9-0123-def1-234567890123', 'Alimentation', 'Produits alimentaires, boissons', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Beauté & Santé', 'Cosmétiques, soins, bien-être', '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00')
ON CONFLICT (id) DO NOTHING;

-- Seed delivery zones
INSERT INTO "public"."delivery_zones" ("id", "name", "areas", "base_fee", "price_per_km", "max_delivery_time_minutes", "is_active", "created_at", "updated_at") VALUES
	('f6a7b8c9-d0e1-2345-f123-456789012345', 'Dakar Centre', '{Plateau,Médina,Fann,"Point E"}', 500, 100, 30, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('a7b8c9d0-e1f2-3456-0123-567890123456', 'Dakar Ouest', '{Ouakam,Ngor,Yoff,Almadies}', 750, 120, 45, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('b8c9d0e1-f2a3-4567-1234-678901234567', 'Pikine-Guédiawaye', '{Pikine,Guédiawaye,"Parcelles Assainies"}', 1000, 150, 60, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00'),
	('c9d0e1f2-a3b4-5678-2345-789012345678', 'Rufisque', '{Rufisque,Bargny,Diamniadio}', 1500, 200, 90, true, '2026-01-08 05:05:40.594212+00', '2026-01-08 05:05:40.594212+00')
ON CONFLICT (id) DO NOTHING;
