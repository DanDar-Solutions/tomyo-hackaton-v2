"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthResult, SignupResult, DemoUserWithClass } from "@/lib/types";

// ─────────────────────────────────────────────
// Sign In (Registry ID + password)
// ─────────────────────────────────────────────
export async function signinRegistry(
    regNo: string,
    password: string,
): Promise<AuthResult> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("demo_users")
        .select("*")
        .eq("user_id", regNo)
        .eq("password", password)
        .maybeSingle();

    if (error) return { error: "Something went wrong. Please try again.", user: null, hasQuiz: false };
    if (!data)  return { error: "Invalid user ID or password.", user: null, hasQuiz: false };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("custom_auth_user", data.user_id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        httpOnly: true,
    });

    // Check if onboarding quiz has been completed
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", regNo)
        .maybeSingle();

    revalidatePath("/", "layout");
    return { user: data, hasQuiz: !!profile, error: null };
}

// ─────────────────────────────────────────────
// Sign Up (plain text, hackathon style)
// ─────────────────────────────────────────────
export async function signupRegistry(
    regNo: string,
    password: string,
    confirmPassword: string,
): Promise<SignupResult> {
    if (!regNo || !password) return { error: "ID and password are required.", user: null };
    if (password !== confirmPassword) return { error: "Passwords do not match.", user: null };

    const supabase = await createClient();

    // Check if user_id already exists
    const { data: existing } = await supabase
        .from("demo_users")
        .select("user_id")
        .eq("user_id", regNo)
        .maybeSingle();

    if (existing) return { error: "This ID is already taken.", user: null };

    // Auto-assign first available class (class selection comes later)
    const { data: firstClass } = await supabase
        .from("classes")
        .select("id")
        .order("grade")
        .limit(1)
        .single();

    if (!firstClass) return { error: "No classes available. Contact admin.", user: null };

    // Insert new user (plain text password)
    const { data, error } = await supabase
        .from("demo_users")
        .insert({ user_id: regNo, password, class_id: firstClass.id })
        .select()
        .single();

    if (error) return { error: "Could not create account. " + error.message, user: null };

    // Auto-login: set session cookie
    const cookieStore = await cookies();
    cookieStore.set("custom_auth_user", data.user_id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        httpOnly: true,
    });

    revalidatePath("/", "layout");
    return { user: data, error: null };
}

// ─────────────────────────────────────────────
// Sign Out
// ─────────────────────────────────────────────
export async function signOut(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("custom_auth_user");
    await (await createClient()).auth.signOut();
    revalidatePath("/", "layout");
    redirect("/auth/login");
}

// ─────────────────────────────────────────────
// Get current logged-in demo user
// ─────────────────────────────────────────────
export async function getCurrentDemoUser(
    id?: string | number | null,
): Promise<DemoUserWithClass | null> {
    const supabase = await createClient();

    let searchId = id ? String(id) : null;

    if (!searchId) {
        const cookieStore = await cookies();
        searchId = cookieStore.get("custom_auth_user")?.value ?? null;
    }

    if (!searchId) return null;

    const { data, error } = await supabase
        .from("demo_users")
        .select("*, classes(id, grade, class_section, class_name)")
        .eq("user_id", searchId)
        .maybeSingle();

    if (error) {
        console.error("getCurrentDemoUser error:", error.message);
        return null;
    }

    return data as DemoUserWithClass | null;
}
