-- ==============================================
-- Policies for user_roles
-- ==============================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Site owners can manage roles for their sites"
ON public.user_roles
FOR ALL
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  (site_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.sites WHERE sites.id = user_roles.site_id AND sites.user_id = auth.uid()
  ))
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  (site_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.sites WHERE sites.id = user_roles.site_id AND sites.user_id = auth.uid()
  ))
);
