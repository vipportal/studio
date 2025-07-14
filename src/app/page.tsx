
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getMembers } from "@/lib/member-storage";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

const VIP_DOMAIN = "vip-portal.com";


export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined') return;

      const isPotentialAdmin = phone.toLowerCase() === "admin";
      
      // Admin login check with Firebase
      if (isPotentialAdmin && password === "admin1461") {
          localStorage.setItem('userRole', 'admin');
          router.push("/dashboard/admin");
          return;
      }
      
      // Customer login check
      const members = getMembers();
      const customer = members.find(m => m.phone === phone && m.password === password);

      if (customer) {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('loggedInUser', JSON.stringify(customer));
        router.push("/dashboard");
      } else {
         toast({
          variant: "destructive",
          title: "Giriş Başarısız",
          description: "Telefon numarası veya şifre hatalı.",
        });
      }

    } catch (error: any) {
      let description = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.";
      if (error.code === 'auth/user-not-found') {
          description = "Kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol edin.";
      } else if (error.code === 'auth/wrong-password') {
          description = "Yanlış şifre. Lütfen şifrenizi kontrol edin.";
      }
      toast({
        variant: "destructive",
        title: "Giriş Hatası",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
            <h1 className="font-headline text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-blue-600">
              HOŞ GELDİNİZ
            </h1>
            <CardDescription>Lütfen giriş yapmak için bilgilerinizi girin.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                 <Label htmlFor="phone" className="text-center block font-bold">ÜYE GİRİŞİ</Label>
               </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numaranız</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Telefon Numaranız"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifreniz</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Giriş Yap
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
