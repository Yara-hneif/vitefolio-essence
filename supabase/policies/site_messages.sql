-- ==============================================
-- Policies for site_messages
-- ==============================================
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with site access can view messages"
ON public.site_messages
FOR SELECT
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_site_access(auth.uid(), site_id)
);

CREATE POLICY "Users with editor+ access can manage messages"
ON public.site_messages
FOR ALL
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'site_owner', site_id) OR
  public.has_role(auth.uid(), 'site_admin', site_id) OR
  public.has_role(auth.uid(), 'editor', site_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'site_owner', site_id) OR
  public.has_role(auth.uid(), 'site_admin', site_id) OR
  public.has_role(auth.uid(), 'editor', site_id)
);
