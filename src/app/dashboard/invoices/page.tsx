import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VenetianMask } from "lucide-react";

const invoice = {
  invoiceNumber: "INV202400123",
  eArchiveNumber: "VIP2024000000123",
  date: "15.06.2024",
  dueDate: "30.06.2024",
  member: {
    name: "Ali Veli",
    address: "Beşiktaş, İstanbul",
    tc: "12345678901",
  },
  items: [
    { description: "VIP Gold Üyelik - Haziran 2024", quantity: 1, unitPrice: 1041.67, total: 1041.67 },
  ],
  subtotal: 1041.67,
  vatRate: 0.20,
  vatAmount: 208.33,
  total: 1250.00,
};

export default function InvoicesPage() {
  return (
    <Card className="max-w-4xl mx-auto my-8 font-sans shadow-lg">
      <CardHeader className="bg-muted/30 p-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">E-Arşiv Fatura</h1>
                <p className="text-muted-foreground">Fatura No: {invoice.invoiceNumber}</p>
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
                <p className="text-sm"><span className="font-medium text-gray-600">e-Arşiv No:</span> {invoice.eArchiveNumber}</p>
                <p className="text-sm"><span className="font-medium text-gray-600">Fatura Tarihi:</span> {invoice.date}</p>
                <p className="text-sm"><span className="font-medium text-gray-600">Son Ödeme Tarihi:</span> {invoice.dueDate}</p>
            </div>
            <div className="space-y-2 text-left md:text-right">
                <h2 className="font-semibold text-gray-700">Üye Bilgileri</h2>
                <p className="text-sm font-medium text-gray-800">{invoice.member.name}</p>
                <p className="text-sm text-gray-600">{invoice.member.address}</p>
                <p className="text-sm text-gray-600">TCKN: {invoice.member.tc}</p>
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
                {invoice.items.map((item, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium text-gray-800">{item.description}</TableCell>
                    <TableCell className="text-center text-gray-600">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono text-gray-600">{item.unitPrice.toFixed(2)} TL</TableCell>
                    <TableCell className="text-right font-mono text-gray-600">{item.total.toFixed(2)} TL</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        <Separator />
        
        <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-mono font-medium text-gray-800">{invoice.subtotal.toFixed(2)} TL</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%{invoice.vatRate * 100}):</span>
                    <span className="font-mono font-medium text-gray-800">{invoice.vatAmount.toFixed(2)} TL</span>
                </div>
                 <div className="flex justify-between font-bold text-lg text-green-700">
                    <span>Genel Toplam:</span>
                    <span className="font-mono">{invoice.total.toFixed(2)} TL</span>
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
