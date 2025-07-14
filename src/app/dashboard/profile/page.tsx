
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Fingerprint, MapPin, Building, Award, Wallet, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const availableMembers = [
  { name: "Ayşe Y." },
  { name: "Fatma K." },
  { name: "Zeynep S." },
];

function InfoRow({ 
  label, 
  value, 
  valueClassName = "", 
  labelClassName = "",
  icon: Icon
}: { 
  label: string; 
  value: string; 
  valueClassName?: string;
  labelClassName?: string;
  icon?: React.ComponentType<{ className?: string }>; 
}) {
  return (
    <div className="flex flex-col items-start gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 font-medium text-muted-foreground">
        {Icon && <Icon className="h-5 w-5" />}
        <span>{label}</span>
      </p>
      <p className={`font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <Skeleton className="h-28 w-28 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full max-w-2xl" />
      </div>
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-60" />
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center pb-3 border-b">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
        ))}
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-52" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="flex flex-col items-center p-4">
            <Skeleton className="h-20 w-20 rounded-full mb-4" />
            <Skeleton className="h-5 w-24" />
          </Card>
        ))}
      </CardContent>
    </Card>
  </div>
);


const ProfileLogo = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover">
        <defs>
            <filter id="blurry-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="40" fill="#4B0082" stroke="#32CD32" strokeWidth="4" filter="url(#blurry-glow)" />
    </svg>
);


export default function ProfilePage() {
  const router = useRouter();
  const { user, member, loading } = useAuth();
  const [selectedMember, setSelectedMember] = useState<{name: string} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
     if (user) {
        const welcomeToastTimeout = setTimeout(() => {
            const { id, dismiss } = toast({
              title: `SEVDA KİŞİSİNDEN MESAJINIZ VAR ❤️`,
              className: "toast-center bg-green-100 border-green-300 text-green-800",
            });
            
            const dismissTimeout = setTimeout(() => {
              dismiss(id);
            }, 4000);
            return () => clearTimeout(dismissTimeout);
          }, 3000);
        return () => clearTimeout(welcomeToastTimeout);
     }
  }, [user, toast]);

  if (loading || !member) {
    return <ProfileSkeleton />;
  }

  const isStatusActive = member.status === 'Aktif';

  const handleMemberClick = (member: {name: string}) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    const { id, dismiss } = toast({
      title: "✅ Başarılı",
      description: `Mesajınız ${selectedMember?.name} kişisine gönderildi.`,
      className: "toast-center bg-green-100 border-green-300 text-green-800",
    });

    setTimeout(() => {
      dismiss(id);
    }, 4000);
  }

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-accent/50">
            <ProfileLogo />
        </div>
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-4xl font-headline font-bold">Hoşgeldiniz, {member.name}</h1>
          <div className="border border-blue-500/40 rounded-lg p-4 bg-blue-500/10">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <p className="text-xs text-blue-800 dark:text-blue-300 text-left">
                SİZLERİ ARAMIZDA GÖRMEKTEN MUTLULUK DUYUYORUZ, BİLGİLERİNİZ 6698 KİŞİSEL VERİLERİN KORUNMASI KANUNU TARAFINDAN GİZLİ TUTULMAKTADIR, GÜVENLİ BİR ŞEKİLDE GÖRÜŞMELERİNİZİ YAPABİLİRSİNİZ. PARA TRANSFERLERİNİZİ BANKA HESAPLARINIZA GÜVENLİ BİR ŞEKİLDE ÇEKEBİLİRSİNİZ, İYİ GÖRÜŞMELER DİLİYORUZ.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl uppercase text-green-600">Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgileriniz ve üyelik durumunuz.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <InfoRow label="Telefon Numarası" value={member.phone} icon={Phone} labelClassName="text-blue-600 dark:text-blue-400" />
            <InfoRow label="TC Kimlik No" value={member.tc} icon={Fingerprint} labelClassName="text-blue-600 dark:text-blue-400" />
            <InfoRow label="İl" value={member.il} icon={MapPin} labelClassName="text-blue-600 dark:text-blue-400" />
            <InfoRow label="İlçe" value={member.ilce} icon={Building} labelClassName="text-blue-600 dark:text-blue-400" />
            <InfoRow label="Haftalık Kazanç" value={member.weeklyGain} icon={Wallet} labelClassName="text-green-600" valueClassName="text-green-600 font-bold" />
            <InfoRow 
              label="Üyelik Durumu" 
              value={member.status} 
              icon={Award} 
              labelClassName="text-blue-600 dark:text-blue-400"
              valueClassName={isStatusActive ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Müsait Bayan Üyeler</CardTitle>
          <CardDescription>Yakınınızdaki diğer üyeleri keşfedin.</CardDescription>
           <div className="pt-2">
             <p className="text-sm font-semibold animate-pulse">
                <span className="text-green-500">67 Aktif</span>, <span className="text-red-500">79 Pasif</span> Üye
             </p>
           </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
          {availableMembers.map(member => (
              <Card key={member.name} onClick={() => handleMemberClick(member)} className="flex flex-col items-center p-4 text-center transition-all hover:bg-card/60 cursor-pointer hover:shadow-lg hover:scale-105">
                <div className="relative h-20 w-20 mb-4 overflow-hidden rounded-full border-2 border-accent">
                   <ProfileLogo />
                </div>
                <p className="font-semibold">{member.name}</p>
              </Card>
          ))}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Mesaj Gönder: {selectedMember?.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSendMessage}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea id="message" placeholder="Mesajınızı buraya yazın..." required />
                  </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Gönder</Button>
                </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}
