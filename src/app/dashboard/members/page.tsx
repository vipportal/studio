
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Member = {
  id: number;
  name: string;
  location: string;
  img: string;
  status: "Müsait" | "Meşgul";
  hint: string;
};

const initialMembers: Member[] = [
  { id: 1, name: "Selin G.", location: "Beşiktaş", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman fashion outdoor"},
  { id: 2, name: "Buse T.", location: "Sarıyer", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman city night"},
  { id: 3, name: "Ceren E.", location: "Bakırköy", img: "https://placehold.co/100x100.png", status: "Meşgul", hint: "woman cafe"},
  { id: 4, name: "Deniz M.", location: "Kadıköy", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman smiling beach"},
  { id: 5, name: "Eylül A.", location: "Ataşehir", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman professional"},
  { id: 6, name: "Figen D.", location: "Beylikdüzü", img: "https://placehold.co/100x100.png", status: "Meşgul", hint: "woman book"},
  { id: 7, name: "Gizem Ö.", location: "Avcılar", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman portrait elegant"},
  { id: 8, name: "Hande Ç.", location: "Fatih", img: "https://placehold.co/100x100.png", status: "Müsait", hint: "woman street style"},
];

export default function MembersPage() {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleRowClick = (member: Member) => {
        setSelectedMember(member);
        setIsDialogOpen(true);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDialogOpen(false);
        const { id, dismiss } = toast({
            title: "✅ Başarılı",
            description: `Mesajınız ${selectedMember?.name} kişisine gönderildi.`,
            className: "toast-center bg-green-100 border-green-300 text-green-800",
        });

        setTimeout(() => {
            dismiss(id);
        }, 4000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle className="text-3xl font-headline font-bold">Müsait Üyeler</CardTitle>
                        <CardDescription>Sizin için uygun olan üyelerimiz.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profil</TableHead>
                                <TableHead>Ad Soyad</TableHead>
                                <TableHead>Konum</TableHead>
                                <TableHead>Durum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialMembers.map((member) => (
                                <TableRow key={member.id} onClick={() => handleRowClick(member)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                            <Image 
                                                src={member.img} 
                                                alt={member.name}
                                                data-ai-hint={member.hint}
                                                width={48} 
                                                height={48} 
                                                className="h-full w-full object-cover filter blur-md brightness-50 sepia saturate-200 hue-rotate-[200deg]"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{member.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.status === 'Müsait' ? 'default' : 'destructive'} className="bg-green-600/80 text-primary-foreground">
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mesaj Gönder: {selectedMember?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendMessage}>
                        <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Mesajınız</Label>
                            <Textarea id="message" placeholder="Mesajınızı buraya yazın..." required />
                        </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Gönder</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
