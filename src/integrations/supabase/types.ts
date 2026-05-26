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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      Benefit: {
        Row: {
          active: boolean | null
          createdAt: string | null
          icon: string
          id: string
          order: number | null
          subtitle: string | null
          title: string
          updatedAt: string | null
        }
        Insert: {
          active?: boolean | null
          createdAt?: string | null
          icon: string
          id: string
          order?: number | null
          subtitle?: string | null
          title: string
          updatedAt?: string | null
        }
        Update: {
          active?: boolean | null
          createdAt?: string | null
          icon?: string
          id?: string
          order?: number | null
          subtitle?: string | null
          title?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      Branding: {
        Row: {
          accentColor: string
          backgroundColor: string
          buttonBgColor: string | null
          buttonTextColor: string | null
          facebookUrl: string | null
          faviconUrl: string | null
          fontBody: string
          fontHeading: string
          footerBgColor: string | null
          footerLogo: string | null
          footerText: string | null
          footerTextColor: string | null
          foregroundColor: string
          id: string
          instagramUrl: string | null
          logoUrl: string | null
          primaryColor: string
          secondaryColor: string
          siteName: string
          tagline: string | null
          updatedAt: string
          whatsappMessage: string | null
          whatsappPhone: string | null
          youtubeUrl: string | null
        }
        Insert: {
          accentColor?: string
          backgroundColor?: string
          buttonBgColor?: string | null
          buttonTextColor?: string | null
          facebookUrl?: string | null
          faviconUrl?: string | null
          fontBody?: string
          fontHeading?: string
          footerBgColor?: string | null
          footerLogo?: string | null
          footerText?: string | null
          footerTextColor?: string | null
          foregroundColor?: string
          id?: string
          instagramUrl?: string | null
          logoUrl?: string | null
          primaryColor?: string
          secondaryColor?: string
          siteName?: string
          tagline?: string | null
          updatedAt?: string
          whatsappMessage?: string | null
          whatsappPhone?: string | null
          youtubeUrl?: string | null
        }
        Update: {
          accentColor?: string
          backgroundColor?: string
          buttonBgColor?: string | null
          buttonTextColor?: string | null
          facebookUrl?: string | null
          faviconUrl?: string | null
          fontBody?: string
          fontHeading?: string
          footerBgColor?: string | null
          footerLogo?: string | null
          footerText?: string | null
          footerTextColor?: string | null
          foregroundColor?: string
          id?: string
          instagramUrl?: string | null
          logoUrl?: string | null
          primaryColor?: string
          secondaryColor?: string
          siteName?: string
          tagline?: string | null
          updatedAt?: string
          whatsappMessage?: string | null
          whatsappPhone?: string | null
          youtubeUrl?: string | null
        }
        Relationships: []
      }
      Course: {
        Row: {
          active: boolean
          coverImage: string | null
          createdAt: string
          date: string | null
          description: string | null
          gallery: string[] | null
          id: string
          instructor: string | null
          location: string | null
          registrationEnd: string | null
          registrationStart: string | null
          showInHome: boolean
          slug: string
          status: Database["public"]["Enums"]["CourseStatus"]
          time: string | null
          title: string
          updatedAt: string
          whatsappMsg: string | null
        }
        Insert: {
          active?: boolean
          coverImage?: string | null
          createdAt?: string
          date?: string | null
          description?: string | null
          gallery?: string[] | null
          id: string
          instructor?: string | null
          location?: string | null
          registrationEnd?: string | null
          registrationStart?: string | null
          showInHome?: boolean
          slug: string
          status?: Database["public"]["Enums"]["CourseStatus"]
          time?: string | null
          title: string
          updatedAt?: string
          whatsappMsg?: string | null
        }
        Update: {
          active?: boolean
          coverImage?: string | null
          createdAt?: string
          date?: string | null
          description?: string | null
          gallery?: string[] | null
          id?: string
          instructor?: string | null
          location?: string | null
          registrationEnd?: string | null
          registrationStart?: string | null
          showInHome?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["CourseStatus"]
          time?: string | null
          title?: string
          updatedAt?: string
          whatsappMsg?: string | null
        }
        Relationships: []
      }
      HomeBanner: {
        Row: {
          active: boolean | null
          bgColor: string | null
          createdAt: string | null
          ctaLink: string | null
          ctaText: string | null
          description: string | null
          id: string
          image: string | null
          key: string
          order: number | null
          subtitle: string | null
          textColor: string | null
          title: string
          updatedAt: string | null
        }
        Insert: {
          active?: boolean | null
          bgColor?: string | null
          createdAt?: string | null
          ctaLink?: string | null
          ctaText?: string | null
          description?: string | null
          id: string
          image?: string | null
          key: string
          order?: number | null
          subtitle?: string | null
          textColor?: string | null
          title: string
          updatedAt?: string | null
        }
        Update: {
          active?: boolean | null
          bgColor?: string | null
          createdAt?: string | null
          ctaLink?: string | null
          ctaText?: string | null
          description?: string | null
          id?: string
          image?: string | null
          key?: string
          order?: number | null
          subtitle?: string | null
          textColor?: string | null
          title?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      Inspiration: {
        Row: {
          active: boolean
          createdAt: string
          gallery: string[] | null
          id: string
          image: string
          link: string | null
          order: number
          title: string
          updatedAt: string
        }
        Insert: {
          active?: boolean
          createdAt?: string
          gallery?: string[] | null
          id: string
          image: string
          link?: string | null
          order?: number
          title: string
          updatedAt?: string
        }
        Update: {
          active?: boolean
          createdAt?: string
          gallery?: string[] | null
          id?: string
          image?: string
          link?: string | null
          order?: number
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Module: {
        Row: {
          createdAt: string | null
          description: string | null
          enabled: boolean | null
          id: string
          key: string
          order: number | null
          showInHome: boolean | null
          showInNav: boolean | null
          title: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          enabled?: boolean | null
          id: string
          key: string
          order?: number | null
          showInHome?: boolean | null
          showInNav?: boolean | null
          title: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          key?: string
          order?: number | null
          showInHome?: boolean | null
          showInNav?: boolean | null
          title?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      NewsVideo: {
        Row: {
          active: boolean
          createdAt: string
          id: string
          order: number
          orientation: string
          tags: string[] | null
          thumbnail: string
          title: string
          updatedAt: string
          youtubeUrl: string
        }
        Insert: {
          active?: boolean
          createdAt?: string
          id: string
          order?: number
          orientation?: string
          tags?: string[] | null
          thumbnail: string
          title: string
          updatedAt?: string
          youtubeUrl: string
        }
        Update: {
          active?: boolean
          createdAt?: string
          id?: string
          order?: number
          orientation?: string
          tags?: string[] | null
          thumbnail?: string
          title?: string
          updatedAt?: string
          youtubeUrl?: string
        }
        Relationships: []
      }
      Page: {
        Row: {
          content: Json | null
          createdAt: string | null
          id: string
          order: number | null
          published: boolean | null
          seoDescription: string | null
          seoTitle: string | null
          slug: string
          title: string
          updatedAt: string | null
        }
        Insert: {
          content?: Json | null
          createdAt?: string | null
          id: string
          order?: number | null
          published?: boolean | null
          seoDescription?: string | null
          seoTitle?: string | null
          slug: string
          title: string
          updatedAt?: string | null
        }
        Update: {
          content?: Json | null
          createdAt?: string | null
          id?: string
          order?: number | null
          published?: boolean | null
          seoDescription?: string | null
          seoTitle?: string | null
          slug?: string
          title?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      PageView: {
        Row: {
          createdAt: string
          id: number
          path: string
          referrer: string | null
          sessionId: string
          userAgent: string | null
        }
        Insert: {
          createdAt?: string
          id?: number
          path: string
          referrer?: string | null
          sessionId: string
          userAgent?: string | null
        }
        Update: {
          createdAt?: string
          id?: number
          path?: string
          referrer?: string | null
          sessionId?: string
          userAgent?: string | null
        }
        Relationships: []
      }
      Partner: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          gallery: string[] | null
          id: string
          logo: string
          name: string
          order: number
          showInHome: boolean | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          logo: string
          name: string
          order?: number
          showInHome?: boolean | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          logo?: string
          name?: string
          order?: number
          showInHome?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      PegueMonte: {
        Row: {
          active: boolean | null
          coverImage: string | null
          createdAt: string
          description: string | null
          gallery: string[] | null
          highlight: boolean | null
          id: string
          items: string[] | null
          name: string
          obs: string | null
          partyType: string | null
          peopleCount: string | null
          slug: string
          storePhones: Json | null
          theme: string | null
          unit: string | null
          updatedAt: string
          videoUrl: string | null
          whatsappMsg: string | null
        }
        Insert: {
          active?: boolean | null
          coverImage?: string | null
          createdAt?: string
          description?: string | null
          gallery?: string[] | null
          highlight?: boolean | null
          id?: string
          items?: string[] | null
          name: string
          obs?: string | null
          partyType?: string | null
          peopleCount?: string | null
          slug: string
          storePhones?: Json | null
          theme?: string | null
          unit?: string | null
          updatedAt?: string
          videoUrl?: string | null
          whatsappMsg?: string | null
        }
        Update: {
          active?: boolean | null
          coverImage?: string | null
          createdAt?: string
          description?: string | null
          gallery?: string[] | null
          highlight?: boolean | null
          id?: string
          items?: string[] | null
          name?: string
          obs?: string | null
          partyType?: string | null
          peopleCount?: string | null
          slug?: string
          storePhones?: Json | null
          theme?: string | null
          unit?: string | null
          updatedAt?: string
          videoUrl?: string | null
          whatsappMsg?: string | null
        }
        Relationships: []
      }
      ProductCategory: {
        Row: {
          active: boolean | null
          coverImage: string | null
          createdAt: string | null
          description: string | null
          gallery: string[] | null
          icon: string | null
          id: string
          name: string
          order: number | null
          showInHome: boolean | null
          showInMenu: boolean | null
          slug: string
          updatedAt: string | null
          whatsappMsg: string | null
        }
        Insert: {
          active?: boolean | null
          coverImage?: string | null
          createdAt?: string | null
          description?: string | null
          gallery?: string[] | null
          icon?: string | null
          id: string
          name: string
          order?: number | null
          showInHome?: boolean | null
          showInMenu?: boolean | null
          slug: string
          updatedAt?: string | null
          whatsappMsg?: string | null
        }
        Update: {
          active?: boolean | null
          coverImage?: string | null
          createdAt?: string | null
          description?: string | null
          gallery?: string[] | null
          icon?: string | null
          id?: string
          name?: string
          order?: number | null
          showInHome?: boolean | null
          showInMenu?: boolean | null
          slug?: string
          updatedAt?: string | null
          whatsappMsg?: string | null
        }
        Relationships: []
      }
      Store: {
        Row: {
          address: string
          city: string
          created_at: string
          facade_url: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          state: string
          updated_at: string
          whatsapp: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          facade_url?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          state: string
          updated_at?: string
          whatsapp?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          facade_url?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          createdAt: string | null
          email: string
          id: string
          name: string
          passwordHash: string
          role: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          email: string
          id: string
          name: string
          passwordHash: string
          role?: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          email?: string
          id?: string
          name?: string
          passwordHash?: string
          role?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CourseStatus: "SOON" | "OPEN" | "CLOSED"
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
    Enums: {
      CourseStatus: ["SOON", "OPEN", "CLOSED"],
    },
  },
} as const
