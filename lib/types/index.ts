import type { Tables } from "./database";

// ─── Row Types (from Supabase) ───────────────────────────────────────────────

export type DemoUser    = Tables<"demo_users">;
export type Class       = Tables<"classes">;
export type Homework    = Tables<"homework">;
export type Schedule    = Tables<"schedules">;
export type UserProfile = Tables<"user_profiles">;
export type Question    = Tables<"questions">;
export type AiPlan      = Tables<"ai_plans">;
export type GradeEvent  = Tables<"grade_events">;

// ─── Joined / Extended Types ─────────────────────────────────────────────────

/** DemoUser with the related class info joined. */
export interface DemoUserWithClass extends DemoUser {
    classes: Pick<Class, "id" | "grade" | "class_section" | "class_name"> | null;
}

// ─── Dashboard Props ─────────────────────────────────────────────────────────

export interface StudentDashboardProps {
    user: DemoUserWithClass;
    homework: Homework[];
    schedule: Schedule[];
    gradeEvents: GradeEvent[];
    profile: Pick<
        UserProfile,
        "learning_style" | "stress_level" | "study_start_time" | "home_arrival_time" | "sleep_time"
    > | null;
}

// ─── Quiz Types ──────────────────────────────────────────────────────────────

export interface QuestionOption {
    label: string;
    value: string;
}

export interface QuestionsProps {
    user: DemoUserWithClass;
    onComplete: (updatedUser: DemoUserWithClass) => void;
}

// ─── Daily Plan Types ────────────────────────────────────────────────────────

export interface DailyTask {
    task: string;
    subject: string;
    homework_id: string | null;
    duration_minutes: number;
    is_urgent: boolean;
    reason: string;
    study_tip: string;
}

export interface DailyPlan {
    summary: string;
    stress_load: "low" | "medium" | "high";
    recommended_start_time: string;
    tasks: DailyTask[];
    ai_message: string;
}

// ─── Auth Service Return Types ───────────────────────────────────────────────

export interface AuthResult {
    error: string | null;
    user: DemoUser | null;
    hasQuiz?: boolean;
}

export interface SignupResult {
    error: string | null;
    user: DemoUser | null;
}
