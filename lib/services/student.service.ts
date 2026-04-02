"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentDemoUser } from "./auth.service";
import type { Homework, Schedule, UserProfile, DemoUserWithClass, GradeEvent } from "@/lib/types";

export interface StudentDashboardData {
    homework: Homework[];
    schedule: Schedule[];
    gradeEvents: GradeEvent[];
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
        return { error: "Not authenticated", homework: [], schedule: [], gradeEvents: [], profile: null, user: null };
    }

    const supabase = await createClient();
    const classId    = user.class_id;
    const grade      = user.classes?.grade;
    const section    = user.classes?.class_section;

    const [homeworkRes, scheduleRes, profileRes, eventsRes] = await Promise.all([
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

        grade !== undefined
            ? supabase
                .from("grade_events")
                .select("*")
                .eq("grade_level", grade)
                .or(`class_section.eq.${section},class_section.is.null`)
                .order("event_date", { ascending: true })
            : Promise.resolve({ data: [], error: null })
    ]);

    return {
        homework: (homeworkRes.data ?? []) as Homework[],
        schedule: (scheduleRes.data ?? []) as Schedule[],
        gradeEvents: (eventsRes.data ?? []) as GradeEvent[],
        profile:  profileRes.data ?? null,
        user,
        error: null,
    };
}
