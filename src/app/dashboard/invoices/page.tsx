
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VenetianMask } from "lucide-react";
import { format, addDays } from "date-fns";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { getMembers } from "@/lib/member-storage";

const VAT_RATE = 0.20;

export default function InvoicesPage() {
  const [currentUser, setCurrentUser] = useState<AdminMember | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
      const allMembers = getMembers();
      const parsedUser = JSON.parse(loggedInUserData);
      const freshUserData = allMembers.find(m => m.id === parsedUser.id);
      setCurrentUser(freshUserData || null);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  const invoiceAmountNumber = parseFloat(currentUser.invoiceAmount) || 0;
  const subtotal = invoiceAmountNumber / (1 + VAT_RATE);
  const vatAmount = invoiceAmountNumber - subtotal;
  
  const creationDate = new Date(currentUser.id);
  const dueDate = format(addDays(creationDate, 15), "dd.MM.yyyy");

  return (
    <Card className="max-w-4xl mx-auto my-8 font-sans shadow-lg">
      <CardHeader className="bg-muted/30 p-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">E-Arşiv Fatura</h1>
                <p className="text-muted-foreground">Fatura No: INV2024{currentUser.id.toString().slice(-6)}</p>
            </div>
            <div className="flex items-center gap-2 text-right">
                <VenetianMask className="h-10 w-10 text-green-600" />
                 <span className="font-headline text-2xl font-bold text-gray-800">
                    VIP Portal
                </span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <h2 className="font-semibold text-gray-700">Fatura Bilgileri</h2>
                <p className="text-sm"><span className="font-medium text-gray-600">e-Arşiv No:</span> VIP20240000{currentUser.id.toString().slice(-6)}</p>
                <p className="text-sm"><span className="font-medium text-gray-600">Son Ödeme Tarihi:</span> {dueDate}</p>
            </div>
            <div className="space-y-2 text-left md:text-right">
                <h2 className="font-semibold text-gray-700">Üye Bilgileri</h2>
                <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.ilce}, {currentUser.il}</p>
                <p className="text-sm text-gray-600">TCKN: {currentUser.tc}</p>
            </div>
        </div>
        
        <Separator />

        <div>
            <Table>
            <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-green-800">Açıklama</TableHead>
                <TableHead className="text-center text-green-800">Miktar</TableHead>
                <TableHead className="text-right text-green-800">Birim Fiyat</TableHead>
                <TableHead className="text-right text-green-800">Toplam</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium text-gray-800">Reklam Katalog Ücretleri</TableCell>
                    <TableCell className="text-center text-gray-600">1</TableCell>
                    <TableCell className="text-right font-mono text-gray-600">{subtotal.toFixed(2)} TL</TableCell>
                    <TableCell className="text-right font-mono text-gray-600">{subtotal.toFixed(2)} TL</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </div>

        <Separator />
        
        <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-mono font-medium text-gray-800">{subtotal.toFixed(2)} TL</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%{VAT_RATE * 100}):</span>
                    <span className="font-mono font-medium text-gray-800">{vatAmount.toFixed(2)} TL</span>
                </div>
                 <div className="flex justify-between font-bold text-lg text-green-700">
                    <span>Genel Toplam:</span>
                    <span className="font-mono">{currentUser.invoiceAmount}</span>
                </div>
            </div>
        </div>

        <Separator />

        <div className="text-center space-y-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">ÖDENDİ</Badge>
            <p className="text-xs text-gray-500">Bu bir e-Arşiv faturasıdır ve elektronik ortamda muhafaza edilmektedir.</p>
        </div>

      </CardContent>
    </Card>
  );
}
