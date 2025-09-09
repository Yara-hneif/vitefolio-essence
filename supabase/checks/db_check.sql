-- ✅ Display all tables in schema public
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- ✅ Check user_roles columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_roles';

-- ✅ Check site_messages columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'site_messages';

-- ✅ Check contact columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'contact';

-- ✅ ENUM check for roles
SELECT unnest(enum_range(NULL::public.app_role)) AS app_roles;

-- ✅ Custom Function Checking
SELECT proname, proargnames
FROM pg_proc
WHERE proname IN ('has_role', 'has_site_access');

-- ✅ Trigger Checking
SELECT tgname, tgrelid::regclass AS table_name
FROM pg_trigger
WHERE NOT tgisinternal;

-- ✅ RLS Enablement Checking
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('user_roles', 'site_messages', 'contact', 'sites', 'site_pages');

-- ✅ Display Policies on user_roles
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_roles';

-- ✅ Display policies on site_messages
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'site_messages';

-- ✅ Display policies on contact
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'contact';

-- ✅ Display policies on sites
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'sites';

-- ✅ Display policies on site_pages
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'site_pages';