import { cookies } from "next/headers";
import { getStudentDashboardData } from "@/core/fetches";
import StudentDashboard from "@/components/dashboard/dashboard";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { Suspense } from "react";
import { redirect } from "next/navigation";

async function DashboardDataWrapper() {
    const cookieStore = await cookies();
    const customUserStr = cookieStore.get("custom_auth_user")?.value;
    const { homework, schedule, profile, user: studentInfo, error: fetchError } =
        await getStudentDashboardData(customUserStr);
    if (fetchError || !studentInfo) {
        redirect("/auth/login");
    }
    return (
        <StudentDashboard
            user={studentInfo}
            homework={homework ?? []}
            schedule={schedule ?? []}
            profile={profile ?? null}
        />
    );
}
export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardDataWrapper />
        </Suspense>
    );
}