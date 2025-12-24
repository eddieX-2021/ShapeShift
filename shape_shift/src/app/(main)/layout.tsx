"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser, type CurrentUser } from "@/lib/api";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <div className="flex min-h-screen">
      {user && <AppSidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
