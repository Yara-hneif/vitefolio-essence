-- ==============================================
-- Policies for contact (Super Admin inbox)
-- ==============================================
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send contact messages"
ON public.contact
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Super admin can manage contact messages"
ON public.contact
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
