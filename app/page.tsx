import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20  items-center">
        <nav className="w-full flex border-b h-16 justify-between items-center p-3 text-sm border">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>LOGO</Link>
            </div>
            <div className="flex gap-3">
              <ThemeSwitcher />
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
            </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
          <Hero />
          </main>
        </div>

      </div>
    </main>
  );
}
