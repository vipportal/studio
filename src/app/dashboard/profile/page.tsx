
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { cn } from "@/lib/utils";
import { Fingerprint, MapPin, Building, Award, Wallet } from "lucide-react";


const availableMembers = [
  { name: "Ayşe Y.", location: "Kadıköy", img: "https://placehold.co/100x100.png", hint: "woman smiling" },
  { name: "Fatma K.", location: "Şişli", img: "https://placehold.co/100x100.png", hint: "woman portrait" },
  { name: "Zeynep S.", location: "Üsküdar", img: "https://placehold.co/100x100.png", hint: "woman fashion" },
];

function InfoRow({ 
  label, 
  value, 
  badge = false, 
  valueClassName = "", 
  labelClassName = "",
  icon: Icon
}: { 
  label: string; 
  value: string; 
  badge?: boolean; 
  valueClassName?: string;
  labelClassName?: string;
  icon?: React.ComponentType<{ className?: string }>; 
}) {
  return (
    <div className="flex flex-col items-start gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <p className={cn("flex items-center gap-2 font-medium text-muted-foreground", labelClassName)}>
        {Icon && <Icon className="h-5 w-5" />}
        <span>{label}</span>
      </p>
      {badge ? (
        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">{value}</Badge>
      ) : (
        <p className={cn("font-medium", valueClassName)}>{value}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminMember | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <Avatar className="h-28 w-28 border-4 border-accent/50">
          <AvatarImage src={"https://placehold.co/100x100.png"} alt={user.name} data-ai-hint={"man portrait"} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-4xl font-headline font-bold">Hoşgeldiniz, {user.name}</h1>
          <div className="border border-blue-500/30 rounded-md p-3 bg-blue-500/5">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              SİZLERİ ARAMIZDA GÖRMEKTEN MUTLULUK DUYUYORUZ, BİLGİLERİNİZ 6698 KİŞİSEL VERİLERİN KORUNMASI KANUNU TARAFINDAN GİZLİ TUTULMAKTADIR, GÜVENLİ BİR ŞEKİLDE GÖRÜŞMELERİNİZİ YAPABİLİRSİNİZ. PARA TRANSFERLERİNİZİ BANKA HESAPLARINIZA GÜVENLİ BİR ŞEKİLDE ÇEKEBİLİRSİNİZ, İYİ GÖRÜŞMELER DİLİYORUZ.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgileriniz ve üyelik durumunuz.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <InfoRow label="TC Kimlik No" value={user.tc} icon={Fingerprint} labelClassName="text-blue-600" />
            <InfoRow label="İl" value={user.il} icon={MapPin} labelClassName="text-blue-600" />
            <InfoRow label="İlçe" value={user.ilce} icon={Building} labelClassName="text-blue-600" />
            <InfoRow label="Haftalık Kazanç" value={user.weeklyGain} icon={Wallet} labelClassName="text-green-600" valueClassName="text-green-600 font-bold" />
            <InfoRow label="Üyelik Durumu" value={"VIP Gold"} icon={Award} labelClassName="text-blue-600" badge />
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
