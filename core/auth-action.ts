import { createClient } from '../lib/supabase/client';
const supabase = createClient();
export async function signinRegistry(regNo: string, birthDate: string) {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('registeriin dugaar', regNo)
        .eq('birth date', birthDate)
        .maybeSingle();
    console.log("Supabase Data:", data);
    console.log("Supabase Error:", error);
    if (error) return { error: error.message, user: null };
    if (!data) return { error: "User not found", user: null };
    return { user: data };
}
export async function signinEduMail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        return { error: error.message };
    }
    return { user: data.user, session: data.session };
}