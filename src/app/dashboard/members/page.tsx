"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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

const MemberForm = ({ member, onSave, onCancel }: { member?: Member | null, onSave: (member: Omit<Member, 'id'> | Member) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        name: member?.name || "",
        location: member?.location || "",
        status: member?.status || "Müsait",
        img: member?.img || "https://placehold.co/100x100.png",
        hint: member?.hint || "woman portrait"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const handleStatusChange = (value: "Müsait" | "Meşgul") => {
        setFormData(prev => ({ ...prev, status: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const memberData = member ? { ...member, ...formData } : { ...formData };
        onSave(memberData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Örn: Selin G." required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="location">Konum</Label>
                <Input id="location" value={formData.location} onChange={handleChange} placeholder="Örn: Beşiktaş" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select onValueChange={handleStatusChange} defaultValue={formData.status}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Durum Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Müsait">Müsait</SelectItem>
                        <SelectItem value="Meşgul">Meşgul</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>İptal</Button>
                <Button type="submit">Kaydet</Button>
            </DialogFooter>
        </form>
    )
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const { toast } = useToast();

    const handleAddMember = () => {
        setEditingMember(null);
        setIsFormOpen(true);
    }

    const handleEditMember = (member: Member) => {
        setEditingMember(member);
        setIsFormOpen(true);
    }
    
    const handleDeleteMember = (id: number) => {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Başarılı",
        description: "Üye başarıyla silindi.",
      });
    }

    const handleSaveMember = (memberData: Omit<Member, 'id'> | Member) => {
        if ('id' in memberData) {
            // Edit
            setMembers(prev => prev.map(m => m.id === memberData.id ? memberData : m));
             toast({
                title: "Başarılı",
                description: "Üye bilgileri güncellendi.",
            });
        } else {
            // Add
            const newMember = { ...memberData, id: Date.now() };
            setMembers(prev => [...prev, newMember]);
             toast({
                title: "Başarılı",
                description: "Yeni üye eklendi.",
            });
        }
        setIsFormOpen(false);
        setEditingMember(null);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-headline font-bold">Üye Yönetimi</CardTitle>
                        <CardDescription>Yeni üye ekleyin veya mevcut üyeleri düzenleyin.</CardDescription>
                    </div>
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddMember}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Yeni Üye Ekle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</DialogTitle>
                            </DialogHeader>
                            <MemberForm 
                                member={editingMember} 
                                onSave={handleSaveMember}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profil</TableHead>
                                <TableHead>Ad Soyad</TableHead>
                                <TableHead>Konum</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">Eylemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                            <Image 
                                                src={member.img} 
                                                alt={member.name}
                                                data-ai-hint={member.hint}
                                                width={48} 
                                                height={48} 
                                                className="h-full w-full object-cover filter blur-sm brightness-75 hue-rotate-15"
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
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditMember(member)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
