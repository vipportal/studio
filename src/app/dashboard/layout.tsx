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
import { Card } from "@/components/ui/card";

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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/50 p-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
        </header>
        <main className="flex-1 flex-col">
          <Card className="m-4 mb-0 rounded-b-none border-b-0 shadow-lg">
              <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                      <VenetianMask className="h-10 w-10 text-accent" />
                      <h1 className="text-3xl font-headline font-bold text-foreground">
                          VIP Portal
                      </h1>
                  </div>
                  <div className="hidden md:block">
                     <DashboardNavContent />
                  </div>
              </div>
          </Card>
          <div className="p-4 sm:p-6 lg:p-8 pt-0">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
