export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4';
  };
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null;
          id: string;
          page: string;
          profile_id: string | null;
          views: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          page: string;
          profile_id?: string | null;
          views?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          page?: string;
          profile_id?: string | null;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'analytics_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      blogs: {
        Row: {
          content_markdown: string | null;
          created_at: string | null;
          id: string;
          is_public: boolean | null;
          profile_id: string | null;
          published: boolean;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content_markdown?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          profile_id?: string | null;
          published?: boolean;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content_markdown?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          profile_id?: string | null;
          published?: boolean;
          slug?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_blogs_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      certifications: {
        Row: {
          credential_url: string | null;
          expiry_date: string | null;
          id: string;
          is_public: boolean | null;
          issue_date: string | null;
          issuer: string | null;
          profile_id: string | null;
          title: string;
        };
        Insert: {
          credential_url?: string | null;
          expiry_date?: string | null;
          id?: string;
          is_public?: boolean | null;
          issue_date?: string | null;
          issuer?: string | null;
          profile_id?: string | null;
          title: string;
        };
        Update: {
          credential_url?: string | null;
          expiry_date?: string | null;
          id?: string;
          is_public?: boolean | null;
          issue_date?: string | null;
          issuer?: string | null;
          profile_id?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_certifications_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      contact: {
        Row: {
          email: string | null;
          id: string;
          is_read: boolean | null;
          is_starred: boolean | null;
          message: string | null;
          name: string | null;
          profile_id: string | null;
          replied_at: string | null;
          subject: string | null;
          updated_at: string | null;
        };
        Insert: {
          email?: string | null;
          id?: string;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          message?: string | null;
          name?: string | null;
          profile_id?: string | null;
          replied_at?: string | null;
          subject?: string | null;
          updated_at?: string | null;
        };
        Update: {
          email?: string | null;
          id?: string;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          message?: string | null;
          name?: string | null;
          profile_id?: string | null;
          replied_at?: string | null;
          subject?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_contact_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      education: {
        Row: {
          degree: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          institution: string | null;
          is_public: boolean | null;
          profile_id: string | null;
          start_date: string | null;
        };
        Insert: {
          degree?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          institution?: string | null;
          is_public?: boolean | null;
          profile_id?: string | null;
          start_date?: string | null;
        };
        Update: {
          degree?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          institution?: string | null;
          is_public?: boolean | null;
          profile_id?: string | null;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_education_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      experience: {
        Row: {
          company: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          is_public: boolean | null;
          location: string | null;
          position: string;
          profile_id: string | null;
          start_date: string | null;
        };
        Insert: {
          company?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_public?: boolean | null;
          location?: string | null;
          position: string;
          profile_id?: string | null;
          start_date?: string | null;
        };
        Update: {
          company?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_public?: boolean | null;
          location?: string | null;
          position?: string;
          profile_id?: string | null;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_experience_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      github_sync_config: {
        Row: {
          enabled: boolean | null;
          id: number;
          include_topics: boolean | null;
          interval_min: number | null;
          last_result: Json | null;
          last_run_at: string | null;
          username: string | null;
        };
        Insert: {
          enabled?: boolean | null;
          id: number;
          include_topics?: boolean | null;
          interval_min?: number | null;
          last_result?: Json | null;
          last_run_at?: string | null;
          username?: string | null;
        };
        Update: {
          enabled?: boolean | null;
          id?: number;
          include_topics?: boolean | null;
          interval_min?: number | null;
          last_result?: Json | null;
          last_run_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      images_media: {
        Row: {
          alt_text: string | null;
          id: string;
          media_type: string | null;
          project_id: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          id?: string;
          media_type?: string | null;
          project_id?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          id?: string;
          media_type?: string | null;
          project_id?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'images_media_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      inboxes: {
        Row: {
          created_at: string | null;
          id: string;
          is_default: boolean;
          name: string;
          owner_id: string;
          site_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_default?: boolean;
          name?: string;
          owner_id: string;
          site_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_default?: boolean;
          name?: string;
          owner_id?: string;
          site_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'inboxes_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inboxes_site_id_fkey';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
        ];
      };
      links_recommended: {
        Row: {
          id: string;
          label: string | null;
          profile_id: string | null;
          url: string;
        };
        Insert: {
          id?: string;
          label?: string | null;
          profile_id?: string | null;
          url: string;
        };
        Update: {
          id?: string;
          label?: string | null;
          profile_id?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_links_recommended_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      message_status: {
        Row: {
          auto_reply_sent_at: string | null;
          id: string;
          inbox_id: string | null;
          is_read: boolean;
          is_starred: boolean;
          message_id: string;
          owner_id: string | null;
          replied_at: string | null;
        };
        Insert: {
          auto_reply_sent_at?: string | null;
          id?: string;
          inbox_id?: string | null;
          is_read?: boolean;
          is_starred?: boolean;
          message_id: string;
          owner_id?: string | null;
          replied_at?: string | null;
        };
        Update: {
          auto_reply_sent_at?: string | null;
          id?: string;
          inbox_id?: string | null;
          is_read?: boolean;
          is_starred?: boolean;
          message_id?: string;
          owner_id?: string | null;
          replied_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'message_status_inbox_id_fkey';
            columns: ['inbox_id'];
            isOneToOne: false;
            referencedRelation: 'inboxes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_status_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_status_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          inbox_id: string | null;
          receiver_id: string | null;
          sender_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          inbox_id?: string | null;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          inbox_id?: string | null;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_inbox_id_fkey';
            columns: ['inbox_id'];
            isOneToOne: false;
            referencedRelation: 'inboxes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar: string | null;
          bio: string | null;
          created_at: string | null;
          email: string | null;
          headline: string | null;
          id: string;
          name: string | null;
          role: string;
          skills: string[] | null;
          social_links: Json | null;
          username: string;
        };
        Insert: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string | null;
          headline?: string | null;
          id?: string;
          name?: string | null;
          role?: string;
          skills?: string[] | null;
          social_links?: Json | null;
          username: string;
        };
        Update: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string | null;
          headline?: string | null;
          id?: string;
          name?: string | null;
          role?: string;
          skills?: string[] | null;
          social_links?: Json | null;
          username?: string;
        };
        Relationships: [];
      };
      project_tags: {
        Row: {
          project_id: string;
          tag_id: string;
        };
        Insert: {
          project_id: string;
          tag_id: string;
        };
        Update: {
          project_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_tags_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          category: string | null;
          collaborators: Json | null;
          cover_image: string | null;
          created_at: string | null;
          description: string | null;
          gallery: string[] | null;
          id: string;
          is_public: boolean | null;
          live_url: string | null;
          profile_id: string | null;
          published: boolean;
          repo_url: string | null;
          slug: string;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          collaborators?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          gallery?: string[] | null;
          id?: string;
          is_public?: boolean | null;
          live_url?: string | null;
          profile_id?: string | null;
          published?: boolean;
          repo_url?: string | null;
          slug: string;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          collaborators?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          gallery?: string[] | null;
          id?: string;
          is_public?: boolean | null;
          live_url?: string | null;
          profile_id?: string | null;
          published?: boolean;
          repo_url?: string | null;
          slug?: string;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_projects_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      role_grants: {
        Row: {
          created_at: string | null;
          expires_at: string | null;
          granted_by: string | null;
          granted_to: string | null;
          id: string;
          role: string;
        };
        Insert: {
          created_at?: string | null;
          expires_at?: string | null;
          granted_by?: string | null;
          granted_to?: string | null;
          id?: string;
          role: string;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string | null;
          granted_by?: string | null;
          granted_to?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_grants_granted_by_fkey';
            columns: ['granted_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_grants_granted_to_fkey';
            columns: ['granted_to'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      site_admins: {
        Row: {
          profile_id: string;
          role: string;
          site_id: string;
        };
        Insert: {
          profile_id: string;
          role?: string;
          site_id: string;
        };
        Update: {
          profile_id?: string;
          role?: string;
          site_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'site_admins_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'site_admins_site_id_fkey';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
        ];
      };
      site_messages: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          is_read: boolean | null;
          is_starred: boolean | null;
          message: string;
          name: string | null;
          profile_id: string | null;
          replied_at: string | null;
          site_id: string;
          subject: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          message: string;
          name?: string | null;
          profile_id?: string | null;
          replied_at?: string | null;
          site_id: string;
          subject?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          message?: string;
          name?: string | null;
          profile_id?: string | null;
          replied_at?: string | null;
          site_id?: string;
          subject?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'site_messages_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'site_messages_site_id_fkey';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
        ];
      };
      site_pages: {
        Row: {
          content: Json;
          id: string;
          is_home: boolean;
          name: string;
          profile_id: string | null;
          site_id: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          content: Json;
          id?: string;
          is_home?: boolean;
          name: string;
          profile_id?: string | null;
          site_id: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          id?: string;
          is_home?: boolean;
          name?: string;
          profile_id?: string | null;
          site_id?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_site_pages_site';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'site_pages_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      sites: {
        Row: {
          created_at: string;
          id: string;
          is_public: boolean | null;
          name: string | null;
          owner_id: string | null;
          profile_id: string | null;
          published: boolean;
          slug: string;
          status: string | null;
          template: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_public?: boolean | null;
          name?: string | null;
          owner_id?: string | null;
          profile_id?: string | null;
          published?: boolean;
          slug: string;
          status?: string | null;
          template?: string;
          title?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_public?: boolean | null;
          name?: string | null;
          owner_id?: string | null;
          profile_id?: string | null;
          published?: boolean;
          slug?: string;
          status?: string | null;
          template?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_sites_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sites_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      skills: {
        Row: {
          category: string | null;
          id: string;
          is_public: boolean | null;
          name: string;
          profile_id: string | null;
        };
        Insert: {
          category?: string | null;
          id?: string;
          is_public?: boolean | null;
          name: string;
          profile_id?: string | null;
        };
        Update: {
          category?: string | null;
          id?: string;
          is_public?: boolean | null;
          name?: string;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_skills_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          permissions: Json | null;
          profile_id: string;
          role: Database['public']['Enums']['app_role'];
          site_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permissions?: Json | null;
          profile_id: string;
          role: Database['public']['Enums']['app_role'];
          site_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permissions?: Json | null;
          profile_id?: string;
          role?: Database['public']['Enums']['app_role'];
          site_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_roles_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_site_id_fkey';
            columns: ['site_id'];
            isOneToOne: false;
            referencedRelation: 'sites';
            referencedColumns: ['id'];
          },
        ];
      };
      user_skills: {
        Row: {
          level: number | null;
          profile_id: string;
          skill_id: string;
        };
        Insert: {
          level?: number | null;
          profile_id: string;
          skill_id: string;
        };
        Update: {
          level?: number | null;
          profile_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_user_skills_profile';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_skills_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      _add_clean_fk: {
        Args: {
          fk_name: string;
          p_col: string;
          p_table: unknown;
          ref: unknown;
          ref_col: string;
        };
        Returns: undefined;
      };
      delete_user_cascade: {
        Args: { uid: string };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _site_id?: string;
          _user_id: string;
        };
        Returns: boolean;
      };
      has_site_access: {
        Args: { _site_id: string; _user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'super_admin' | 'site_owner' | 'site_admin' | 'editor' | 'viewer';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['super_admin', 'site_owner', 'site_admin', 'editor', 'viewer'],
    },
  },
} as const;
