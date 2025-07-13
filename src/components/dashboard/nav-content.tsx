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

const navItems = [
  { href: "/dashboard/profile", label: "Profil", icon: User, tooltip: "Profil" },
  { href: "/dashboard/balance", label: "Bakiye", icon: Wallet, tooltip: "Bakiye" },
  { href: "/dashboard/invoices", label: "Faturalarım", icon: Receipt, tooltip: "Faturalarım" },
  { href: "/dashboard/meetings", label: "Görüşmelerim", icon: MessageSquareHeart, tooltip: "Görüşmelerim" },
  { href: "/dashboard/members", label: "Müsait Üyeler", icon: Users, tooltip: "Müsait Üyeler" },
];

export default function DashboardNavContent() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              tooltip={{ children: item.tooltip, side: "right" }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
