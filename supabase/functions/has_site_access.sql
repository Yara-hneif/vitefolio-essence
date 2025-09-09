-- ==============================================
-- Function: has_site_access
-- ==============================================
CREATE OR REPLACE FUNCTION public.has_site_access(
  _user_id uuid,
  _site_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND site_id = _site_id
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
      AND site_id IS NULL
  );
$$;
