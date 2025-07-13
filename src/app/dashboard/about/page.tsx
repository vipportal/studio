import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Lock, Gem, ShieldCheck } from "lucide-react";

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 rounded-lg border border-border/60 bg-background/40 p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
    <div className="text-primary">{icon}</div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-green-700 dark:text-green-500 mb-2">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  </div>
);


export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-4">
            <Info className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold font-headline text-foreground">Hakkımızda</CardTitle>
              <p className="text-muted-foreground mt-1">İnci'nin Değerleri ve Taahhütleri</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6 text-base">
            <p className="text-lg text-center text-muted-foreground italic">
                İnci olarak, seçkin üyelerimize en üst düzeyde kaliteli, güvenli ve özel bir hizmet sunmayı taahhüt ediyoruz. Platformumuz, temelinde gizlilik, memnuniyet ve güven ilkeleri üzerine kurulmuştur. Üyelerimizin beklentilerini aşan bir deneyim sunmak için teknolojiyi ve insan odaklı yaklaşımımızı bir araya getiriyoruz.
            </p>
            
            <div className="space-y-4">
                <FeatureCard icon={<Gem size={28} />} title="Kalite ve Seçkinlik ✨">
                    Amacımız, seçkin bir topluluk içinde, insanların birbirleriyle anlamlı ve güvenli ilişkiler kurabilecekleri bir ortam yaratmaktır. Her üyemizin platformumuzda geçirdiği zamanın değerli ve özel olmasını sağlıyoruz.
                </FeatureCard>
                <FeatureCard icon={<Lock size={28} />} title="Gizlilik ve Mahremiyet 🤫">
                    Her bir üyemizin mahremiyetine saygı duyuyor ve kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca en yüksek standartlarda, titizlikle koruyoruz. Bilgileriniz bizimle güvende.
                </FeatureCard>
                 <FeatureCard icon={<ShieldCheck size={28} />} title="Güven ve Memnuniyet 🛡️">
                    Güveniniz, bizim için en değerli hazinedir. Şeffaf iletişim ve kesintisiz destek ile her zaman yanınızdayız. Her zaman en iyisini sunmak ve memnuniyetinizi en üst seviyede tutmak için buradayız.
                </FeatureCard>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
