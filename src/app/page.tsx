
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loading: authLoading } = useAuth(); // Use the loading state from the hook

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
      // signInWithEmailAndPassword handles the auth state.
      // The useAuth hook will detect the change and handle redirection automatically.
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let errorMessage = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-email':
          case 'auth/wrong-password':
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
  
  // Render a loading state or nothing while the hook is verifying the auth state
  if (authLoading) {
     return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
           <Loader2 className="h-8 w-8 animate-spin" />
        </main>
     )
  }

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
