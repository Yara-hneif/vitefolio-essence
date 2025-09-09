-- ==============================================
-- Function: has_role
-- ==============================================
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id uuid,
  _role app_role,
  _site_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (site_id = _site_id OR (_site_id IS NULL AND site_id IS NULL))
  );
$$;
