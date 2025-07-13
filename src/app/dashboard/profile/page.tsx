
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LogOut, Info, MapPin, Users } from "lucide-react";

const user = {
  name: "Ali Veli",
  tc: "12345678901",
  city: "İstanbul",
  district: "Beşiktaş",
  status: "VIP Gold",
  avatar: "https://placehold.co/100x100.png",
  avatarHint: "man portrait",
};

const availableMembers = [
  { name: "Ayşe Y.", location: "Kadıköy", img: "https://placehold.co/100x100.png", hint: "woman smiling" },
  { name: "Fatma K.", location: "Şişli", img: "https://placehold.co/100x100.png", hint: "woman portrait" },
  { name: "Zeynep S.", location: "Üsküdar", img: "https://placehold.co/100x100.png", hint: "woman fashion" },
];

function InfoRow({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">{label}</p>
      {badge ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">{value}</Badge>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [dialogContent, setDialogContent] = useState<{ title: string; description: string } | null>(null);

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

  return (
    <div className="space-y-8">
      <Dialog open={!!dialogContent} onOpenChange={(isOpen) => !isOpen && setDialogContent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>{dialogContent?.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-4xl font-headline font-bold">Hoşgeldiniz, {user.name}</h1>
          <div className="border border-blue-500/30 rounded-md p-3 bg-blue-500/5">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              SİZLERİ ARAMIZDA GÖRMEKTEN MUTLULUK DUYUYORUZ, BİLGİLERİNİZ 6698 KİŞİSEL VERİLERİN KORUNMASI KANUNU TARAFINDAN GİZLİ TUTULMAKTADIR, GÜVENLİ BİR ŞEKİLDE GÖRÜŞMELERİNİZİ YAPABİLİRSİNİZ. PARA TRANSFERLERİNİZİ BANKA HESAPLARINIZA GÜVENLİ BİR ŞEKİLDE ÇEKEBİLİRSİNİZ, İYİ GÖRÜŞMELER DİLİYORUZ.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Avatar className="h-24 w-24 border-4 border-accent/50 shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.avatarHint} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgileriniz ve üyelik durumunuz.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <InfoRow label="Ad Soyad" value={user.name} />
            <InfoRow label="TC Kimlik No" value={user.tc} />
            <InfoRow label="İl" value={user.city} />
            <InfoRow label="İlçe" value={user.district} />
            <InfoRow label="Üyelik Durumu" value={user.status} badge />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Aynı Bölgede Müsait Olan Üyelerimiz</CardTitle>
          <CardDescription>Yakınınızdaki diğer üyeleri keşfedin.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
          {availableMembers.map(member => (
            <Card key={member.name} className="flex flex-col items-center p-4 text-center transition-colors hover:bg-card/60">
              <Avatar className="h-20 w-20 mb-4 border-2 border-accent">
                <AvatarImage src={member.img} alt={member.name} data-ai-hint={member.hint} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.location}</p>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
