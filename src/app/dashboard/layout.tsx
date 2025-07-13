import type { ReactNode } from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardNavContent from "@/components/dashboard/nav-content";
import { VenetianMask } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard/profile" className="flex items-center gap-2 p-2">
            <VenetianMask className="h-8 w-8 text-accent" />
            <h2 className="text-xl font-headline font-bold text-foreground">
              VIP Portal
            </h2>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNavContent />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/50 p-4 backdrop-blur-sm md:justify-end">
          <SidebarTrigger className="md:hidden" />
          {/* User menu can be added here */}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
