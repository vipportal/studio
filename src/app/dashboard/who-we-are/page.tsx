import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function WhoWeArePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline">Biz Kimiz</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
                Biz, İnci ekibi olarak, alanında deneyimli ve profesyonel bir kadrodan oluşuyoruz. Üyelerimizin beklentilerini en üst seviyede karşılamak ve onlara unutulmaz bir deneyim yaşatmak için tutkuyla çalışıyoruz.
            </p>
            <p>
                Ekibimiz, sizlere güvenilir ve kesintisiz bir hizmet sunmak adına teknoloji, güvenlik ve insan ilişkileri konularında uzmanlaşmış kişilerden oluşmaktadır. Dinamik yapımız ve sürekli gelişim felsefemiz ile sektörde öncü olmayı hedefliyoruz.
            </p>
            <p>
                Üyelerimizin memnuniyeti, başarımızın en büyük göstergesidir. Bu bilinçle, her zaman daha iyisi için çabalıyoruz.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
