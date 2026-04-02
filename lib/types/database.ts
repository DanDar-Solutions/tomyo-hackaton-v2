export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_plans: {
        Row: {
          ai_message: string | null
          created_at: string | null
          id: string
          ordered_tasks: Json | null
          plan_date: string
          recommended_start_time: string | null
          stress_load: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          ai_message?: string | null
          created_at?: string | null
          id?: string
          ordered_tasks?: Json | null
          plan_date: string
          recommended_start_time?: string | null
          stress_load?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          ai_message?: string | null
          created_at?: string | null
          id?: string
          ordered_tasks?: Json | null
          plan_date?: string
          recommended_start_time?: string | null
          stress_load?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      classes: {
        Row: {
          class_name: string | null
          class_section: string
          created_at: string | null
          grade: number
          id: string
        }
        Insert: {
          class_name?: string | null
          class_section: string
          created_at?: string | null
          grade: number
          id?: string
        }
        Update: {
          class_name?: string | null
          class_section?: string
          created_at?: string | null
          grade?: number
          id?: string
        }
        Relationships: []
      }
      demo_users: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          password: string
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          password: string
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          password?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_users_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_events: {
        Row: {
          class_section: string | null
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string | null
          grade_level: number
          id: string
          priority: string | null
          title: string
        }
        Insert: {
          class_section?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type?: string | null
          grade_level: number
          id?: string
          priority?: string | null
          title: string
        }
        Update: {
          class_section?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string | null
          grade_level?: number
          id?: string
          priority?: string | null
          title?: string
        }
        Relationships: []
      }
      homework: {
        Row: {
          assigned_date: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          due_date: string | null
          estimated_minutes: number | null
          id: string
          status: string | null
          subject: string
          title: string
          user_id: string
        }
        Insert: {
          assigned_date?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          status?: string | null
          subject: string
          title: string
          user_id: string
        }
        Update: {
          assigned_date?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          status?: string | null
          subject?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "demo_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string
          format: string | null
          id: string
          input_type: string
          options: Json | null
          question_order: number
          question_text: string
        }
        Insert: {
          category: string
          format?: string | null
          id?: string
          input_type?: string
          options?: Json | null
          question_order: number
          question_text: string
        }
        Update: {
          category?: string
          format?: string | null
          id?: string
          input_type?: string
          options?: Json | null
          question_order?: number
          question_text?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          class_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          period: number
          start_time: string
          subject: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          period: number
          start_time: string
          subject: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          period?: number
          start_time?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          home_arrival_time: string | null
          id: string
          learning_style: string | null
          procrastination_risk: string | null
          raw_scores: Json | null
          reminder_tone: string | null
          sleep_time: string | null
          stress_level: string | null
          study_start_time: string | null
          user_id: string
        }
        Insert: {
          home_arrival_time?: string | null
          id?: string
          learning_style?: string | null
          procrastination_risk?: string | null
          raw_scores?: Json | null
          reminder_tone?: string | null
          sleep_time?: string | null
          stress_level?: string | null
          study_start_time?: string | null
          user_id: string
        }
        Update: {
          home_arrival_time?: string | null
          id?: string
          learning_style?: string | null
          procrastination_risk?: string | null
          raw_scores?: Json | null
          reminder_tone?: string | null
          sleep_time?: string | null
          stress_level?: string | null
          study_start_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "demo_users"
            referencedColumns: ["user_id"]
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
