"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/api"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const PUBLIC_PATHS = [
  "/", 
  "/login", 
  "/register",
  "/forgot-password",
  "/reset-password"
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading"|"authenticated"|"unauthenticated">("loading")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser()
        setStatus("authenticated")

        // if they’re already logged in, kick them off any auth page back home:
        if (PUBLIC_PATHS.includes(pathname) && pathname !== "/") {
          router.replace("/")
        }
      } catch {
        setStatus("unauthenticated")

        // only redirect to /login if they’re not on one of our public screens:
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace("/login")
        }
      }
    }
    checkAuth()
  }, [router, pathname])

  if (status === "loading") {
    return <div className="p-6">Checking session…</div>
  }

  if (status === "unauthenticated") {
    // anyone: show your public pages (home, login, register, forgot/reset)
    return <main className="p-6 max-w-5xl mx-auto">{children}</main>
  }

  // authenticated: show the app sidebar layout
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
  )
}
