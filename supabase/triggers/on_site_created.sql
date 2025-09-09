-- ==============================================
-- Trigger: Assign site_owner role when site is created
-- ==============================================
CREATE OR REPLACE FUNCTION public.handle_new_site()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, site_id)
  VALUES (NEW.user_id, 'site_owner', NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_site_created ON public.sites;

CREATE TRIGGER on_site_created
AFTER INSERT ON public.sites
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_site();
