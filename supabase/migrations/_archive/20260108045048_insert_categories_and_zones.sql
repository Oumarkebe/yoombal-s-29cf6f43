-- Insert categories
INSERT INTO public.categories (id, name, description) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Électronique', 'Smartphones, ordinateurs, accessoires tech'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mode & Vêtements', 'Vêtements, chaussures, accessoires mode'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Maison & Jardin', 'Meubles, décoration, jardinage'),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', 'Alimentation', 'Produits alimentaires, boissons'),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Beauté & Santé', 'Cosmétiques, soins, bien-être')
ON CONFLICT (id) DO NOTHING;

-- Insert delivery zones
INSERT INTO public.delivery_zones (id, name, areas, base_fee, price_per_km, max_delivery_time_minutes, is_active) VALUES
  ('f6a7b8c9-d0e1-2345-f123-456789012345', 'Dakar Centre', ARRAY['Plateau', 'Médina', 'Fann', 'Point E'], 500, 100, 30, true),
  ('a7b8c9d0-e1f2-3456-0123-567890123456', 'Dakar Ouest', ARRAY['Ouakam', 'Ngor', 'Yoff', 'Almadies'], 750, 120, 45, true),
  ('b8c9d0e1-f2a3-4567-1234-678901234567', 'Pikine-Guédiawaye', ARRAY['Pikine', 'Guédiawaye', 'Parcelles Assainies'], 1000, 150, 60, true),
  ('c9d0e1f2-a3b4-5678-2345-789012345678', 'Rufisque', ARRAY['Rufisque', 'Bargny', 'Diamniadio'], 1500, 200, 90, true)
ON CONFLICT (id) DO NOTHING;