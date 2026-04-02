"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentDemoUser } from "./auth.service";
import type { Homework, Schedule, UserProfile, DemoUserWithClass } from "@/lib/types";

export interface StudentDashboardData {
    homework: Homework[];
    schedule: Schedule[];
    profile: Pick<
        UserProfile,
        "learning_style" | "stress_level" | "study_start_time" | "home_arrival_time" | "sleep_time"
    > | null;
    user: DemoUserWithClass | null;
    error: string | null;
}

export async function getStudentDashboardData(
    id?: number | string | null,
): Promise<StudentDashboardData> {
    const user = await getCurrentDemoUser(id);
    if (!user) {
        return { error: "Not authenticated", homework: [], schedule: [], profile: null, user: null };
    }

    const supabase = await createClient();
    const classId = user.class_id;

    const [homeworkRes, scheduleRes, profileRes] = await Promise.all([
        supabase
            .from("homework")
            .select("id, subject, title, description, due_date, difficulty, estimated_minutes, status")
            .eq("user_id", user.user_id)
            .order("due_date", { ascending: true }),

        classId
            ? supabase
                .from("schedules")
                .select("id, day_of_week, period, subject, start_time, end_time")
                .eq("class_id", classId)
                .order("day_of_week")
                .order("period")
            : Promise.resolve({ data: [], error: null }),

        supabase
            .from("user_profiles")
            .select("learning_style, stress_level, study_start_time, home_arrival_time, sleep_time")
            .eq("user_id", user.user_id)
            .maybeSingle(),
    ]);

    return {
        homework: (homeworkRes.data ?? []) as Homework[],
        schedule: (scheduleRes.data ?? []) as Schedule[],
        profile:  profileRes.data ?? null,
        user,
        error: null,
    };
}
