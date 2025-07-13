import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Selin G.", location: "Beşiktaş", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman fashion outdoor"},
  { name: "Buse T.", location: "Sarıyer", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman city night"},
  { name: "Ceren E.", location: "Bakırköy", img: "https://placehold.co/300x400.png", status: "Meşgul", hint: "woman cafe"},
  { name: "Deniz M.", location: "Kadıköy", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman smiling beach"},
  { name: "Eylül A.", location: "Ataşehir", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman professional"},
  { name: "Figen D.", location: "Beylikdüzü", img: "https://placehold.co/300x400.png", status: "Meşgul", hint: "woman book"},
  { name: "Gizem Ö.", location: "Avcılar", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman portrait elegant"},
  { name: "Hande Ç.", location: "Fatih", img: "https://placehold.co/300x400.png", status: "Müsait", hint: "woman street style"},
];

export default function MembersPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Aynı Bölgede Müsait Olan Bayan Üyelerimiz</h1>
                <p className="text-muted-foreground">Yakınınızdaki diğer üyelerle tanışın.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => (
                    <Card key={member.name} className="group overflow-hidden">
                        <div className="relative">
                            <Image 
                                src={member.img} 
                                alt={member.name}
                                data-ai-hint={member.hint}
                                width={300} 
                                height={400} 
                                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <Badge variant={member.status === 'Müsait' ? 'default' : 'destructive'} className="absolute right-2 top-2 bg-green-600/80 backdrop-blur-sm text-primary-foreground">
                                {member.status}
                            </Badge>
                        </div>
                        <CardContent className="p-4 pt-4">
                            <h3 className="font-headline text-lg font-bold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.location}</p>
                            <Button className="mt-4 w-full" variant="outline">Profili Görüntüle</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
