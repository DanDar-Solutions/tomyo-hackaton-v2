"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolLoginForm } from "./edumail";
import { RegistryLoginForm } from "./RegisteryId";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [tab, setTab] = useState<"school" | "registry">("school");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Select how you want to login</CardDescription>

          <div className="mt-4 flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setTab("school")}
              className={cn(
                "px-4 py-2 -mb-px font-medium transition-colors",
                tab === "school" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
              )}
            >
              School Email
            </button>
            <button
              type="button"
              onClick={() => setTab("registry")}
              className={cn(
                "px-4 py-2 -mb-px font-medium transition-colors",
                tab === "registry" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
              )}
            >
              Registry ID
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {tab === "school" ? <SchoolLoginForm /> : <RegistryLoginForm />}
        </CardContent>
      </Card>
    </div>
  );
}