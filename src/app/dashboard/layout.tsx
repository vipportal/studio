
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { VenetianMask, Menu, Instagram, Twitter, Facebook } from "lucide-react";
import DashboardNavContent from "@/components/dashboard/nav-content";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/dashboard/admin';

  return (
    <div className="flex min-h-screen w-full flex-col">
       {!isAdminPage && (
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
       )}
      <main className="flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="mt-auto border-t bg-background/50">
        <div className="container flex flex-col items-center justify-center gap-4 py-6 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} İnci VIP Portal. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Bizi Takip Edin:</p>
                <div className="flex gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                    </a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
