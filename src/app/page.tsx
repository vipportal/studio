
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { getMembers } from "@/lib/member-storage";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, areEnvsDefined } from "@/lib/firebase/config";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Yapılandırma Hatası",
            description: "Firebase yapılandırması yüklenemedi. Lütfen yönetici ile iletişime geçin.",
        });
        setIsLoading(false);
        return;
    }

    try {
      if (typeof window === 'undefined') return;

      if (email.toLowerCase() === "admin@vip-portal.com" && password === "admin1461") {
          localStorage.setItem('userRole', 'admin');
          router.push("/dashboard/admin");
          return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const members = await getMembers();
        const customer = members.find(m => m.id === user.uid);
        
        if (customer) {
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('loggedInUser', JSON.stringify(customer));
            router.push("/dashboard");
        } else {
             toast({
                variant: "destructive",
                title: "Giriş Başarısız",
                description: "Profil bilgileriniz bulunamadı. Lütfen yönetici ile iletişime geçin.",
            });
        }
      }

    } catch (error: any) {
      let errorMessage = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-email':
            errorMessage = "Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Şifre hatalı. Lütfen tekrar deneyin.";
            break;
          case 'auth/invalid-credential':
             errorMessage = "E-posta veya şifre hatalı.";
             break;
          default:
            errorMessage = `Bir hata oluştu: ${error.message}`;
            break;
        }
      }
      toast({
        variant: "destructive",
        title: "Giriş Hatası",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFirebaseConfigured = areEnvsDefined;

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
              {!isFirebaseConfigured && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Yapılandırma Hatası</AlertTitle>
                      <AlertDescription>
                          Firebase yapılandırma anahtarları eksik. Lütfen .env.local dosyasını kontrol edin. Uygulama düzgün çalışmayacaktır.
                      </AlertDescription>
                  </Alert>
              )}
               <div className="space-y-2">
                 <Label htmlFor="email" className="text-center block font-bold">ÜYE GİRİŞİ</Label>
               </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresiniz</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@alanadi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || !isFirebaseConfigured}
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
                  disabled={isLoading || !isFirebaseConfigured}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
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
