import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const invoices = [
  { id: "INV001", date: "01/06/2024", amount: "250.00 TL", status: "Ödendi" },
  { id: "INV002", date: "15/05/2024", amount: "150.00 TL", status: "Ödendi" },
  { id: "INV003", date: "28/04/2024", amount: "350.00 TL", status: "Ödendi" },
  { id: "INV004", date: "10/04/2024", amount: "450.00 TL", status: "Ödendi" },
];

export default function InvoicesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Faturalarım</CardTitle>
        <CardDescription>Geçmiş fatura ve ödemeleriniz.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura ID</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead className="text-right">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="font-mono">{invoice.amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{invoice.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
