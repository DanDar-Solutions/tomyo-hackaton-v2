"use server";

import { createClient } from "@/lib/supabase/server";
import type { Class } from "@/lib/types";

export async function getClasses(): Promise<Pick<Class, "id" | "grade" | "class_section" | "class_name">[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("classes")
        .select("id, grade, class_section, class_name")
        .order("grade")
        .order("class_section");

    if (error) return [];
    return data ?? [];
}
