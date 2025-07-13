import type { ReactNode } from "react";
import Link from "next/link";
import { VenetianMask } from "lucide-react";
import { Card } from "@/components/ui/card";
import DashboardNavContent from "@/components/dashboard/nav-content";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                <VenetianMask className="h-8 w-8 text-accent" />
                <span className="font-headline text-2xl font-bold">
                VIP Portal
                </span>
            </Link>

            <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
                <DashboardNavContent />
            </div>

            <div className="flex flex-1 items-center justify-end md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menüyü Aç</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                    <Link href="/dashboard" className="mb-6 flex items-center space-x-2">
                        <VenetianMask className="h-8 w-8 text-accent" />
                        <span className="font-headline text-2xl font-bold">
                            VIP Portal
                        </span>
                    </Link>
                    <div className="flex flex-col space-y-2">
                        <DashboardNavContent />
                    </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </header>
      <main className="flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
