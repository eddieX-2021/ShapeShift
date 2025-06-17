import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";

export const metadata = {
  title: "Shape Shift",
  description: "A weight loss app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en">
      <body className="min-h-screen">
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content - Modified this section */}
            <main className="flex-1">
  <div className="p-6 border-l h-full">
    <SidebarTrigger />
    <div className="max-w-6xl mx-auto w-full">{children}</div>
  </div>
</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}