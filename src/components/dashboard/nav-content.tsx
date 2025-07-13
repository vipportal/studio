"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  User,
  Wallet,
  Receipt,
  MessageSquareHeart,
  Users,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/profile", label: "Profil", icon: User, tooltip: "Profil" },
  { href: "/dashboard/balance", label: "Bakiye", icon: Wallet, tooltip: "Bakiye" },
  { href: "/dashboard/invoices", label: "Faturalarım", icon: Receipt, tooltip: "Faturalarım" },
  { href: "/dashboard/meetings", label: "Görüşmelerim", icon: MessageSquareHeart, tooltip: "Görüşmelerim" },
  { href: "/dashboard/members", label: "Müsait Üyeler", icon: Users, tooltip: "Müsait Üyeler" },
];

export default function DashboardNavContent() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu className={cn(
      "flex flex-row items-center",
      isMobile && "flex-col"
    )}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            variant="outline"
            className="border-none shadow-none"
            isActive={pathname.startsWith(item.href)}
            tooltip={{ children: item.tooltip, side: "bottom" }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
