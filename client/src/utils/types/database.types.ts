export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          id: string
          page: string
          user_id: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page: string
          user_id?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page?: string
          user_id?: string | null
          views?: number | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          clerk_user_id: string | null
          content_markdown: string | null
          created_at: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          clerk_user_id?: string | null
          content_markdown?: string | null
          created_at?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          clerk_user_id?: string | null
          content_markdown?: string | null
          created_at?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          clerk_user_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          clerk_user_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          clerk_user_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact: {
        Row: {
          email: string | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          message: string | null
          name: string | null
          replied_at: string | null
          subject: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          message?: string | null
          name?: string | null
          replied_at?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          message?: string | null
          name?: string | null
          replied_at?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          clerk_user_id: string | null
          degree: string | null
          description: string | null
          end_date: string | null
          id: string
          institution: string | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          clerk_user_id?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          clerk_user_id?: string | null
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          clerk_user_id: string | null
          company: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          position: string
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          clerk_user_id?: string | null
          company?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          position: string
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          clerk_user_id?: string | null
          company?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          position?: string
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      github_sync_config: {
        Row: {
          enabled: boolean | null
          id: number
          include_topics: boolean | null
          interval_min: number | null
          last_result: Json | null
          last_run_at: string | null
          username: string | null
        }
        Insert: {
          enabled?: boolean | null
          id: number
          include_topics?: boolean | null
          interval_min?: number | null
          last_result?: Json | null
          last_run_at?: string | null
          username?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: number
          include_topics?: boolean | null
          interval_min?: number | null
          last_result?: Json | null
          last_run_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      images_media: {
        Row: {
          alt_text: string | null
          id: string
          media_type: string | null
          project_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          id?: string
          media_type?: string | null
          project_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          id?: string
          media_type?: string | null
          project_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      links_recommended: {
        Row: {
          id: string
          label: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          id?: string
          label?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          id?: string
          label?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          clerk_id: string | null
          created_at: string | null
          email: string | null
          headline: string | null
          id: string
          name: string | null
          skills: string[] | null
          social_links: Json | null
          username: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          headline?: string | null
          id: string
          name?: string | null
          skills?: string[] | null
          social_links?: Json | null
          username: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          headline?: string | null
          id?: string
          name?: string | null
          skills?: string[] | null
          social_links?: Json | null
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          clerk_user_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          live_url: string | null
          repo_url: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          repo_url?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          repo_url?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          content: Json
          id: string
          is_home: boolean
          name: string
          site_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          content: Json
          id?: string
          is_home?: boolean
          name: string
          site_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          is_home?: boolean
          name?: string
          site_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          published: boolean
          slug: string
          template: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          published?: boolean
          slug: string
          template?: string
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          published?: boolean
          slug?: string
          template?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          level: number | null
          skill_id: string
          user_id: string
        }
        Insert: {
          level?: number | null
          skill_id: string
          user_id: string
        }
        Update: {
          level?: number | null
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
