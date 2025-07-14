
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BrainCircuit, Rocket, HeartHandshake, Quote } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import InciLogo from "@/components/inci-logo";

const TeamValue = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center gap-3 rounded-lg border border-border/60 p-6 bg-card transition-transform hover:scale-105 hover:shadow-xl h-full">
    <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
    <h3 className="text-xl font-bold text-green-700 dark:text-green-500">{title}</h3>
    <p className="text-sm text-muted-foreground">{children}</p>
  </div>
);

const TeamMemberCard = ({ name, title, bio }: { name: string; title: string; bio: string; }) => (
    <Card className="text-center overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 group">
        <CardContent className="p-6 flex flex-col items-center">
             <div className="relative h-24 w-24 mb-4 overflow-hidden rounded-full border-2 border-primary/50 transition-transform group-hover:scale-110">
                <InciLogo />
            </div>
            <h4 className="text-lg font-semibold text-foreground">{name}</h4>
            <p className="text-sm font-medium text-primary">{title}</p>
            <p className="mt-2 text-xs text-muted-foreground">{bio}</p>
        </CardContent>
    </Card>
);

const TestimonialCard = ({ quote, author, location }: { quote: string; author: string; location: string }) => (
  <div className="rounded-lg border bg-background/50 p-6 shadow-sm">
    <Quote className="h-6 w-6 text-green-500 mb-2" />
    <p className="text-muted-foreground italic mb-4">"{quote}"</p>
    <p className="text-right font-semibold text-foreground">{author} <span className="font-normal text-muted-foreground">- {location}</span></p>
  </div>
);


export default function WhoWeArePage() {
  return (
    <div className="container mx-auto max-w-5xl py-8">
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
        <CardContent className="space-y-12 p-6 md:p-8">
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

            <Separator />
            
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Ekibimizle Tanışın</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <TeamMemberCard 
                    name="Sevda K."
                    title="Kurucu & CEO"
                    bio="İnsanları bir araya getirme tutkusuyla İnci'yi kurdu. Vizyonu, güven ve kalite üzerine kurulu seçkin bir topluluk yaratmak."
                 />
                 <TeamMemberCard 
                    name="Ahmet Y."
                    title="Teknoloji Lideri (CTO)"
                    bio="Platformun güvenli ve kesintisiz çalışmasını sağlayan teknoloji dehası. Kullanıcı gizliliği ve veri güvenliği en büyük önceliği."
                 />
                 <TeamMemberCard 
                    name="Elif A."
                    title="Üye İlişkileri Direktörü"
                    bio="Üyelerimizin mutluluğu ve memnuniyeti için çalışan enerjik lider. Her üyenin özel ve değerli hissetmesini sağlamak için burada."
                 />
              </div>
            </div>

            <Separator />

            <div>
                 <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Üyelerimiz Ne Diyor?</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TestimonialCard 
                        quote="İnci sayesinde hayatımın en anlamlı buluşmasını yaşadım. Platformun kalitesi ve üyelerin seviyesi gerçekten fark yaratıyor. Teşekkürler!"
                        author="Mehmet A."
                        location="İstanbul"
                    />
                     <TestimonialCard 
                        quote="Güvenlik ve gizlilik benim için çok önemliydi. İnci, bu konuda beklentilerimin çok ötesine geçti. Kendimi hiç bu kadar güvende hissetmemiştim."
                        author="Zeynep T."
                        location="Ankara"
                    />
                 </div>
            </div>


            <p className="text-center text-muted-foreground pt-4">
                Sizlere güvenilir ve kesintisiz bir hizmet sunmak, bizim en temel görevimizdir. Başarımızın arkasında, işine tutkuyla bağlı bu harika ekip var.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
