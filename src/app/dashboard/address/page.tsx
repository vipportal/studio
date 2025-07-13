import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function AddressPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-accent" />
            <CardTitle className="text-3xl font-bold font-headline">Adresimiz</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-muted-foreground">
            <p>
                İnci olarak, operasyonlarımızı merkezi bir konumdan yönetiyoruz. Size daha iyi ve kesintisiz hizmet verebilmek adına tüm operasyonlarımız Ankara'daki merkez ofisimizden yürütülmektedir.
            </p>
            <p className="font-semibold text-foreground">
                İnci İletişim ve Danışmanlık Hizmetleri Ltd. Şti.
            </p>
            <p>
                Kavaklıdere Mah. Atatürk Blv. No: 123, Kat: 4<br/>
                06680 Çankaya/Ankara<br/>
                Türkiye
            </p>
            <p>
               Güvenliğiniz ve gizliliğiniz önceliğimizdir. Bu nedenle fiziki ziyaretler yerine platformumuz üzerinden 7/24 hizmet vermekteyiz. Her türlü sorunuz için bizimle dijital kanallar aracılığıyla iletişime geçebilirsiniz.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
