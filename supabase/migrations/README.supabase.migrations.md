# 📦 Supabase Migrations Guide

This document explains how to manage database migrations for the **Vitefolio Essence** project.
It covers both **manual execution** (via the Supabase Dashboard) and **automated execution** (via Supabase CLI).

---

## 📁 Folder Structure

```
supabase/
 ├─ migrations/         # Schema changes (tables, enums, initial setup)
 ├─ functions/          # SQL functions (e.g., has_role, has_site_access)
 ├─ triggers/           # Database triggers
 ├─ policies/           # Row Level Security (RLS) policies
 └─ checks/             # Validation scripts (db_check.sql)
```

---

## ⚡ Manual Execution (via Supabase Dashboard)

1. Go to [Supabase SQL Editor](https://app.supabase.com/).
2. Choose your project → open **SQL Editor**.
3. Copy/paste the content of any `.sql` script (from `migrations`, `functions`, etc.).
4. Run the query to apply changes manually.

👉 Recommended for quick tests, prototypes, or small updates.

---

## ⚙️ Supabase CLI (Recommended for Production)

### ✅ Install CLI

```bash
npm install supabase --save-dev
# OR
brew install supabase/tap/supabase
```

Verify installation:

```bash
supabase --version
```

---

### 🔗 Link Your Project

```bash
supabase link --project-ref <PROJECT_REF>
```

Get `<PROJECT_REF>` from: **Project Settings → General** in Supabase Dashboard.

---

### 🚀 Apply All Migrations

```bash
supabase db push
```

Applies all `.sql` files under `supabase/migrations/` to the linked Supabase database.

---

### 🆕 Create New Migration

```bash
supabase migration new <name>
```

Creates a new file in `migrations/`:

```
supabase/migrations/20250909123456_<name>.sql
```

---

### ♻️ Reset Local DB (optional)

```bash
supabase db reset
```

Drops and re-applies all migrations on your **local** database.

---

## ✅ After Migration: Run Schema Check

To verify that roles, policies, and structures are consistent:

```bash
supabase db execute --file supabase/checks/db_check.sql
```

---

## 🔒 Best Practices

- Keep logic separated: functions, policies, triggers → separate folders.
- Make migration files **idempotent** (safe to re-run).
- Use version control (`git`) for all migration files.
- Use Supabase CLI for CI/CD pipelines.

---

## 🧠 Summary

| Task                       | Recommended Method    |
|----------------------------|------------------------|
| Quick fixes                | Supabase SQL Editor    |
| Production changes         | Supabase CLI           |
| Verify DB consistency      | `checks/db_check.sql`  |
| Rebuild local environment  | `supabase db reset`    |

---

📌 With this setup, your Supabase schema is versioned, reproducible, and production-ready.