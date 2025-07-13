import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ContactInfo = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
            <h3 className="font-semibold text-green-700 dark:text-green-500">{title}</h3>
            <p className="text-muted-foreground text-sm sm:text-base">{children}</p>
        </div>
    </div>
);


export default function AddressPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-4">
            <MapPin className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold font-headline text-foreground">İletişim ve Adres</CardTitle>
              <p className="text-muted-foreground mt-1">Bize Ulaşmanın Yolları 📍</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
            <p className="text-lg text-muted-foreground">
                İnci olarak, operasyonlarımızı merkezi bir konumdan yönetiyoruz. Size daha iyi ve kesintisiz hizmet verebilmek adına tüm operasyonlarımız Ankara'daki merkez ofisimizden yürütülmektedir.
            </p>
            
            <div className="rounded-lg border bg-background/50 p-6 space-y-4">
                 <ContactInfo icon={<Building size={24} />} title="Tüzel Kişi Unvanı">
                    İnci İletişim ve Danışmanlık Hizmetleri Ltd. Şti.
                 </ContactInfo>
                <Separator />
                 <ContactInfo icon={<MapPin size={24} />} title="Merkez Ofis Adresi">
                    Kavaklıdere Mah. Atatürk Blv. No: 123, Kat: 4<br/>
                    06680 Çankaya/Ankara, Türkiye
                 </ContactInfo>
                  <Separator />
                 <ContactInfo icon={<Phone size={24} />} title="Destek Hattı">
                    +90 (212) 123 45 67 (Yalnızca WhatsApp)
                 </ContactInfo>
                  <Separator />
                 <ContactInfo icon={<Mail size={24} />} title="E-Posta Adresi">
                    destek@incivip.com
                 </ContactInfo>
            </div>
            
            <div className="mt-6 rounded-lg border shadow-md overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.742385153213!2d32.8573932153808!3d39.9234839794255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34e1c8b7b1b3d%3A0x4d6b1b7b7b7b1b3d!2sAtat%C3%BCrk%20Blv.%2C%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1689258600000"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Merkez Ofis Konumu"
                ></iframe>
            </div>

             <p className="text-center text-sm text-muted-foreground p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md border border-yellow-300/50">
               ⚠️ Güvenliğiniz ve gizliliğiniz önceliğimizdir. Bu nedenle fiziki ziyaretler yerine platformumuz üzerinden ve dijital kanallar aracılığıyla 7/24 hizmet vermekteyiz. Her türlü sorunuz için bizimle iletişime geçmekten çekinmeyin.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
