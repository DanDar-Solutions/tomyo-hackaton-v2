import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DailyPlan } from "@/lib/types";

export type { DailyPlan };
export type { DailyTask } from "@/lib/types";

export function useDailyPlan() {
    const supabase = createClient();
    const [plan, setPlan] = useState<DailyPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePlan = async (userId: string, planDate?: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase.functions.invoke("build-and-plan", {
                body: { user_id: userId, plan_date: planDate ?? new Date().toLocaleDateString("en-CA") },
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}` },
            });
            if (err || data?.error) throw new Error(err?.message ?? data.error);
            setPlan(data as DailyPlan);
        } catch (e) {
            setError((e as Error).message ?? "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setPlan(null);
        setError(null);
    };

    return { plan, loading, error, generatePlan, reset };
}
