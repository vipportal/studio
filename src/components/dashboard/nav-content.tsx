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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dialogContent, setDialogContent] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
    }
    router.push("/");
  };
  
  const menuItems = [
    { 
      label: "Hakkımızda", 
      icon: Info,
      action: () => setDialogContent({ 
        title: "Hakkımızda", 
        description: "VIP Portal olarak, üyelerimize en üst düzeyde kaliteli, güvenli ve özel bir hizmet sunmayı amaçlıyoruz. Platformumuz, gizlilik ve memnuniyet ilkeleri üzerine kurulmuştur. Her zaman en iyisini sunmak için buradayız."
      }) 
    },
    { 
      label: "Adresimiz", 
      icon: MapPin,
      action: () => setDialogContent({ 
        title: "Adresimiz", 
        description: "Size daha iyi hizmet verebilmek için merkezi bir konumda bulunuyoruz. Tüm operasyonlarımız İstanbul merkez ofisimizden yürütülmektedir. Güvenliğiniz ve gizliliğiniz için fiziki ziyaretler yerine platformumuz üzerinden hizmet vermekteyiz."
      }) 
    },
    { 
      label: "Biz Kimiz", 
      icon: Users,
      action: () => setDialogContent({ 
        title: "Biz Kimiz", 
        description: "Deneyimli ve profesyonel bir ekiple, üyelerimizin beklentilerini en üst seviyede karşılamak için çalışıyoruz. Ekibimiz, sizlere güvenilir ve kesintisiz bir deneyim yaşatmak adına teknoloji ve insan odaklı çözümler üretmektedir."
      }) 
    },
  ];

  const navItems = userRole === 'admin' ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <>
      <Dialog open={!!dialogContent} onOpenChange={(isOpen) => !isOpen && setDialogContent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>{dialogContent?.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:w-auto text-muted-foreground")}>
                    <Menu className="h-5 w-5" />
                    <span>Menü</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            {menuItems.map((item) => (
                <DropdownMenuItem key={item.label} onClick={item.action} className="cursor-pointer">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
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
