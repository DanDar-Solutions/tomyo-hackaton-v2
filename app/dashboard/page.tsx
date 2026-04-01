import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login"); // not logged in
    }

    return (
        <div>
            <h1>Welcome, {session.user.name}!</h1>
            <p>This is your personal dashboard.</p>
            {/* Load user-specific data from your DB */}
        </div>
    );
}