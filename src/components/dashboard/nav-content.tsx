
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  User,
  Wallet,
  Receipt,
  MessageSquareHeart,
  Users,
  ShieldCheck,
  LogOut,
  Info,
  MapPin,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const baseNavItems = [
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/balance", label: "Bakiye", icon: Wallet },
  { href: "/dashboard/invoices", label: "Faturalarım", icon: Receipt },
  { href: "/dashboard/meetings", label: "Görüşmelerim", icon: MessageSquareHeart },
  { href: "/dashboard/members", label: "Müsait Üyeler", icon: Users },
];

const menuItems = [
    { href: "/dashboard/about", label: "Hakkımızda", icon: Info },
    { href: "/dashboard/who-we-are", label: "Biz Kimiz", icon: Users },
    { href: "/dashboard/address", label: "Adresimiz", icon: MapPin },
];

const adminNavItem = { href: "/dashboard/admin", label: "Admin Paneli", icon: ShieldCheck };

export default function DashboardNavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('loggedInUser');
    }
    router.push("/");
  };
  
  const navItems = userRole === 'admin' ? [...baseNavItems, adminNavItem] : baseNavItems;

  const buttonClasses = "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors md:w-auto";
  const inactiveClasses = "bg-primary text-primary-foreground hover:bg-accent";
  const activeClasses = "bg-accent text-accent-foreground";

  return (
    <>
      <nav className="flex flex-col items-start gap-2 md:flex-row md:items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonClasses,
              pathname.startsWith(item.href) ? activeClasses : inactiveClasses
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(buttonClasses, inactiveClasses)}
                >
                    <Menu className="h-5 w-5" />
                    <span>Menü</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            {menuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
