import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/Provider";
import { Toaster } from "sonner";
import { Suspense } from "react";
import FloatingProfile from "@/components/floating-profile";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Tsag mergen",
  description: "Your personal student dashboard for homework, grades, and schedules.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased flex flex-col min-h-screen bg-background`}>
        <Providers>
          {/* Floating profile ball (top-right) */}
          <Suspense fallback={null}>
            <FloatingProfile />
          </Suspense>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}