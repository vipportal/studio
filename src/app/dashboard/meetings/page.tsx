
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { getMembers } from "@/lib/member-storage";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { Separator } from "@/components/ui/separator";

export default function MeetingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminMember | null>(null);

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
        const loggedInUser = JSON.parse(loggedInUserData);
        const allMembers = getMembers();
        const freshUserData = allMembers.find(m => m.id === loggedInUser.id);
        setCurrentUser(freshUserData || null);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Planlama Başarılı",
        description: `Görüşmeniz ${date ? format(date, "PPP") : ""} için başarıyla oluşturuldu.`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Görüşme Planlayıcı</h1>
        <p className="text-muted-foreground">
          Yeni bir görüşme oluşturmak için takvimden bir gün seçin ve bilgileri girin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardContent className="p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full"
                        disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                </CardContent>
            </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Görüşme Detayları</CardTitle>
              <CardDescription>
                {date ? format(date, "PPP") : "Lütfen bir tarih seçin"}
              </CardDescription>
              {currentUser?.meetingInfo && (
                <>
                    <Separator className="my-2" />
                    <p className="text-lg font-bold text-foreground pt-2">
                        {currentUser.meetingInfo}
                    </p>
                </>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input id="subject" placeholder="Örn: Akşam Yemeği Planı" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="duration">Süre (dakika)</Label>
                  <Input id="duration" type="number" placeholder="Örn: 90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea id="notes" placeholder="Eklemek istediğiniz notlar..." />
                </div>
                <Button type="submit" className="w-full">
                  Görüşme Oluştur
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
