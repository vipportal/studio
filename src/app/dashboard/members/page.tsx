import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Selin G.", location: "Beşiktaş", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman fashion outdoor"},
  { name: "Buse T.", location: "Sarıyer", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman city night"},
  { name: "Ceren E.", location: "Bakırköy", img: "https://placehold.co/100x100.png", status: "Meşgul", hint: "woman cafe"},
  { name: "Deniz M.", location: "Kadıköy", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman smiling beach"},
  { name: "Eylül A.", location: "Ataşehir", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman professional"},
  { name: "Figen D.", location: "Beylikdüzü", img: "https://placehold.co/100x100.png", status: "Meşgul", hint: "woman book"},
  { name: "Gizem Ö.", location: "Avcılar", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman portrait elegant"},
  { name: "Hande Ç.", location: "Fatih", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman street style"},
];

export default function MembersPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Aynı Bölgede Müsait Olan Bayan Üyelerimiz</h1>
                <p className="text-muted-foreground">Yakınınızdaki diğer üyelerle tanışın.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {members.map((member) => (
                    <Card key={member.name} className="group overflow-hidden text-center">
                        <div className="relative mx-auto mt-4 h-24 w-24 overflow-hidden rounded-full">
                            <Image 
                                src={member.img} 
                                alt={member.name}
                                data-ai-hint={member.hint}
                                width={100} 
                                height={100} 
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 filter blur-sm brightness-75 hue-rotate-15"
                            />
                        </div>
                        <CardContent className="p-4 pt-2">
                            <h3 className="font-headline text-base font-bold truncate">{member.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{member.location}</p>
                             <Badge variant={member.status === 'Müsait' ? 'default' : 'destructive'} className="mt-2 scale-90 bg-green-600/80 text-primary-foreground">
                                {member.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
