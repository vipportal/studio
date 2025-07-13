import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-accent" />
            <CardTitle className="text-3xl font-bold font-headline">Hakkımızda</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
                İnci olarak, üyelerimize en üst düzeyde kaliteli, güvenli ve özel bir hizmet sunmayı amaçlıyoruz. Platformumuz, gizlilik ve memnuniyet ilkeleri üzerine kurulmuştur. Üyelerimizin beklentilerini aşan bir deneyim sunmak için teknolojiyi ve insan odaklı yaklaşımımızı bir araya getiriyoruz.
            </p>
            <p>
                Amacımız, seçkin bir topluluk içinde, insanların birbirleriyle anlamlı ve güvenli ilişkiler kurabilecekleri bir ortam yaratmaktır. Her bir üyemizin mahremiyetine saygı duyuyor ve kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca titizlikle koruyoruz.
            </p>
            <p>
                Her zaman en iyisini sunmak için buradayız. Güveniniz bizim için en değerli hazinedir.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
