import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // Refresh Supabase auth session
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;
    const customUserStr = request.cookies.get("custom_auth_user")?.value;

    // Protect app routes — redirect unauthenticated users to login
    const { pathname } = request.nextUrl;
    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/auth");

    if (!isPublicRoute && !user && !customUserStr) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
