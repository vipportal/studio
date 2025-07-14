
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Member = {
  id: number;
  name: string;
  status: "Müsait" | "Meşgul";
};

const initialMembers: Member[] = [
  { id: 1, name: "Selin G.", status: "Müsait" },
  { id: 2, name: "Buse T.", status: "Müsait" },
  { id: 3, name: "Ceren E.", status: "Meşgul" },
  { id: 4, name: "Deniz M.", status: "Müsait" },
  { id: 5, name: "Eylül A.", status: "Müsait" },
  { id: 6, name: "Figen D.", status: "Meşgul" },
  { id: 7, name: "Gizem Ö.", status: "Müsait" },
  { id: 8, name: "Hande Ç.", status: "Müsait" },
];

const ProfileLogo = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover">
        <defs>
            <filter id="blurry-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="40" fill="#4B0082" stroke="#32CD32" strokeWidth="4" filter="url(#blurry-glow)" />
    </svg>
);


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
                                <TableHead>Durum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialMembers.map((member) => (
                                <TableRow key={member.id} onClick={() => handleRowClick(member)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                            <ProfileLogo />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
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
