
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
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";

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
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };
  
  const buttonClasses = "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors text-primary-foreground bg-primary flex-shrink-0";
  const activeClasses = "bg-accent text-accent-foreground";

  if (isAdmin) {
    return (
       <div className="flex w-full flex-row gap-2 md:gap-4">
          <Link
              href={adminNavItem.href}
              className={cn(
                  buttonClasses,
                  pathname.startsWith(adminNavItem.href) && activeClasses
              )}
          >
              <adminNavItem.icon className="h-5 w-5" />
              <span>{adminNavItem.label}</span>
          </Link>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className={cn(buttonClasses, "bg-destructive")}
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </Button>
      </div>
    )
  }

  // Regular Member Navigation
  const allNavLinks = [...baseNavItems, 
    {
      isMenu: true,
      label: "Menü",
      icon: Menu,
      items: menuItems,
    }
  ];

  return (
    <div className="grid w-full grid-cols-3 gap-2 md:flex md:flex-row md:gap-4">
      {allNavLinks.map((item) => {
          if (item.isMenu) {
              return (
                   <DropdownMenu key={item.label}>
                      <DropdownMenuTrigger asChild>
                          <Button className={cn(buttonClasses)}>
                              <item.icon className="h-5 w-5" />
                              <span>{item.label}</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      {item.items.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild className="cursor-pointer">
                            <Link href={subItem.href}>
                              <subItem.icon className="mr-2 h-4 w-4" />
                              <span>{subItem.label}</span>
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
              )
          }
           return (
              <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                      buttonClasses,
                      pathname.startsWith(item.href) && activeClasses
                  )}
              >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
              </Link>
          );
      })}
    </div>
  );
}
