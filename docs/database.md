# Database Documentation

This document provides an overview of the database schema, user roles, and access control policies implemented in the **Vitefolio Essence** platform.  
The goal is to ensure data consistency, security, and clear separation of responsibilities.

---

## 1. User Roles

We use the `app_role` enum to manage different levels of permissions.  

### Available Roles

- **super_admin**  
  Full control of the entire platform, including global settings, landing page, users, roles, and all content.

- **site_owner**  
  The creator and main administrator of a specific site. Has full control over that site.

- **site_admin**  
  Can manage and configure a site with almost full permissions, but cannot transfer ownership.

- **editor**  
  Can edit site content and manage messages but cannot change critical settings.

- **viewer**  
  Read-only access to site messages. Cannot modify or manage content.

---

## 2. Tables Overview

### **1. contact**

Used for global contact messages sent from the Landing Page.  
This acts as the **Super Admin inbox**.

| Column     | Type                     | Description                                |
|------------|--------------------------|--------------------------------------------|
| id         | uuid (PK)                | Unique identifier                          |
| user_id    | uuid (nullable)          | User who sent the message (if logged in)   |
| name       | varchar                  | Sender’s name                              |
| email      | varchar                  | Sender’s email address                     |
| subject    | varchar                  | Message subject                            |
| message    | text                     | Message body                               |
| is_read    | boolean (default false)  | Whether the message has been read          |
| is_starred | boolean (default false)  | Whether the message is starred             |
| replied_at | timestamptz (nullable)   | Timestamp of reply                         |
| updated_at | timestamptz              | Last update                                |

**Policies**:  

- Anyone can send messages (`INSERT`).  
- Only `super_admin` can manage messages (`SELECT, UPDATE, DELETE`).  

---

### **2. site_messages**

Stores messages sent from a site’s Contact Page (if enabled).  
Each site has its own inbox.

| Column     | Type                     | Description                                |
|------------|--------------------------|--------------------------------------------|
| id         | uuid (PK)                | Unique identifier                          |
| site_id    | uuid (FK → sites.id)     | The site this message belongs to           |
| user_id    | uuid (nullable)          | Sender’s user ID (if logged in)            |
| name       | varchar                  | Sender’s name                              |
| email      | varchar                  | Sender’s email address                     |
| subject    | varchar                  | Message subject                            |
| message    | text                     | Message body                               |
| is_read    | boolean (default false)  | Whether the message has been read          |
| is_starred | boolean (default false)  | Whether the message is starred             |
| replied_at | timestamptz (nullable)   | Timestamp of reply                         |
| created_at | timestamptz (default now)| Time of creation                           |

**Policies**:  

- `viewer` → can read messages.  
- `editor`, `site_admin`, `site_owner`, `super_admin` → can manage messages.  

---

### **3. user_roles**

Manages role assignments for users across the platform and specific sites.

| Column      | Type                     | Description                                |
|-------------|--------------------------|--------------------------------------------|
| id          | uuid (PK)                | Unique identifier                          |
| user_id     | uuid                     | The Clerk user ID                          |
| role        | app_role enum            | User’s role                                |
| site_id     | uuid (nullable, FK)      | Null for global roles (e.g., super_admin)  |
| permissions | jsonb (default `{}`)     | Extra fine-grained permissions             |
| created_at  | timestamptz              | Time of creation                           |
| updated_at  | timestamptz              | Last update                                |

**Notes**:  

- When a site is created, the creator is automatically assigned as `site_owner`.  
- A user can hold multiple roles across different sites.  

---

### **4. sites**

Represents websites created by users.

| Column     | Type                     | Description                                |
|------------|--------------------------|--------------------------------------------|
| id         | uuid (PK)                | Unique identifier                          |
| user_id    | uuid (FK → users.id)     | Creator of the site                        |
| title      | varchar                  | Site title                                 |
| slug       | varchar (unique)         | URL-friendly site identifier               |
| template   | varchar                  | Template used                              |
| published  | boolean (default false)  | Whether the site is publicly visible       |
| status     | text (default 'draft')   | Site status (draft, active, archived)      |
| created_at | timestamptz              | Time of creation                           |
| updated_at | timestamptz              | Last update                                |

**Policies**:  

- Public users can view published sites.  
- `site_owner` and `super_admin` can manage their sites.  

---

### **5. site_pages**

Pages within each site.

| Column     | Type                     | Description                                |
|------------|--------------------------|--------------------------------------------|
| id         | uuid (PK)                | Unique identifier                          |
| site_id    | uuid (FK → sites.id)     | Parent site                                |
| slug       | varchar                  | Page slug (URL-friendly ID)                |
| title      | varchar                  | Page title                                 |
| content    | jsonb                    | Page content (flexible schema)             |
| created_at | timestamptz              | Time of creation                           |
| updated_at | timestamptz              | Last update                                |

**Policies**:  

- Public users can read published pages.  
- `editor`, `site_admin`, `site_owner`, and `super_admin` can manage pages.  

---

## 3. Access Control Overview

- **Public Access**  
  - Can view any published site or page.  
  - Can send messages to `contact` and `site_messages`.  

- **Super Admin**  
  - Full platform access.  
  - Manages Landing Page and global `contact` inbox.  
  - Can override policies on all sites.  

- **Site Owner**  
  - Full control of their site (pages, messages, roles, settings).  

- **Site Admin**  
  - Almost full permissions within a site, but cannot transfer ownership.  

- **Editor**  
  - Limited to content and message management.  

- **Viewer**  
  - Read-only access to site messages.  

---

## 4. Security & RLS (Row Level Security)

Row Level Security (RLS) is enabled on all critical tables (`user_roles`, `contact`, `site_messages`, `sites`, `site_pages`).  

Policies enforce that:  

- Users only access data they own or are granted roles for.  
- Public access is restricted to published content only.  
- Super Admins can bypass restrictions.  

---

## 5. Triggers

- **on_site_created**  
  Automatically assigns the `site_owner` role to the user who creates a site.  

- **update_user_roles_updated_at**  
  Keeps `updated_at` column up to date when roles are modified.  
