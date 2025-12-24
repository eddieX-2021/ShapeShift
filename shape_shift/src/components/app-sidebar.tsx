"use client";
import { Home, Activity, Dumbbell, Salad, Bot, HelpCircle, LifeBuoy, User2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/lib/api"; // Import the logout function
import { toast } from "@/hooks/use-toast"; 
type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};
const aiLinks: NavLink[] = [{ href: "/ai", label: "AI Chatbot", icon: Bot }];
const mainLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/intake", label: "Daily Intake", icon: Activity },
  { href: "/exercise", label: "Exercise Plan", icon: Dumbbell },
  { href: "/diet", label: "Diet Planner", icon: Salad },
];

const helpItems = [
  { title: 'Help Center', url: '/help-center', icon: HelpCircle },
  { title: 'Feedback',    url: '/feedback',    icon: LifeBuoy },
];
export function AppSidebar() {
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
    } catch {
      toast({
        title: "Logout failed",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    }
  };
  return (
    <Sidebar className="w-64 shrink-0 h-screen border-r bg-white">
      <SidebarContent >
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel>ShapeShift</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted ${
                        pathname === href ? "bg-muted font-medium" : ""
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI & More Collapsible Group */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex items-center w-full text-xs text-gray-500 uppercase tracking-wide px-3 py-2">
                AI & More
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiLinks.map(({ href, label, icon: Icon }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={href}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted ${
                            pathname === href ? "bg-muted font-medium" : ""
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Help Section (Collapsible) */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex items-center w-full text-xs text-gray-500 uppercase tracking-wide px-3 py-2">
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {helpItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      {/* Footer with Dropdown */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
