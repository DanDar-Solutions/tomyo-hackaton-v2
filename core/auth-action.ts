"use server"

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function signinRegistry(regNo: string, birthDate: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('register_id', regNo)
        .eq('birth_date', birthDate)
        .maybeSingle();

    if (error) return { error: error.message, user: null };
    if (!data) return { error: "User not found", user: null };

    // Set custom session cookie for Hackathon 
    const cookieStore = await cookies();
    cookieStore.set('custom_auth_user', JSON.stringify(data), { path: '/' });
    
    return { user: data, error: null };
}

export async function signinEduMail(email: string, password: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) {
        return { error: error.message };
    }
    return { user: data.user, error: null };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    // Clear custom cookie
    const cookieStore = await cookies();
    cookieStore.delete('custom_auth_user');
}

export async function saveQuizResults(answers: Record<string, string>) {
    const cookieStore = await cookies();
    const customUserStr = cookieStore.get("custom_auth_user")?.value;
    const supabase = await createClient();
    
    let userId = "";
    if (customUserStr) {
        try {
            const parsed = JSON.parse(customUserStr);
            userId = parsed.register_id || parsed.id?.toString() || "";
        } catch (e) {}
    } else {
        const { data } = await supabase.auth.getUser();
        if (data?.user) userId = data.user.id;
    }

    if (!userId) {
        return { error: "You must be logged in to save quiz results." };
    }

    // Attempt to satisfy Foreign Key constraints safely before saving profile.
    // Assuming new users need an entry in demo_users to be viable for user_profiles.
    await supabase.from('demo_users').upsert({ user_id: userId, password: "temp_password_123" }, { onConflict: 'user_id' });

    // Assuming you want to map q1 to learning_style as visual/auditory etc.
    const profileData = {
        user_id: userId,
        learning_style: answers["q1"] || null,
        stress_level: answers["q3"] || null,
        raw_scores: answers // Stores the full JSON payload
    };

    const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}