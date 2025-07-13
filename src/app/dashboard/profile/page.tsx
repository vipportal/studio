import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const user = {
  name: "Ali Veli",
  tc: "12345678901",
  city: "İstanbul",
  district: "Beşiktaş",
  status: "VIP Gold",
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
        <Badge variant="default" className="bg-primary/80">{value}</Badge>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="space-y-8">
       <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold">Hoşgeldiniz, {user.name}</h1>
        <p className="text-muted-foreground">VIP Portalınıza genel bir bakış.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Profil Bilgileri</CardTitle>
          <CardDescription>Kişisel bilgileriniz ve üyelik durumunuz.</CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {availableMembers.map(member => (
            <Card key={member.name} className="flex flex-col items-center p-4 text-center transition-colors hover:bg-card/60">
              <Image src={member.img} alt={member.name} data-ai-hint={member.hint} width={80} height={80} className="mb-4 rounded-full border-2 border-accent" />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.location}</p>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
