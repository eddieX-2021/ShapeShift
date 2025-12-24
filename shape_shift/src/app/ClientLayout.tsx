"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          setStatus("unauthenticated");

          if (!PUBLIC_PATHS.includes(pathname)) {
            router.replace("/login");
          }
          return;
        }

        setStatus("authenticated");

        // If logged in, keep them out of auth pages
        if (PUBLIC_PATHS.includes(pathname) && pathname !== "/") {
          router.replace("/");
        }
      } catch {
        // true network/server errors
        setStatus("unauthenticated");
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (status === "loading") {
    return <div className="p-6">Checking session…</div>;
  }

  if (status === "unauthenticated") {
    return <main className="p-6 max-w-5xl mx-auto">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6 border-l h-full">
            <SidebarTrigger />
            <div className="max-w-6xl mx-auto w-full">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
