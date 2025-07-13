"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AdminMemberForm from "@/components/dashboard/admin-member-form";

export type AdminMember = {
  id: number;
  name: string;
  iban: string;
  bank: string;
  tc: string;
  il: string;
  ilce: string;
  weeklyGain: string;
  errorMessage: string;
  successMessage: string;
  invoiceAmount: string;
};

const initialMembers: AdminMember[] = [
  { id: 1, name: "Ali Veli", iban: "TR123456789", bank: "Garanti", tc: "11111111111", il: "İstanbul", ilce: "Beşiktaş", weeklyGain: "1500 TL", errorMessage: "Hata", successMessage: "Başarılı", invoiceAmount: "1250 TL" },
  { id: 2, name: "Ayşe Fatma", iban: "TR987654321", bank: "Akbank", tc: "22222222222", il: "Ankara", ilce: "Çankaya", weeklyGain: "2000 TL", errorMessage: "Hata", successMessage: "Başarılı", invoiceAmount: "1800 TL" },
];

export default function AdminPage() {
    const [members, setMembers] = useState<AdminMember[]>(initialMembers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<AdminMember | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        if (role !== 'admin') {
            router.push('/dashboard');
        }
    }, [router]);

    const handleAddMember = () => {
        setEditingMember(null);
        setIsFormOpen(true);
    }

    const handleEditMember = (member: AdminMember) => {
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

    const handleSaveMember = (memberData: Omit<AdminMember, 'id'> | AdminMember) => {
        if ('id' in memberData) {
            // Edit
            setMembers(prev => prev.map(m => m.id === memberData.id ? memberData : m));
             toast({
                title: "Başarılı",
                description: "Üye bilgileri güncellendi.",
            });
        } else {
            // Add
            const newMember = { ...memberData, id: Date.now() } as AdminMember;
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
                        <CardTitle className="text-3xl font-headline font-bold">Admin Paneli - Üye Yönetimi</CardTitle>
                        <CardDescription>Yeni üye ekleyin veya mevcut üyeleri düzenleyin.</CardDescription>
                    </div>
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddMember}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Yeni Üye Ekle
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</DialogTitle>
                            </DialogHeader>
                            <AdminMemberForm 
                                member={editingMember} 
                                onSave={handleSaveMember}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ad Soyad</TableHead>
                                    <TableHead>TC</TableHead>
                                    <TableHead>Banka</TableHead>
                                    <TableHead>IBAN</TableHead>
                                    <TableHead>İl/İlçe</TableHead>
                                    <TableHead>Haftalık Kazanç</TableHead>
                                    <TableHead>Fatura Tutarı</TableHead>
                                    <TableHead className="text-right">Eylemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.tc}</TableCell>
                                        <TableCell>{member.bank}</TableCell>
                                        <TableCell>{member.iban}</TableCell>
                                        <TableCell>{member.il}/{member.ilce}</TableCell>
                                        <TableCell>{member.weeklyGain}</TableCell>
                                        <TableCell>{member.invoiceAmount}</TableCell>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
