import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BrainCircuit, Rocket, HeartHandshake } from "lucide-react";

const TeamValue = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center gap-3 rounded-lg border border-border/60 p-6 bg-card transition-transform hover:scale-105 hover:shadow-xl">
    <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
    <h3 className="text-xl font-bold text-green-700 dark:text-green-500">{title}</h3>
    <p className="text-sm text-muted-foreground">{children}</p>
  </div>
);

export default function WhoWeArePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold font-headline text-foreground">Biz Kimiz?</CardTitle>
               <p className="text-muted-foreground mt-1">İnci'nin Arkasındaki Güçlü Ekip</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
            <p className="text-lg text-center text-muted-foreground italic">
                Biz, İnci ekibi olarak, alanında deneyimli ve profesyonel bir kadrodan oluşuyoruz. Üyelerimizin beklentilerini en üst seviyede karşılamak ve onlara unutulmaz bir deneyim yaşatmak için tutkuyla çalışıyoruz. 🚀
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TeamValue icon={<BrainCircuit size={32} />} title="Uzmanlık">
                    Ekibimiz, teknoloji, güvenlik ve insan ilişkileri konularında uzmanlaşmış, dinamik ve tecrübeli kişilerden oluşmaktadır.
                </TeamValue>
                <TeamValue icon={<Rocket size={32} />} title="İnovasyon">
                    Sürekli gelişim felsefemiz ile sektörde öncü olmayı, en yeni teknolojileri kullanarak hizmet kalitemizi devamlı artırmayı hedefliyoruz.
                </TeamValue>
                 <TeamValue icon={<HeartHandshake size={32} />} title="Adanmışlık">
                   Üyelerimizin memnuniyeti, başarımızın en büyük göstergesidir. Bu bilinçle, size adanmış bir şekilde her zaman daha iyisi için çabalıyoruz.
                </TeamValue>
            </div>

            <p className="text-center text-muted-foreground">
                Sizlere güvenilir ve kesintisiz bir hizmet sunmak, bizim en temel görevimizdir. Başarımızın arkasında, işine tutkuyla bağlı bu harika ekip var.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
