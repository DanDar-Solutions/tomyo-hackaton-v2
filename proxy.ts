import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

/**
 * Next.js 16.2.2+ Proxy Convention (previously Middleware)
 * Renamed to proxy per deprecation warning:
 * "⚠ The 'middleware' file convention is deprecated. Please use 'proxy' instead."
 */
export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets (.svg, .png, .jpg, .jpeg, .gif, .webp)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
