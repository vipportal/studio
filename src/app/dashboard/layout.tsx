
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { VenetianMask, Instagram, Twitter, Facebook, Youtube, MessageCircle } from "lucide-react";
import DashboardNavContent from "@/components/dashboard/nav-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";


function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname === '/dashboard/admin';
  const { user, loading } = useAuth(); // Use the central auth hook

  useEffect(() => {
    // Let the AuthProvider handle auth state and redirects
    // This effect now mainly handles admin-specific logic
    if (!loading) {
      const userRole = localStorage.getItem('userRole');
      if (isAdminPage && userRole !== 'admin') {
        router.push('/dashboard');
      } else if (!isAdminPage && !user) {
        // This case is now handled by the AuthProvider, but as a fallback
        router.push('/');
      }
    }
  }, [loading, user, isAdminPage, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p className="text-foreground">Yükleniyor...</p>
      </div>
    );
  }
  
  // Also check for admin role from localStorage for the admin page
  if (isAdminPage && localStorage.getItem('userRole') !== 'admin') {
      return (
        <div className="flex justify-center items-center h-screen bg-background">
            <p className="text-foreground">Yönlendiriliyor...</p>
        </div>
      )
  }

  // If not an admin page, but there's no user, show loading while redirecting
  if (!isAdminPage && !user) {
     return (
        <div className="flex justify-center items-center h-screen bg-background">
            <p className="text-foreground">Yönlendiriliyor...</p>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
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
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
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


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  )
}
