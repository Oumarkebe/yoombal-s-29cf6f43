
-- Table services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS pour services : tout le monde peut lire, seuls les admins peuvent modifier/créer/supprimer
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read to all" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow admin manage" ON public.services
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Table courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL,
  service_id UUID REFERENCES public.services(id),
  driver_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS pour courses : 
-- Les clients voient seulement leurs propres courses ; livreurs voient celles qui leur sont affectées ; admin accès total
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client can read own courses" ON public.courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.deliveries d
      WHERE d.id = courses.delivery_id
      AND (d.customer_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    OR
    courses.driver_id = auth.uid()
  );

-- Création, modif, suppression permis pour admin uniquement :
CREATE POLICY "Admin full manage" ON public.courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
