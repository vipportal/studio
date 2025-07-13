
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { VenetianMask, Instagram, Twitter, Facebook, Youtube, MessageCircle } from "lucide-react";
import DashboardNavContent from "@/components/dashboard/nav-content";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/dashboard/admin';

  return (
    <div className="flex min-h-screen w-full flex-col">
       {!isAdminPage && (
         <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
          <div className="container flex h-auto flex-col items-start gap-4 py-2 md:h-16 md:flex-row md:items-center">
              <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                  <VenetianMask className="h-8 w-8 text-primary" />
                  <span className="font-headline text-2xl font-bold">
                  VIP Portal
                  </span>
              </Link>

              <div className="w-full flex-1 md:flex md:items-center md:justify-end">
                <ScrollArea className="w-full whitespace-nowrap md:w-auto">
                    <DashboardNavContent />
                </ScrollArea>
              </div>
          </div>
        </header>
       )}
      <main className="flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="mt-auto border-t bg-background/50">
        <div className="container flex flex-col items-center justify-center gap-4 py-6">
            <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-semibold text-primary">Bizi Takip Edin:</p>
                <div className="flex gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                        <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                       <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                       <Facebook className="h-6 w-6" />
                    </a>
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                       <MessageCircle className="h-6 w-6" />
                    </a>
                     <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                       <Youtube className="h-6 w-6" />
                    </a>
                </div>
            </div>
             <p className="text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} İnci VIP Portal. Tüm hakları saklıdır.
            </p>
        </div>
      </footer>
    </div>
  );
}
