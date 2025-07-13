"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Wallet,
  Receipt,
  MessageSquareHeart,
  Users,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const baseNavItems = [
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/balance", label: "Bakiye", icon: Wallet },
  { href: "/dashboard/invoices", label: "Faturalarım", icon: Receipt },
  { href: "/dashboard/meetings", label: "Görüşmelerim", icon: MessageSquareHeart },
  { href: "/dashboard/members", label: "Müsait Üyeler", icon: Users },
];

const adminNavItem = { href: "/dashboard/admin", label: "Admin Paneli", icon: ShieldCheck };

export default function DashboardNavContent() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, []);

  const navItems = userRole === 'admin' ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <nav className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:w-auto",
            pathname.startsWith(item.href)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
